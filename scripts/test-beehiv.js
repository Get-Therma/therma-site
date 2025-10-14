#!/usr/bin/env node

/**
 * Beehiv Integration Test Script
 * 
 * This script tests the Beehiv API integration directly
 * Run this after setting up your environment variables
 */

require('dotenv').config({ path: '.env.local' });
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
    
    // Try different API endpoints
    const endpoints = [
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      'https://api.beehiiv.com/v2/subscriptions',
      'https://api.beehiiv.com/v1/subscriptions',
      'https://api.beehiiv.com/subscriptions'
    ];
    
    // Try different authentication methods
    const authMethods = [
      { header: 'X-ApiKey', value: apiKey },
      { header: 'Authorization', value: `Bearer ${apiKey}` },
      { header: 'Authorization', value: `ApiKey ${apiKey}` },
      { header: 'X-API-Key', value: apiKey }
    ];
    
    let response;
    let workingEndpoint = null;
    let workingAuth = null;
    
    for (const auth of authMethods) {
      console.log(`🔍 Trying auth method: ${auth.header}`);
      
      for (const endpoint of endpoints) {
        console.log(`🔍 Trying endpoint: ${endpoint}`);
        
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            [auth.header]: auth.value
          },
          body: JSON.stringify({
            email: testEmail,
            reactivate_existing: true,
            double_opt_in: true,
            source: 'Integration Test'
          })
        });
        
        console.log(`📊 Response Status for ${endpoint} with ${auth.header}:`, response.status);
        
        if (response.status !== 404 && response.status !== 401) {
          workingEndpoint = endpoint;
          workingAuth = auth;
          break;
        }
      }
      
      if (workingEndpoint) break;
    }
    
    if (!workingEndpoint) {
      console.log('❌ All endpoints returned 404/401. Trying GET request to test API key...');
      
      // Try different GET endpoints with different auth methods
      const getEndpoints = [
        'https://api.beehiiv.com/v2/publications',
        'https://api.beehiiv.com/v1/publications',
        'https://api.beehiiv.com/publications'
      ];
      
      for (const auth of authMethods) {
        for (const endpoint of getEndpoints) {
          console.log(`🔍 Trying GET ${endpoint} with ${auth.header}`);
          
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              [auth.header]: auth.value
            }
          });
          
          console.log(`📊 GET Response Status for ${endpoint} with ${auth.header}:`, response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ API Key is valid! Publications:', JSON.stringify(data, null, 2));
            console.log(`✅ Working auth method: ${auth.header}`);
            console.log('\n🔍 The subscription endpoint might be different. Check Beehiv documentation.');
            return;
          } else if (response.status !== 404 && response.status !== 401) {
            const errorText = await response.text();
            console.log(`📊 GET Error Response:`, errorText);
          }
        }
      }
      
      console.error('❌ All API key tests failed. Please verify:');
      console.error('   1. The API key is correct and active');
      console.error('   2. The API key has the right permissions');
      console.error('   3. Your Beehiv account is active');
      console.error('   4. Check Beehiv dashboard for the correct API key');
      
      return;
    }

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
