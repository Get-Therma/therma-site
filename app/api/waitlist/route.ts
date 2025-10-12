import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
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

    // Try to insert into database (optional - will work without DB)
    let result: any = null;
    try {
      const db = await getDb();
      result = await db.insert(waitlist).values({
        email: email.toLowerCase().trim(),
        attribution: JSON.stringify(attribution),
        referer: utm_source || null,
      }).returning();
      console.log('Waitlist submission saved to database:', result[0]);
    } catch (dbError) {
      console.log('Database not available, continuing without DB storage:', dbError);
      // Continue without database - Beehiiv integration will still work
    }

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

    // Optional: Add email notifications here if needed later

    return NextResponse.json({ 
      message: 'Successfully joined waitlist!',
      id: result?.[0]?.id || 'no-db-id'
    });

  } catch (error) {
    console.error('Waitlist submission error:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ message: 'Email already exists in waitlist' }, { status: 409 });
    }
    
    return NextResponse.json({ message: 'Failed to join waitlist' }, { status: 500 });
  }
}
