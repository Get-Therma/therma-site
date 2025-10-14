#!/usr/bin/env node

/**
 * Vercel Cron Job Script
 * 
 * This script can be used with Vercel Cron Jobs to automatically sync
 * emails from Resend to Beehiv at regular intervals.
 * 
 * Setup:
 * 1. Add this to your vercel.json:
 *    {
 *      "crons": [
 *        {
 *          "path": "/api/automated-sync",
 *          "schedule": "0 */6 * * *"
 *        }
 *      ]
 *    }
 * 
 * 2. Set SYNC_API_TOKEN in your Vercel environment variables
 * 3. Deploy to Vercel
 */

const SYNC_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/automated-sync`
  : 'http://localhost:3000/api/automated-sync';

const SYNC_TOKEN = process.env.SYNC_API_TOKEN;

async function runAutomatedSync() {
  console.log('🤖 Starting automated sync job...');
  console.log('📍 Sync URL:', SYNC_URL);
  
  try {
    const response = await fetch(SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(SYNC_TOKEN && { 'Authorization': `Bearer ${SYNC_TOKEN}` })
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Automated sync completed successfully');
      console.log('📊 Results:', JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Automated sync failed');
      console.error('📊 Error:', JSON.stringify(data, null, 2));
    }
    
    return data;
  } catch (error) {
    console.error('❌ Automated sync error:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runAutomatedSync()
    .then(() => {
      console.log('🎉 Automated sync job completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Automated sync job failed:', error);
      process.exit(1);
    });
}

module.exports = { runAutomatedSync };
