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

    // Normalize email (lowercase and trim) for consistent duplicate detection
    const normalizedEmail = email.toLowerCase().trim();

    // Get domain configuration based on request
    const domainConfig = getDomainFromRequest(req);
    
    console.log('Processing subscription for:', normalizedEmail);
    console.log('Domain config:', domainConfig.domain);
    console.log('From email:', domainConfig.fromEmail);
    console.log('Beehiiv API Key exists:', !!process.env.BEEHIIV_API_KEY);
    console.log('Publication ID exists:', !!process.env.BEEHIIV_PUBLICATION_ID);
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);

    // CHECK FOR DUPLICATES FIRST (before attempting any inserts)
    let isDuplicate = false;
    let beehiivDuplicate = false;
    
    try {
      const db = await getDb();
      console.log('Checking database for duplicate email:', normalizedEmail);
      
      // Use a more explicit query to ensure it works
      // Also try case-insensitive search as a fallback
      const existingEmail = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, normalizedEmail))
        .limit(1);
      
      console.log('Database query result:', existingEmail.length, 'existing records found');
      
      if (existingEmail.length > 0) {
        console.log('✅ Email already exists in database (duplicate):', normalizedEmail);
        console.log('Existing record:', JSON.stringify(existingEmail[0], null, 2));
        isDuplicate = true;
      } else {
        console.log('✅ Email not found in database (new email):', normalizedEmail);
      }
    } catch (dbError: any) {
      console.error('❌ Error checking for duplicate in database:', dbError);
      console.error('Error details:', {
        message: dbError?.message,
        code: dbError?.code,
        stack: dbError?.stack,
        name: dbError?.name
      });
      // If database is completely unavailable, we should still try to prevent duplicates
      // by checking Beehiv and catching on insert
      // But log this as a warning
      console.warn('⚠️ Database duplicate check failed - will rely on insert constraint and Beehiv check');
    }

    // If duplicate found in database, skip Beehiv and return early
    if (isDuplicate) {
      console.log('Duplicate detected in database, skipping Beehiv and email sending');
      return NextResponse.json({ 
        error: 'Email already exists',
        message: 'This email address is already subscribed to our waitlist.',
        duplicate: true,
        beehiivDuplicate: false,
        databaseDuplicate: true,
        beehiivSuccess: false,
        emailSuccess: false,
        dbSuccess: true
      }, { status: 409 }); // 409 Conflict status for duplicates
    }

    // Try to subscribe to Beehiiv (optional - don't fail if it doesn't work)
    let beehiivSuccess = false;
    if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
      // Retry mechanism for Beehiv
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`Beehiiv attempt ${attempt}/2 for email: ${normalizedEmail}`);
          const res = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
            },
            body: JSON.stringify({
              email: normalizedEmail,
              reactivate_existing: false, // Set to false to reject duplicates instead of reactivating
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
            
            // Check if this was a reactivation (existing subscriber)
            // Beehiv returns status: "active" for new, "reactivated" for existing
            if (data?.data?.status === 'reactivated' || data?.status === 'reactivated') {
              console.log('Beehiv indicates this was a reactivation (duplicate)');
              beehiivDuplicate = true;
            }
          } else {
            const errorText = await res.text();
            console.log('Beehiiv error response:', errorText);
            console.log('Beehiiv error status:', res.status);
            
            // Check if it's a duplicate error (common Beehiv response)
            // With reactivate_existing: false, Beehiiv will return 400 for duplicates
            const lowerErrorText = errorText.toLowerCase();
            const isDuplicateError = 
              res.status === 400 && (
                lowerErrorText.includes('already exists') || 
                lowerErrorText.includes('already subscribed') || 
                lowerErrorText.includes('duplicate') ||
                lowerErrorText.includes('subscription already') ||
                lowerErrorText.includes('email already') ||
                lowerErrorText.includes('already in')
              );
            
            if (isDuplicateError) {
              console.log('🚫 DUPLICATE DETECTED in Beehiiv');
              console.log('Email already exists in Beehiiv (duplicate)');
              beehiivSuccess = true; // Consider this handled
              beehiivDuplicate = true; // Mark as duplicate
            } else {
              // Log detailed error for debugging
              console.error('Beehiiv subscription failed:', {
                status: res.status,
                statusText: res.statusText,
                errorText,
                email: normalizedEmail,
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

    // If Beehiv detected duplicate, return early
    if (beehiivDuplicate) {
      console.log('Duplicate detected in Beehiv, skipping email sending and database insert');
      return NextResponse.json({ 
        error: 'Email already exists',
        message: 'This email address is already subscribed to our waitlist.',
        duplicate: true,
        beehiivDuplicate: true,
        databaseDuplicate: isDuplicate,
        beehiivSuccess: true,
        emailSuccess: false,
        dbSuccess: false
      }, { status: 409 }); // 409 Conflict status for duplicates
    }

    // Send thank you email ONLY if Beehiv successfully accepted the subscription
    let emailSuccess = false;
    let emailResult: any = null;
    
    if (process.env.RESEND_API_KEY && beehiivSuccess) {
      try {
        console.log('Sending optimized welcome email...');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Use performance-optimized email sending with React component
        const emailTemplate = ThankYouEmailTemplate({ email: normalizedEmail });
        emailResult = await sendOptimizedEmail(
          resend,
          normalizedEmail,
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

    // Store in Supabase database (only if not already a duplicate)
    let dbSuccess = false;
    
    try {
      const db = await getDb();
      
      // Try to insert - if it fails due to unique constraint, catch it
      try {
        console.log('Attempting to insert email into database:', normalizedEmail);
        await db.insert(waitlist).values({
          email: normalizedEmail,
          attribution: JSON.stringify({
            source: source ?? 'Website',
            utm_source,
            utm_medium,
            utm_campaign,
            timestamp: new Date().toISOString(),
            beehiivSuccess,
            emailSuccess
          })
        });
        console.log('✅ Email stored in Supabase database successfully');
        dbSuccess = true;
      } catch (insertError: any) {
        // Log full error for debugging
        console.log('Insert error caught - Full error object:', JSON.stringify(insertError, Object.getOwnPropertyNames(insertError), 2));
        console.log('Insert error details:', {
          code: insertError?.code,
          message: insertError?.message,
          constraint: insertError?.constraint,
          detail: insertError?.detail,
          errno: insertError?.errno,
          sqlState: insertError?.sqlState,
          name: insertError?.name
        });
        
        // Check if it's a unique constraint violation (duplicate)
        // PostgreSQL error code 23505 = unique_violation
        // Also check for various error message patterns
        const errorMessage = String(insertError?.message || '').toLowerCase();
        const errorCode = String(insertError?.code || '');
        const errorDetail = String(insertError?.detail || '').toLowerCase();
        
        const isUniqueViolation = 
          errorCode === '23505' || // PostgreSQL unique_violation
          errorCode === '23503' || // Foreign key violation (shouldn't happen but check anyway)
          errorMessage.includes('unique') || 
          errorMessage.includes('duplicate') ||
          errorMessage.includes('already exists') ||
          errorMessage.includes('violates unique constraint') ||
          errorDetail.includes('unique') ||
          errorDetail.includes('duplicate') ||
          insertError?.constraint?.includes('email') ||
          insertError?.constraint?.includes('waitlist');
          
        if (isUniqueViolation) {
          console.log('🚫 DUPLICATE DETECTED via INSERT constraint violation');
          console.log('✅ Email already exists in database (unique constraint violation):', normalizedEmail);
          console.log('   Error code:', errorCode);
          console.log('   Error message:', insertError?.message);
          isDuplicate = true;
          dbSuccess = true; // Consider this handled
        } else {
          console.error('❌ Database insert failed with non-duplicate error');
          console.error('Error type:', typeof insertError);
          console.error('Error keys:', Object.keys(insertError || {}));
          throw insertError; // Re-throw if it's a different error
        }
      }
    } catch (dbError: any) {
      console.error('❌ FAILED to store email in database');
      console.error('Database error:', dbError);
      console.error('Error message:', dbError?.message);
      console.error('Error code:', dbError?.code);
      console.error('Error stack:', dbError?.stack);
      console.error('Full error object:', JSON.stringify(dbError, Object.getOwnPropertyNames(dbError), 2));
      dbSuccess = false;
      
      // Don't fail the entire request if database fails, but log it clearly
      console.warn('⚠️ Continuing without database storage - email may not be saved!');
    }

    // Final duplicate check - if duplicate found anywhere, return 409
    if (isDuplicate || beehiivDuplicate) {
      console.log('🚫 DUPLICATE DETECTED - Returning 409 Conflict');
      console.log('   Database duplicate:', isDuplicate);
      console.log('   Beehiv duplicate:', beehiivDuplicate);
      
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
    
    console.log('✅ No duplicates found - subscription successful');

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
