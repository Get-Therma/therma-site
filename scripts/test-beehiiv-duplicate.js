#!/usr/bin/env node

/**
 * Test Beehiiv Duplicate Detection
 * Tests what Beehiiv actually returns for duplicate emails
 */

require('dotenv').config({ path: '.env.local' });

const testEmail = process.argv[2] || 'test@example.com';

async function testBeehiivDuplicate() {
  console.log('🧪 Testing Beehiiv Duplicate Detection\n');
  console.log(`📧 Test email: ${testEmail}\n`);

  if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
    console.error('❌ BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID not set in .env.local');
    return;
  }

  try {
    // First submission - should succeed
    console.log('1️⃣ First submission (should succeed)...');
    const response1 = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email: testEmail,
        reactivate_existing: false,
        double_opt_in: true,
        source: 'Test Script'
      })
    });

    const result1 = response1.ok ? await response1.json() : await response1.text();
    console.log('   Status:', response1.status);
    console.log('   Response:', JSON.stringify(result1, null, 2));
    console.log('');

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Second submission - should be rejected as duplicate
    console.log('2️⃣ Second submission (should be duplicate)...');
    const response2 = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email: testEmail,
        reactivate_existing: false,
        double_opt_in: true,
        source: 'Test Script'
      })
    });

    const result2 = response2.ok ? await response2.json() : await response2.text();
    console.log('   Status:', response2.status);
    console.log('   Response:', JSON.stringify(result2, null, 2));
    console.log('');

    // Analyze results
    console.log('📊 Analysis:');
    if (response1.status === 200 || response1.status === 201) {
      console.log('   ✅ First submission: Accepted');
    } else {
      console.log('   ⚠️  First submission: Unexpected status', response1.status);
    }

    if (response2.status === 400 || response2.status === 409 || response2.status === 422) {
      const errorText = typeof result2 === 'string' ? result2 : JSON.stringify(result2);
      if (errorText.toLowerCase().includes('already') || errorText.toLowerCase().includes('duplicate')) {
        console.log('   ✅ Second submission: Correctly rejected as duplicate');
      } else {
        console.log('   ⚠️  Second submission: Rejected but error message unclear');
        console.log('   Error:', errorText);
      }
    } else if (response2.status === 200 || response2.status === 201) {
      console.log('   ❌ Second submission: ACCEPTED (should have been rejected!)');
      console.log('   This means Beehiiv is not rejecting duplicates with reactivate_existing: false');
    } else {
      console.log('   ⚠️  Second submission: Unexpected status', response2.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBeehiivDuplicate().catch(console.error);

