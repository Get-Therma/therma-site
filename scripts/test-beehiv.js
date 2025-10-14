#!/usr/bin/env node

/**
 * Beehiv Integration Test Script
 * 
 * This script tests the Beehiv API integration directly
 * Run this after setting up your environment variables
 */

const fetch = require('node-fetch');

async function testBeehivIntegration() {
  console.log('🧪 Testing Beehiv Integration...\n');

  // Check environment variables
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error('❌ Missing environment variables:');
    console.error('   BEEHIIV_API_KEY:', apiKey ? '✅ Set' : '❌ Missing');
    console.error('   BEEHIIV_PUBLICATION_ID:', publicationId ? '✅ Set' : '❌ Missing');
    console.error('\n📝 Please set up your .env.local file with the correct values.');
    console.error('   See BEEHIIV_SETUP_GUIDE.md for detailed instructions.');
    return;
  }

  console.log('✅ Environment variables found');
  console.log('   API Key:', apiKey.substring(0, 8) + '...');
  console.log('   Publication ID:', publicationId);
  console.log('');

  // Test email (use a test email that you can verify)
  const testEmail = `test-${Date.now()}@example.com`;
  
  try {
    console.log(`📧 Testing subscription with email: ${testEmail}`);
    
    const response = await fetch('https://api.beehiiv.com/v2/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ApiKey': apiKey
      },
      body: JSON.stringify({
        email: testEmail,
        publication_id: publicationId,
        reactivate_existing: true,
        double_opt_in: true,
        source: 'Integration Test'
      })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Response:', JSON.stringify(data, null, 2));
      console.log('\n🎉 Beehiv integration is working correctly!');
      console.log('   Check your Beehiv dashboard to see the new subscriber.');
    } else {
      const errorText = await response.text();
      console.error('❌ Error Response:', errorText);
      console.error('\n🔍 Troubleshooting:');
      console.error('   1. Verify your API key is correct');
      console.error('   2. Check that the publication ID matches your publication');
      console.error('   3. Ensure your Beehiv account is active');
      console.error('   4. Check Beehiv status page for any service issues');
    }

  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Check your internet connection');
    console.error('   2. Verify Beehiv API endpoint is accessible');
    console.error('   3. Check for any firewall or proxy issues');
  }
}

// Run the test
testBeehivIntegration().catch(console.error);
