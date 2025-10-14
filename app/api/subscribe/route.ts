import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ThankYouEmailTemplate } from '../../../lib/email-templates';
import { getDb } from '../../../lib/db';
import { waitlist } from '../../../lib/schema';

export async function POST(req: Request) {
  try {
    const { email, source, utm_source, utm_medium, utm_campaign } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    console.log('Processing subscription for:', email);
    console.log('Beehiiv API Key exists:', !!process.env.BEEHIIV_API_KEY);
    console.log('Publication ID exists:', !!process.env.BEEHIIV_PUBLICATION_ID);
    console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);

    // Try to subscribe to Beehiiv (optional - don't fail if it doesn't work)
    let beehiivSuccess = false;
    if (process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID) {
      try {
        const res = await fetch('https://api.beehiiv.com/v2/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-ApiKey': process.env.BEEHIIV_API_KEY
          },
          body: JSON.stringify({
            email,
            publication_id: process.env.BEEHIIV_PUBLICATION_ID,
            reactivate_existing: true,
            double_opt_in: true,
            source: source ?? 'Website',
            utm_source,
            utm_medium,
            utm_campaign
          }),
          cache: 'no-store'
        });

        console.log('Beehiiv response status:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('Beehiiv success:', data);
          beehiivSuccess = true;
        } else {
          const errorText = await res.text();
          console.log('Beehiiv error response:', errorText);
        }
      } catch (beehiivError) {
        console.error('Beehiiv API error:', beehiivError);
        // Continue without failing the entire request
      }
    } else {
      console.log('Beehiiv not configured, skipping');
    }

    // Send thank you email (this is the main functionality)
    let emailSuccess = false;
    if (process.env.RESEND_API_KEY) {
      try {
        console.log('Sending thank you email...');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const emailResult = await resend.emails.send({
          from: 'Therma <hello@gettherma.ai>',
          to: [email],
          subject: 'Welcome to Therma! 🎉',
          react: ThankYouEmailTemplate({ email }),
        });
        console.log('Email sent successfully:', emailResult.data?.id);
        emailSuccess = true;
      } catch (emailError) {
        console.error('Failed to send thank you email:', emailError);
        // Don't fail the entire request, but log the error
      }
    } else {
      console.log('No Resend API key found, cannot send email');
    }

    // If both Beehiv and email failed, try to store in database as fallback
    let dbSuccess = false;
    if (!beehiivSuccess && !emailSuccess) {
      try {
        console.log('Storing email in database as fallback...');
        const db = await getDb();
        await db.insert(waitlist).values({
          email,
          attribution: JSON.stringify({
            source: source ?? 'Website',
            utm_source,
            utm_medium,
            utm_campaign,
            timestamp: new Date().toISOString()
          })
        });
        console.log('Email stored in database successfully');
        dbSuccess = true;
      } catch (dbError) {
        console.error('Failed to store email in database:', dbError);
      }
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
      message: emailSuccess ? 'Welcome email sent successfully!' : 
               dbSuccess ? 'Subscription saved (email service unavailable)' :
               'Subscription processed'
    });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json({ 
      error: 'Invalid request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
