// app/api/email-stats/route.ts
// API endpoint to get email performance metrics

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { emailEvents } from '../../../lib/schema';
import { sql, eq, and, gte, count, countDistinct } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // Optional: Add authentication for production
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const db = await getDb();
    
    // Get date range from query params (default: last 30 days)
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Count events by type
    const eventCounts = await db
      .select({
        eventType: emailEvents.eventType,
        count: count(),
      })
      .from(emailEvents)
      .where(gte(emailEvents.createdAt, startDate))
      .groupBy(emailEvents.eventType);

    // Build stats object
    const stats: Record<string, number> = {};
    eventCounts.forEach(row => {
      stats[row.eventType] = Number(row.count);
    });

    // Calculate unique emails sent (for rate calculations)
    const uniqueEmailsSent = await db
      .select({
        count: countDistinct(emailEvents.emailId),
      })
      .from(emailEvents)
      .where(
        and(
          gte(emailEvents.createdAt, startDate),
          eq(emailEvents.eventType, 'sent')
        )
      );

    const totalSent = Number(uniqueEmailsSent[0]?.count || 0);
    
    // Unique opens (deduplicated by email_id)
    const uniqueOpens = await db
      .select({
        count: countDistinct(emailEvents.emailId),
      })
      .from(emailEvents)
      .where(
        and(
          gte(emailEvents.createdAt, startDate),
          eq(emailEvents.eventType, 'opened')
        )
      );

    const totalOpened = Number(uniqueOpens[0]?.count || 0);

    // Unique clicks (deduplicated by email_id)
    const uniqueClicks = await db
      .select({
        count: countDistinct(emailEvents.emailId),
      })
      .from(emailEvents)
      .where(
        and(
          gte(emailEvents.createdAt, startDate),
          eq(emailEvents.eventType, 'clicked')
        )
      );

    const totalClicked = Number(uniqueClicks[0]?.count || 0);

    // Calculate rates
    const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0';
    const clickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : '0';
    const clickToOpenRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : '0';

    // Get recent events for activity feed
    const recentEvents = await db
      .select({
        id: emailEvents.id,
        emailId: emailEvents.emailId,
        recipientEmail: emailEvents.recipientEmail,
        eventType: emailEvents.eventType,
        linkUrl: emailEvents.linkUrl,
        createdAt: emailEvents.createdAt,
      })
      .from(emailEvents)
      .where(gte(emailEvents.createdAt, startDate))
      .orderBy(sql`${emailEvents.createdAt} desc`)
      .limit(50);

    // Get top clicked links
    const topLinks = await db
      .select({
        linkUrl: emailEvents.linkUrl,
        clicks: count(),
      })
      .from(emailEvents)
      .where(
        and(
          gte(emailEvents.createdAt, startDate),
          eq(emailEvents.eventType, 'clicked'),
          sql`${emailEvents.linkUrl} IS NOT NULL`
        )
      )
      .groupBy(emailEvents.linkUrl)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    return NextResponse.json({
      period: `Last ${days} days`,
      summary: {
        sent: totalSent,
        delivered: stats['delivered'] || 0,
        opened: totalOpened,
        clicked: totalClicked,
        bounced: stats['bounced'] || 0,
        complained: stats['complained'] || 0,
      },
      rates: {
        openRate: `${openRate}%`,
        clickRate: `${clickRate}%`,
        clickToOpenRate: `${clickToOpenRate}%`,
        bounceRate: totalSent > 0 
          ? `${(((stats['bounced'] || 0) / totalSent) * 100).toFixed(1)}%` 
          : '0%',
      },
      rawCounts: stats,
      topLinks: topLinks.map(l => ({
        url: l.linkUrl,
        clicks: Number(l.clicks)
      })),
      recentEvents: recentEvents.map(e => ({
        ...e,
        recipientEmail: e.recipientEmail 
          ? e.recipientEmail.replace(/(.{2}).*(@.*)/, '$1***$2') // Mask email
          : null
      })),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Email stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email stats' },
      { status: 500 }
    );
  }
}
