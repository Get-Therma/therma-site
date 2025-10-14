#!/usr/bin/env node

/**
 * Resend to Beehiiv Sync Test Script
 * 
 * This script tests the Resend to Beehiiv sync functionality
 * Run this to verify that emails sent via Resend can be synced to Beehiiv
 */

async function testResendSync() {
  console.log('🔄 Testing Resend to Beehiiv Sync...\n');

  const baseUrl = 'http://localhost:3000';

  try {
    console.log('📧 Testing Resend to Beehiiv sync functionality...');
    
    // Test bulk sync
    console.log('\n1️⃣ Testing bulk sync (should find emails with emailSuccess: true but beehiivSuccess: false):');
    const bulkSyncResponse = await fetch(`${baseUrl}/api/resend-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sync-resend-to-beehiv'
      })
    });

    const bulkSyncData = await bulkSyncResponse.json();
    console.log('   Status:', bulkSyncResponse.status);
    console.log('   Response:', JSON.stringify(bulkSyncData, null, 2));

    if (bulkSyncResponse.ok) {
      console.log('   ✅ Bulk sync completed');
      console.log(`   📊 Found ${bulkSyncData.totalEmailsConsidered} emails to sync`);
      console.log(`   ✅ Successfully synced: ${bulkSyncData.successfullySynced}`);
      console.log(`   ❌ Failed to sync: ${bulkSyncData.failedToSync}`);
    } else {
      console.log('   ❌ Bulk sync failed');
    }

    // Test specific email sync
    console.log('\n2️⃣ Testing specific email sync:');
    const testEmail = `test-sync-${Date.now()}@example.com`;
    
    const specificSyncResponse = await fetch(`${baseUrl}/api/resend-sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sync-specific-email',
        email: testEmail
      })
    });

    const specificSyncData = await specificSyncResponse.json();
    console.log('   Status:', specificSyncResponse.status);
    console.log('   Response:', JSON.stringify(specificSyncData, null, 2));

    if (specificSyncResponse.status === 404) {
      console.log('   ✅ Email not found (expected for test email)');
    } else if (specificSyncResponse.ok) {
      console.log('   ✅ Specific email sync completed');
    } else {
      console.log('   ❌ Specific email sync failed');
    }

    console.log('\n🎉 Resend to Beehiiv sync test completed!');
    console.log('\n📋 Summary:');
    console.log('   - Bulk sync: Finds emails with emailSuccess: true but beehiivSuccess: false');
    console.log('   - Specific sync: Syncs individual emails to Beehiiv');
    console.log('   - Retry logic: Attempts sync twice with delay');
    console.log('   - Duplicate handling: Treats "already exists" as success');
    console.log('   - Database updates: Updates attribution with sync status');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Make sure the development server is running (npm run dev)');
    console.error('   2. Check that the API endpoint is accessible');
    console.error('   3. Verify Beehiiv API credentials are configured');
    console.error('   4. Ensure database connection is working');
  }
}

// Run the test
testResendSync().catch(console.error);
