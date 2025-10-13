// app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { waitlist, contacts } from '../../../lib/schema';
import { sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, email, referer, utmSource, utmMedium, utmCampaign, userAgent, ipAddress, country, city, deviceType, browser, os } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // For now, just log analytics data
    // You can store this in a separate analytics table later
    console.log('Analytics data:', {
      sessionId,
      email,
      referer,
      utmSource,
      utmMedium,
      utmCampaign,
      userAgent,
      ipAddress,
      country,
      city,
      deviceType,
      browser,
      os,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    
    // Get basic analytics data
    const waitlistCount = await db.select({ count: sql`count(*)` }).from(waitlist);
    const contactsCount = await db.select({ count: sql`count(*)` }).from(contacts);

    return NextResponse.json({
      waitlist: waitlistCount[0]?.count || 0,
      contacts: contactsCount[0]?.count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}