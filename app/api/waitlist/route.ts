import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { waitlist } from '../../../lib/schema';

export async function POST(request: NextRequest) {
  try {
    const { email, utm_source, utm_medium, utm_campaign } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Create attribution object
    const attribution = {
      utm_campaign: utm_campaign || null,
      utm_medium: utm_medium || null,
      utm_source: utm_source || null,
    };

    // Insert into database
    const result = await db.insert(waitlist).values({
      email: email.toLowerCase().trim(),
      attribution: JSON.stringify(attribution),
      referer: utm_source || null,
    }).returning();

    console.log('Waitlist submission saved:', result[0]);

    // Submit to Beehiiv API (server-side to avoid CORS)
    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    
    if (beehiivApiKey && beehiivApiKey !== 'YOUR_BEEHIIV_API_KEY') {
      try {
        const beehiivResponse = await fetch('https://api.beehiiv.com/v2/publications/pub_0365e6c3-9f7c-4e2c-b315-bb3cd68b205e/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${beehiivApiKey}`
          },
          body: JSON.stringify({
            email: email,
            utm_source: utm_source || '',
            utm_medium: utm_medium || 'website',
            utm_campaign: utm_campaign || 'waitlist',
            reactivate_existing: false,
            send_welcome_email: true
          })
        });

        if (!beehiivResponse.ok) {
          const errorText = await beehiivResponse.text();
          console.error('Beehiiv API error:', beehiivResponse.status, errorText);
        } else {
          const beehiivResult = await beehiivResponse.json();
          console.log('Beehiiv subscription created:', beehiivResult);
        }
      } catch (beehiivError) {
        console.error('Beehiiv API error:', beehiivError);
        // Don't fail the entire request if Beehiiv fails
      }
    } else {
      console.log('Beehiiv API key not configured. Email logged locally:', email);
    }

    // Send email notification (optional)
    if (process.env.RESEND_API_KEY && process.env.WAITLIST_FROM && process.env.CONTACT_TO) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.WAITLIST_FROM,
            to: [process.env.CONTACT_TO],
            subject: `New Waitlist Signup: ${email}`,
            html: `
              <h2>New Waitlist Signup</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>UTM Campaign:</strong> ${utm_campaign || 'None'}</p>
              <p><strong>UTM Medium:</strong> ${utm_medium || 'None'}</p>
              <p><strong>UTM Source:</strong> ${utm_source || 'None'}</p>
              <hr>
              <p><small>Signed up at: ${new Date().toISOString()}</small></p>
              <p><small>Waitlist ID: ${result[0].id}</small></p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send waitlist email:', await emailResponse.text());
        } else {
          console.log('Waitlist email sent successfully');
        }
      } catch (emailError) {
        console.error('Waitlist email sending error:', emailError);
      }
    }

    return NextResponse.json({ 
      message: 'Successfully joined waitlist!',
      id: result[0].id 
    });

  } catch (error) {
    console.error('Waitlist submission error:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ message: 'Email already exists in waitlist' }, { status: 409 });
    }
    
    return NextResponse.json({ message: 'Failed to join waitlist' }, { status: 500 });
  }
}
