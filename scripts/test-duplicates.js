#!/usr/bin/env node

/**
 * Duplicate Email Handling Test Script
 * 
 * This script tests the duplicate email rejection functionality
 * Run this to verify that duplicate emails are properly rejected
 */

async function testDuplicateHandling() {
  console.log('🧪 Testing Duplicate Email Handling...\n');

  const testEmail = `test-duplicate-${Date.now()}@example.com`;
  const baseUrl = 'http://localhost:3000';

  try {
    console.log(`📧 Testing with email: ${testEmail}`);
    
    // First submission - should succeed
    console.log('\n1️⃣ First submission (should succeed):');
    const firstResponse = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        source: 'Duplicate Test',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'duplicate-test'
      })
    });

    const firstData = await firstResponse.json();
    console.log('   Status:', firstResponse.status);
    console.log('   Response:', JSON.stringify(firstData, null, 2));

    if (firstResponse.ok) {
      console.log('   ✅ First submission successful');
    } else {
      console.log('   ❌ First submission failed');
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Second submission - should be rejected as duplicate
    console.log('\n2️⃣ Second submission (should be rejected as duplicate):');
    const secondResponse = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        source: 'Duplicate Test',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'duplicate-test'
      })
    });

    const secondData = await secondResponse.json();
    console.log('   Status:', secondResponse.status);
    console.log('   Response:', JSON.stringify(secondData, null, 2));

    if (secondResponse.status === 409 && secondData.duplicate) {
      console.log('   ✅ Duplicate properly rejected');
      console.log('   📊 Duplicate details:');
      console.log('      - Database duplicate:', secondData.databaseDuplicate);
      console.log('      - Beehiv duplicate:', secondData.beehiivDuplicate);
      console.log('      - Message:', secondData.message);
    } else {
      console.log('   ❌ Duplicate not properly handled');
    }

    // Test with different email - should succeed
    console.log('\n3️⃣ Different email submission (should succeed):');
    const differentEmail = `test-different-${Date.now()}@example.com`;
    const thirdResponse = await fetch(`${baseUrl}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: differentEmail,
        source: 'Duplicate Test',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'duplicate-test'
      })
    });

    const thirdData = await thirdResponse.json();
    console.log('   Status:', thirdResponse.status);
    console.log('   Response:', JSON.stringify(thirdData, null, 2));

    if (thirdResponse.ok) {
      console.log('   ✅ Different email submission successful');
    } else {
      console.log('   ❌ Different email submission failed');
    }

    console.log('\n🎉 Duplicate handling test completed!');
    console.log('\n📋 Summary:');
    console.log('   - First submission: Should succeed');
    console.log('   - Duplicate submission: Should return 409 with duplicate=true');
    console.log('   - Different email: Should succeed');
    console.log('   - Database constraint: Prevents duplicates at DB level');
    console.log('   - Frontend handling: Shows appropriate error message');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Make sure the development server is running (npm run dev)');
    console.error('   2. Check that the API endpoint is accessible');
    console.error('   3. Verify database connection is working');
  }
}

// Run the test
testDuplicateHandling().catch(console.error);
