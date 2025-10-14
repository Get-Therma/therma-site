import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { waitlist } from '../../../lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { email, action } = await req.json();
    
    if (!email || !action) {
      return NextResponse.json({ error: 'Email and action required' }, { status: 400 });
    }

    if (action === 'sync-to-beehiv') {
      // Manually sync email to Beehiv
      if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
        return NextResponse.json({ error: 'Beehiv not configured' }, { status: 500 });
      }

      console.log(`Manually syncing ${email} to Beehiv...`);
      
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
          source: 'Manual Sync'
        }),
        cache: 'no-store'
      });

      const responseText = await res.text();
      console.log('Manual Beehiv sync response:', res.status, responseText);

      if (res.ok) {
        return NextResponse.json({ 
          success: true, 
          message: 'Email synced to Beehiv successfully',
          response: responseText
        });
      } else {
        return NextResponse.json({ 
          error: 'Failed to sync to Beehiv',
          status: res.status,
          response: responseText
        }, { status: res.status });
      }
    }

    if (action === 'get-missed-emails') {
      // Get emails from database that might not be in Beehiv
      const db = await getDb();
      const emails = await db.select().from(waitlist).orderBy(waitlist.createdAt);
      
      return NextResponse.json({ 
        emails: emails.map(row => ({
          email: row.email,
          createdAt: row.createdAt,
          attribution: row.attribution
        }))
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Manual sync error:', error);
    return NextResponse.json({ 
      error: 'Sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
