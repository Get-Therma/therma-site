#!/usr/bin/env node

/**
 * Comprehensive Beehiv API Debug Script
 * This script will help identify the correct API format and endpoint
 */

require('dotenv').config({ path: '.env.local' });

async function debugBeehivAPI() {
  console.log('🔍 Beehiv API Debug Tool\n');
  
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  
  console.log('📋 Current Configuration:');
  console.log('   API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : '❌ Missing');
  console.log('   Publication ID:', publicationId || '❌ Missing');
  console.log('   API Key Length:', apiKey ? apiKey.length : 0);
  console.log('   API Key Format:', apiKey ? (apiKey.startsWith('sk_') ? 'Secret Key' : apiKey.startsWith('pk_') ? 'Publishable Key' : 'UUID Format') : 'Unknown');
  console.log('');
  
  if (!apiKey || !publicationId) {
    console.error('❌ Missing required environment variables');
    return;
  }
  
  // Test different API base URLs
  const baseUrls = [
    'https://api.beehiiv.com',
    'https://app.beehiiv.com/api',
    'https://beehiiv.com/api'
  ];
  
  // Test different authentication methods
  const authMethods = [
    { name: 'X-ApiKey', header: 'X-ApiKey', value: apiKey },
    { name: 'Authorization Bearer', header: 'Authorization', value: `Bearer ${apiKey}` },
    { name: 'Authorization ApiKey', header: 'Authorization', value: `ApiKey ${apiKey}` },
    { name: 'X-API-Key', header: 'X-API-Key', value: apiKey },
    { name: 'Api-Key', header: 'Api-Key', value: apiKey }
  ];
  
  // Test different endpoints
  const endpoints = [
    '/v2/publications',
    '/v1/publications', 
    '/publications',
    '/v2/subscriptions',
    '/v1/subscriptions',
    '/subscriptions'
  ];
  
  console.log('🧪 Testing API Configuration...\n');
  
  let foundWorkingConfig = false;
  
  for (const baseUrl of baseUrls) {
    console.log(`🌐 Testing base URL: ${baseUrl}`);
    
    for (const auth of authMethods) {
      console.log(`   🔑 Testing auth: ${auth.name}`);
      
      for (const endpoint of endpoints) {
        const url = `${baseUrl}${endpoint}`;
        
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              [auth.header]: auth.value,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`      📡 ${endpoint}: ${response.status} ${response.statusText}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`      ✅ SUCCESS! Working configuration found:`);
            console.log(`         Base URL: ${baseUrl}`);
            console.log(`         Auth Method: ${auth.name}`);
            console.log(`         Endpoint: ${endpoint}`);
            console.log(`         Response: ${JSON.stringify(data, null, 2)}`);
            foundWorkingConfig = true;
            
            // If this is a publications endpoint, try to find subscription endpoint
            if (endpoint.includes('publications')) {
              console.log(`\n      🔍 Testing subscription endpoint...`);
              const subEndpoint = endpoint.replace('publications', 'subscriptions');
              const subUrl = `${baseUrl}${subEndpoint}`;
              
              try {
                const subResponse = await fetch(subUrl, {
                  method: 'POST',
                  headers: {
                    [auth.header]: auth.value,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    email: `test-${Date.now()}@example.com`,
                    publication_id: publicationId,
                    reactivate_existing: true,
                    double_opt_in: true,
                    source: 'Debug Test'
                  })
                });
                
                console.log(`         📡 ${subEndpoint}: ${subResponse.status} ${subResponse.statusText}`);
                
                if (subResponse.ok) {
                  const subData = await subResponse.json();
                  console.log(`         ✅ Subscription endpoint works!`);
                  console.log(`         Response: ${JSON.stringify(subData, null, 2)}`);
                } else {
                  const errorText = await subResponse.text();
                  console.log(`         ❌ Subscription error: ${errorText}`);
                }
              } catch (error) {
                console.log(`         ❌ Subscription error: ${error.message}`);
              }
            }
            
            console.log('');
          } else if (response.status === 401) {
            console.log(`      ❌ Unauthorized - API key issue`);
          } else if (response.status === 404) {
            console.log(`      ❌ Not found - endpoint doesn't exist`);
          } else {
            const errorText = await response.text();
            console.log(`      ❌ Error: ${errorText.substring(0, 100)}...`);
          }
        } catch (error) {
          console.log(`      ❌ Network error: ${error.message}`);
        }
      }
    }
    console.log('');
  }
  
  if (!foundWorkingConfig) {
    console.log('❌ No working configuration found. Please check:');
    console.log('   1. Your API key is correct and active');
    console.log('   2. Your publication ID is correct');
    console.log('   3. Your Beehiv account is active');
    console.log('   4. The API key has the right permissions');
    console.log('\n💡 Try generating a new API key in your Beehiv dashboard');
  } else {
    console.log('🎉 Found working configuration! Update your code with the working settings.');
  }
}

// Run the debug
debugBeehivAPI().catch(console.error);
