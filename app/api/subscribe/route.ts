import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ThankYouEmailTemplate } from '../../../lib/email-templates';

export async function POST(req: Request) {
  try {
    const { email, source, utm_source, utm_medium, utm_campaign } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    console.log('Processing subscription for:', email);
    console.log('Beehiiv API Key exists:', !!process.env.BEEHIIV_API_KEY);
    console.log('Publication ID exists:', !!process.env.BEEHIIV_PUBLICATION_ID);

    // Subscribe to Beehiiv
    const res = await fetch('https://api.beehiiv.com/v2/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ApiKey': process.env.BEEHIIV_API_KEY ?? ''
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

    const data = await res.json();
    console.log('Beehiiv response status:', res.status);
    console.log('Beehiiv response data:', data);
    
    if (!res.ok) {
      return NextResponse.json({ 
        error: data?.message || 'Subscription failed',
        details: data,
        status: res.status 
      }, { status: res.status });
    }

    // Send thank you email (only if Resend API key is available)
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
      } catch (emailError) {
        console.error('Failed to send thank you email:', emailError);
        // Don't fail the entire request if email fails
      }
    } else {
      console.log('No Resend API key found, skipping email');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json({ 
      error: 'Invalid request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
