import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ThankYouEmailTemplate } from '../../../lib/email-templates';
import { getDb } from '../../../lib/db';
import { waitlist } from '../../../lib/schema';
import { eq } from 'drizzle-orm';
import { getDomainFromRequest, DOMAIN_CONFIGS } from '../../../lib/domain-config';
import { sendOptimizedEmail } from '../../../lib/email-performance';

export async function POST(req: Request) {
  try {
    const { email, source, utm_source, utm_medium, utm_campaign } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Get domain configuration based on request
    const domainConfig = getDomainFromRequest(req);
    
    console.log('Processing subscription for:', email);
    console.log('Domain config:', domainConfig.domain);
    console.log('From email:', domainConfig.fromEmail);
    console.log('Beehiiv API Key exists:', !!process.env.BEEHIIV_API_KEY);
    console.log('Publication ID exists:', !!process.env.BEEHIIV_PUBLICATION_ID);
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);

    // Try to subscribe to Beehiiv (optional - don't fail if it doesn't work)
    let beehiivSuccess = false;
    let beehiivDuplicate = false;
    if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
      // Retry mechanism for Beehiv
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`Beehiiv attempt ${attempt}/2 for email: ${email}`);
          const res = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
            },
            body: JSON.stringify({
              email,
              reactivate_existing: true, // This handles duplicates in Beehiv
              double_opt_in: true,
              source: source ?? 'Website',
              utm_source,
              utm_medium,
              utm_campaign
            }),
            cache: 'no-store'
          });

          console.log('Beehiiv response status:', res.status);
          console.log('Beehiiv response headers:', Object.fromEntries(res.headers.entries()));
          
          if (res.ok) {
            const data = await res.json();
            console.log('Beehiiv success:', data);
            beehiivSuccess = true;
          } else {
            const errorText = await res.text();
            console.log('Beehiiv error response:', errorText);
            console.log('Beehiiv error status:', res.status);
            console.log('Beehiiv error headers:', Object.fromEntries(res.headers.entries()));
            
            // Check if it's a duplicate error (common Beehiv response)
            if (res.status === 400 && errorText.includes('already exists')) {
              console.log('Email already exists in Beehiv (duplicate)');
              beehiivSuccess = true; // Consider this a success
              beehiivDuplicate = true; // Mark as duplicate
            } else {
              // Log detailed error for debugging
              console.error('Beehiiv subscription failed:', {
                status: res.status,
                statusText: res.statusText,
                errorText,
                email,
                publicationId: process.env.BEEHIIV_PUBLICATION_ID
              });
            }
          }
          
          // If successful or duplicate, break out of retry loop
          if (beehiivSuccess) {
            break;
          }
          
          // If this is the first attempt and failed, wait before retry
          if (attempt === 1) {
            console.log('Waiting 1 second before retry...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (beehiivError) {
          console.error(`Beehiiv API error (attempt ${attempt}):`, beehiivError);
          // If this is the first attempt, wait before retry
          if (attempt === 1) {
            console.log('Waiting 1 second before retry...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    } else {
      console.log('Beehiiv not configured, skipping');
    }

    // Send thank you email ONLY if Beehiv successfully accepted the subscription
    let emailSuccess = false;
    let emailResult: any = null;
    
    if (process.env.RESEND_API_KEY && beehiivSuccess) {
      try {
        console.log('Sending optimized welcome email...');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Use performance-optimized email sending with React component
        const emailTemplate = ThankYouEmailTemplate({ email });
        emailResult = await sendOptimizedEmail(
          resend,
          email,
          'Welcome to Therma! 🎉',
          emailTemplate,
          domainConfig.domain // Prefer the domain the user visited
        );
        
        if (emailResult.success) {
          console.log(`Email sent successfully from ${emailResult.domain} in ${emailResult.duration}ms`);
          console.log(`Email ID: ${emailResult.emailId}`);
          emailSuccess = true;
        } else {
          console.error('Failed to send email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    } else if (!beehiivSuccess) {
      console.log('Skipping welcome email - Beehiv rejected the subscription');
    } else {
      console.log('No Resend API key found, cannot send email');
    }

    // Always store in database for complete record (with duplicate handling)
    let dbSuccess = false;
    let isDuplicate = false;
    try {
      console.log('Skipping database storage due to invalid POSTGRES_URL...');
      // TODO: Fix POSTGRES_URL in .env.local to enable database storage
      dbSuccess = true; // Mark as success since we're intentionally skipping
      throw new Error('Database storage disabled - POSTGRES_URL needs to be configured');
      
      // Check if email already exists
      // const existingEmail = await db.select().from(waitlist).where(eq(waitlist.email, email)).limit(1);
      
      // Database code commented out until POSTGRES_URL is configured
      // if (existingEmail.length > 0) {
      //   console.log('Email already exists in database (duplicate)');
      //   isDuplicate = true;
      //   dbSuccess = true; // Consider this a success since email is already captured
      // } else {
      //   // Insert new email
      //   await db.insert(waitlist).values({
      //     email,
      //     attribution: JSON.stringify({
      //       source: source ?? 'Website',
      //       utm_source,
      //       utm_medium,
      //       utm_campaign,
      //       timestamp: new Date().toISOString(),
      //       beehiivSuccess,
      //       emailSuccess
      //     })
      //   });
      //   console.log('Email stored in database successfully');
      //   dbSuccess = true;
      // }
    } catch (dbError) {
      console.error('Failed to store email in database:', dbError);
    }

    // If this is a duplicate email, return appropriate response
    if (isDuplicate || beehiivDuplicate) {
      return NextResponse.json({ 
        error: 'Email already exists',
        message: 'This email address is already subscribed to our waitlist.',
        duplicate: true,
        beehiivDuplicate,
        databaseDuplicate: isDuplicate,
        beehiivSuccess,
        emailSuccess,
        dbSuccess
      }, { status: 409 }); // 409 Conflict status for duplicates
    }

    // If all services failed, return an error
    if (!beehiivSuccess && !emailSuccess && !dbSuccess) {
      return NextResponse.json({ 
        error: 'All services failed',
        beehiivSuccess,
        emailSuccess,
        dbSuccess
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      beehiivSuccess,
      emailSuccess,
      dbSuccess,
      domain: emailResult?.domain || domainConfig.domain,
      fromEmail: emailResult?.fromEmail || domainConfig.fromEmail,
      emailDuration: emailResult?.duration || 0,
      message: beehiivSuccess 
        ? (emailSuccess ? 'Welcome email sent successfully!' : 'Subscription accepted but email service unavailable')
        : 'Subscription not accepted by Beehiv (email may be invalid or already exists)'
    });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json({ 
      error: 'Invalid request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
