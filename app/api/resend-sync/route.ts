import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { waitlist } from '../../../lib/schema';
import { eq, and, isNull, or, not, sql } from 'drizzle-orm';

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
    return NextResponse.json({ error: 'Beehiiv API not configured' }, { status: 500 });
  }

  try {
    const { action, email } = await req.json();
    const db = await getDb();

    if (action === 'sync-resend-to-beehiv') {
      // Find emails that were successfully sent via Resend but not synced to Beehiiv
      const emailsToSync = await db
        .select()
        .from(waitlist)
        .where(
          and(
            // Email was successfully sent via Resend (emailSuccess: true in attribution)
            sql`${waitlist.attribution} LIKE '%"emailSuccess":true%'`,
            // But not successfully synced to Beehiiv (beehiivSuccess: false or missing)
            or(
              sql`${waitlist.attribution} LIKE '%"beehiivSuccess":false%'`,
              sql`${waitlist.attribution} NOT LIKE '%"beehiivSuccess":true%'`
            )
          )
        );

      console.log(`Found ${emailsToSync.length} emails to sync from Resend to Beehiiv.`);

      let successCount = 0;
      let failCount = 0;
      const failedEmails: { email: string; error: string }[] = [];

      for (const entry of emailsToSync) {
        const emailToSync = entry.email;
        let beehiivSyncAttempted = false;
        let beehiivSuccess = false;
        let currentAttribution = JSON.parse(entry.attribution || '{}');

        // Skip if already marked as beehiivSuccess in attribution
        if (currentAttribution.beehiivSuccess) {
          console.log(`Email ${emailToSync} already marked as synced to Beehiiv, skipping.`);
          successCount++;
          continue;
        }

        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            console.log(`Attempting Beehiiv sync for ${emailToSync} (attempt ${attempt})...`);
            const res = await fetch('https://api.beehiiv.com/v2/subscriptions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-ApiKey': process.env.BEEHIIV_API_KEY,
              },
              body: JSON.stringify({
                email: emailToSync,
                publication_id: process.env.BEEHIIV_PUBLICATION_ID,
                reactivate_existing: true,
                double_opt_in: true,
                source: 'Resend Sync',
              }),
              cache: 'no-store',
            });

            beehiivSyncAttempted = true;

            if (res.ok) {
              console.log(`Successfully synced ${emailToSync} to Beehiiv.`);
              beehiivSuccess = true;
              successCount++;
              break; // Exit retry loop on success
            } else {
              const errorText = await res.text();
              console.error(`Beehiiv sync failed for ${emailToSync} (attempt ${attempt}):`, res.status, errorText);

              if (res.status === 400 && errorText.includes('already exists')) {
                console.log(`Email ${emailToSync} already exists in Beehiiv, marking as synced.`);
                beehiivSuccess = true;
                successCount++;
                break; // Consider success if already exists
              } else if (attempt === 2) {
                failCount++;
                failedEmails.push({ email: emailToSync, error: `Beehiiv API error: ${res.status} - ${errorText}` });
              } else {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retry
              }
            }
          } catch (error) {
            console.error(`Network error during Beehiiv sync for ${emailToSync} (attempt ${attempt}):`, error);
            beehiivSyncAttempted = true;
            if (attempt === 2) {
              failCount++;
              failedEmails.push({ email: emailToSync, error: `Network error: ${error instanceof Error ? error.message : String(error)}` });
            } else {
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retry
            }
          }
        }

        // Update attribution in DB to reflect sync attempt
        if (beehiivSyncAttempted) {
          currentAttribution.beehiivSuccess = beehiivSuccess;
          currentAttribution.lastBeehiivSyncAttempt = new Date().toISOString();
          await db
            .update(waitlist)
            .set({ attribution: JSON.stringify(currentAttribution) })
            .where(eq(waitlist.email, emailToSync));
        }
      }

      return NextResponse.json({
        message: 'Resend to Beehiiv sync process completed.',
        totalEmailsConsidered: emailsToSync.length,
        successfullySynced: successCount,
        failedToSync: failCount,
        failedEmails,
      });

    } else if (action === 'sync-specific-email' && email) {
      // Sync a specific email from Resend to Beehiiv
      const emailEntry = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, email))
        .limit(1);

      if (emailEntry.length === 0) {
        return NextResponse.json({ error: 'Email not found in database' }, { status: 404 });
      }

      const entry = emailEntry[0];
      let currentAttribution = JSON.parse(entry.attribution || '{}');

      // Check if already synced
      if (currentAttribution.beehiivSuccess) {
        return NextResponse.json({ 
          message: 'Email already synced to Beehiiv',
          alreadySynced: true 
        });
      }

      try {
        console.log(`Manually syncing ${email} to Beehiiv...`);
        const res = await fetch('https://api.beehiiv.com/v2/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-ApiKey': process.env.BEEHIIV_API_KEY,
          },
          body: JSON.stringify({
            email,
            publication_id: process.env.BEEHIIV_PUBLICATION_ID,
            reactivate_existing: true,
            double_opt_in: true,
            source: 'Manual Resend Sync',
          }),
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          currentAttribution.beehiivSuccess = true;
          currentAttribution.lastBeehiivSyncAttempt = new Date().toISOString();
          await db
            .update(waitlist)
            .set({ attribution: JSON.stringify(currentAttribution) })
            .where(eq(waitlist.email, email));

          return NextResponse.json({ 
            success: true, 
            message: 'Email synced to Beehiiv successfully', 
            data 
          });
        } else {
          const errorText = await res.text();
          if (res.status === 400 && errorText.includes('already exists')) {
            currentAttribution.beehiivSuccess = true;
            currentAttribution.lastBeehiivSyncAttempt = new Date().toISOString();
            await db
              .update(waitlist)
              .set({ attribution: JSON.stringify(currentAttribution) })
              .where(eq(waitlist.email, email));

            return NextResponse.json({ 
              success: true, 
              message: 'Email already exists in Beehiiv, marked as synced' 
            });
          } else {
            return NextResponse.json({ 
              success: false, 
              error: `Beehiiv API error: ${res.status} - ${errorText}` 
            }, { status: res.status });
          }
        }
      } catch (error) {
        console.error('Manual Beehiiv sync error:', error);
        return NextResponse.json({ 
          error: 'Failed to sync to Beehiiv', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
      }

    } else {
      return NextResponse.json({ error: 'Invalid action or missing email for sync' }, { status: 400 });
    }

  } catch (error) {
    console.error('Resend to Beehiiv sync API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
