#!/usr/bin/env node

/**
 * Test duplicate detection with a real email from the database
 */

require('dotenv').config({ path: '.env.local' });

const testEmail = process.argv[2] || 'test-1764063782046@example.com'; // Use an email that exists

async function testDuplicate() {
  console.log('🧪 Testing Duplicate Detection with Real Email\n');
  console.log(`📧 Test email: ${testEmail}\n`);

  const apiUrl = 'http://localhost:3000/api/subscribe';

  try {
    console.log('Submitting duplicate email...');
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: testEmail, 
        source: 'Duplicate Test' 
      })
    });
    
    const data = await res.json();
    console.log(`\n📊 Results:`);
    console.log(`   Status: ${res.status}`);
    console.log(`   Duplicate flag: ${data.duplicate}`);
    console.log(`   Message: ${data.message || data.error}`);
    console.log(`   Full response:`, JSON.stringify(data, null, 2));
    
    if (res.status === 409 && data.duplicate) {
      console.log('\n✅ SUCCESS: Duplicate detection is working!');
    } else {
      console.log('\n❌ FAILED: Duplicate detection is NOT working!');
      console.log(`   Expected: status 409, duplicate: true`);
      console.log(`   Got: status ${res.status}, duplicate: ${data.duplicate}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Make sure the dev server is running: npm run dev');
    }
  }
}

testDuplicate();

