#!/usr/bin/env node

/**
 * Test duplicate detection end-to-end
 */

require('dotenv').config({ path: '.env.local' });

const testEmail = process.argv[2] || `test-duplicate-${Date.now()}@example.com`;

async function testDuplicate() {
  console.log('🧪 Testing Duplicate Detection\n');
  console.log(`📧 Test email: ${testEmail}\n`);

  const apiUrl = 'http://localhost:3000/api/subscribe';

  try {
    // First submission
    console.log('1️⃣ First submission (should succeed)...');
    const res1 = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, source: 'Test' })
    });
    
    const data1 = await res1.json();
    console.log(`   Status: ${res1.status}`);
    console.log(`   Response:`, JSON.stringify(data1, null, 2));
    console.log('');

    if (res1.status !== 200 && res1.status !== 201) {
      console.log('❌ First submission failed - cannot test duplicate');
      return;
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Second submission (should be duplicate)
    console.log('2️⃣ Second submission (should be duplicate)...');
    const res2 = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, source: 'Test' })
    });
    
    const data2 = await res2.json();
    console.log(`   Status: ${res2.status}`);
    console.log(`   Response:`, JSON.stringify(data2, null, 2));
    console.log('');

    // Analysis
    console.log('📊 Analysis:');
    if (res2.status === 409 && data2.duplicate) {
      console.log('   ✅ DUPLICATE DETECTION WORKING!');
      console.log('   ✅ API correctly returns 409 with duplicate: true');
    } else {
      console.log('   ❌ DUPLICATE DETECTION NOT WORKING');
      console.log(`   Expected: status 409, duplicate: true`);
      console.log(`   Got: status ${res2.status}, duplicate: ${data2.duplicate}`);
      console.log(`   Message: ${data2.message || data2.error || 'N/A'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Make sure the dev server is running: npm run dev');
    }
  }
}

testDuplicate();
