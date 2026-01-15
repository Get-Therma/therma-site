// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { waitlist, contacts } from '../../../../lib/schema';
import { desc, sql } from 'drizzle-orm';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDb();

    // Get counts
    const waitlistCount = await db.select({ count: sql`count(*)` }).from(waitlist);
    const contactsCount = await db.select({ count: sql`count(*)` }).from(contacts);

    // Get recent entries
    const recentWaitlist = await db
      .select()
      .from(waitlist)
      .orderBy(desc(waitlist.createdAt))
      .limit(10);

    const recentContacts = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt))
      .limit(10);

    return NextResponse.json({
      waitlistCount: waitlistCount[0]?.count || 0,
      contactsCount: contactsCount[0]?.count || 0,
      recentWaitlist,
      recentContacts,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
