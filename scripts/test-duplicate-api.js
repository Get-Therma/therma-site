#!/usr/bin/env node

/**
 * Test script to verify duplicate detection in the subscribe API
 * Usage: node scripts/test-duplicate-api.js <email> [baseUrl]
 */

require('dotenv').config({ path: '.env.local' });

async function testDuplicateAPI(email, baseUrl = 'http://localhost:3000') {
  console.log('🧪 Testing Duplicate Detection API\n');
  console.log(`📧 Test email: ${email}`);
  console.log(`🌐 Base URL: ${baseUrl}\n`);

  try {
    // First submission (should succeed)
    console.log('1️⃣ First submission (should succeed)...');
    const response1 = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        source: 'Test Script'
      })
    });

    const data1 = await response1.json();
    console.log(`   Status: ${response1.status}`);
    console.log(`   Response:`, JSON.stringify(data1, null, 2));
    console.log('');

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Second submission (should be duplicate)
    console.log('2️⃣ Second submission (should be duplicate)...');
    const response2 = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        source: 'Test Script'
      })
    });

    const data2 = await response2.json();
    console.log(`   Status: ${response2.status}`);
    console.log(`   Response:`, JSON.stringify(data2, null, 2));
    console.log('');

    // Analysis
    console.log('📊 Analysis:');
    if (response1.status === 200 || response1.status === 201) {
      console.log('   ✅ First submission: Accepted');
    } else {
      console.log(`   ⚠️ First submission: ${response1.status} (unexpected)`);
    }

    if (response2.status === 409) {
      console.log('   ✅ Second submission: Correctly rejected as duplicate (409)');
    } else if (response2.status === 200 || response2.status === 201) {
      console.log('   ❌ Second submission: ACCEPTED (should have been rejected!)');
      console.log('   ⚠️ Duplicate detection is NOT working');
    } else {
      console.log(`   ⚠️ Second submission: ${response2.status} (unexpected)`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Make sure the dev server is running: npm run dev');
    }
    process.exit(1);
  }
}

const email = process.argv[2] || `test-duplicate-${Date.now()}@example.com`;
const baseUrl = process.argv[3] || 'http://localhost:3000';

testDuplicateAPI(email, baseUrl).catch(console.error);

