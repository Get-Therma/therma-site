import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { waitlist } from '../../../lib/schema';

export async function POST(req: Request) {
  try {
    const { action, batchSize = 10, dryRun = false } = await req.json();
    
    if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
      return NextResponse.json({ error: 'Beehiv not configured' }, { status: 500 });
    }

    if (action === 'sync-all-to-beehiv') {
      console.log('Starting bulk sync from database to Beehiv...');
      
      const db = await getDb();
      const allEmails = await db.select().from(waitlist).orderBy(waitlist.createdAt);
      
      console.log(`Found ${allEmails.length} emails in database`);
      
      const results = {
        total: allEmails.length,
        successful: 0,
        failed: 0,
        skipped: 0,
        errors: [] as string[]
      };

      // Process in batches to avoid overwhelming Beehiv API
      for (let i = 0; i < allEmails.length; i += batchSize) {
        const batch = allEmails.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allEmails.length / batchSize)}`);
        
        for (const emailRecord of batch) {
          try {
            if (dryRun) {
              console.log(`[DRY RUN] Would sync: ${emailRecord.email}`);
              results.successful++;
              continue;
            }

            console.log(`Syncing ${emailRecord.email} to Beehiv...`);
            
            const res = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
              },
              body: JSON.stringify({
                email: emailRecord.email,
                reactivate_existing: true,
                double_opt_in: false, // Skip double opt-in for existing subscribers
                source: 'Database Sync'
              }),
              cache: 'no-store'
            });

            const responseText = await res.text();
            
            if (res.ok) {
              console.log(`✅ Successfully synced: ${emailRecord.email}`);
              results.successful++;
            } else if (res.status === 400 && responseText.includes('already exists')) {
              console.log(`⚠️ Already exists in Beehiv: ${emailRecord.email}`);
              results.skipped++;
            } else {
              console.error(`❌ Failed to sync ${emailRecord.email}:`, res.status, responseText);
              results.failed++;
              results.errors.push(`${emailRecord.email}: ${responseText}`);
            }
            
            // Small delay between requests to be respectful to Beehiv API
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error(`❌ Error syncing ${emailRecord.email}:`, error);
            results.failed++;
            results.errors.push(`${emailRecord.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        
        // Longer delay between batches
        if (i + batchSize < allEmails.length) {
          console.log('Waiting 2 seconds before next batch...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      return NextResponse.json({
        success: true,
        message: dryRun ? 'Dry run completed' : 'Bulk sync completed',
        results
      });
    }

    if (action === 'check-beehiv-status') {
      // Check Beehiv API connectivity and publication status
      try {
        const res = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}`, {
          headers: {
            'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({
            success: true,
            publication: {
              name: data.name,
              id: data.id,
              status: data.status
            }
          });
        } else {
          return NextResponse.json({
            error: 'Failed to connect to Beehiv',
            status: res.status,
            response: await res.text()
          }, { status: res.status });
        }
      } catch (error) {
        return NextResponse.json({
          error: 'Beehiv API error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    if (action === 'get-sync-stats') {
      // Get statistics about sync status
      const db = await getDb();
      const allEmails = await db.select().from(waitlist);
      
      return NextResponse.json({
        totalEmailsInDatabase: allEmails.length,
        beehiivConfigured: !!(process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID),
        resendConfigured: !!process.env.RESEND_API_KEY,
        publicationId: process.env.BEEHIIV_PUBLICATION_ID
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ 
      error: 'Sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
