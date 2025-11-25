#!/usr/bin/env node

/**
 * Test Complete Duplicate Flow
 * Tests the full duplicate detection flow including database inserts
 */

require('dotenv').config({ path: '.env.local' });

const testEmail = process.argv[2] || `test-${Date.now()}@example.com`;

async function testDuplicateFlow() {
  console.log('🧪 Testing Complete Duplicate Detection Flow\n');
  console.log(`📧 Test email: ${testEmail}\n`);

  const baseUrl = process.argv[3] || 'http://localhost:3000';

  try {
    // First submission - should succeed
    console.log('1️⃣ First submission (should succeed)...');
    const response1 = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        source: 'Duplicate Test',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'duplicate-flow-test'
      })
    });

    const result1 = await response1.json();
    console.log('   Status:', response1.status);
    console.log('   Response:', JSON.stringify(result1, null, 2));
    console.log('');

    // Wait a moment for database to update
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Second submission - should be detected as duplicate
    console.log('2️⃣ Second submission (should be duplicate)...');
    const response2 = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        source: 'Duplicate Test',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'duplicate-flow-test'
      })
    });

    const result2 = await response2.json();
    console.log('   Status:', response2.status);
    console.log('   Response:', JSON.stringify(result2, null, 2));
    console.log('');

    // Check results
    if (response1.status === 200 && response2.status === 409) {
      console.log('✅ SUCCESS: Duplicate detection is working!');
      console.log('   - First submission: Accepted (200)');
      console.log('   - Second submission: Rejected as duplicate (409)');
      console.log('   - Database duplicate:', result2.databaseDuplicate);
      console.log('   - Beehiv duplicate:', result2.beehiivDuplicate);
    } else if (response1.status === 200 && response2.status === 200) {
      console.log('❌ FAILED: Duplicate detection is NOT working');
      console.log('   - Both submissions were accepted');
      console.log('   - Check server logs for:');
      console.log('     • Database connection errors');
      console.log('     • "Database query result" messages');
      console.log('     • "Insert error caught" messages');
    } else {
      console.log('⚠️  UNEXPECTED: Check the responses above');
      console.log('   First submission status:', response1.status);
      console.log('   Second submission status:', response2.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure your dev server is running:');
    console.error('   npm run dev');
    console.error('\n   Or test against production:');
    console.error(`   node scripts/test-duplicate-flow.js ${testEmail} https://therma.one`);
  }
}

testDuplicateFlow().catch(console.error);

