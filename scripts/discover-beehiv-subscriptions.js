#!/usr/bin/env node

/**
 * Beehiv Subscription Endpoint Discovery Script
 * This script tests various subscription endpoint patterns
 */

require('dotenv').config({ path: '.env.local' });

async function discoverSubscriptionEndpoint() {
  console.log('🔍 Discovering Beehiv Subscription Endpoint...\n');
  
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  
  if (!apiKey || !publicationId) {
    console.error('❌ Missing environment variables');
    return;
  }
  
  console.log('📋 Configuration:');
  console.log('   API Key:', `${apiKey.substring(0, 8)}...`);
  console.log('   Publication ID:', publicationId);
  console.log('');
  
  const baseUrl = 'https://api.beehiiv.com';
  const testEmail = `test-${Date.now()}@example.com`;
  
  // Test different subscription endpoint patterns
  const subscriptionEndpoints = [
    // V2 patterns
    '/v2/publications/{publication_id}/subscriptions',
    '/v2/subscriptions',
    '/v2/publications/{publication_id}/subscribers',
    '/v2/subscribers',
    
    // V1 patterns  
    '/v1/publications/{publication_id}/subscriptions',
    '/v1/subscriptions',
    '/v1/publications/{publication_id}/subscribers',
    '/v1/subscribers',
    
    // Alternative patterns
    '/publications/{publication_id}/subscriptions',
    '/subscriptions',
    '/publications/{publication_id}/subscribers',
    '/subscribers',
    
    // Beehiv specific patterns
    '/v2/publications/{publication_id}/members',
    '/v2/members',
    '/v1/publications/{publication_id}/members',
    '/v1/members'
  ];
  
  // Test different auth methods
  const authMethods = [
    { name: 'X-ApiKey', header: 'X-ApiKey', value: apiKey },
    { name: 'Authorization Bearer', header: 'Authorization', value: `Bearer ${apiKey}` }
  ];
  
  console.log('🧪 Testing subscription endpoints...\n');
  
  let foundWorkingEndpoint = false;
  
  for (const auth of authMethods) {
    console.log(`🔑 Testing with ${auth.name}:`);
    
    for (const endpoint of subscriptionEndpoints) {
      // Replace placeholder with actual publication ID
      const actualEndpoint = endpoint.replace('{publication_id}', publicationId);
      const url = `${baseUrl}${actualEndpoint}`;
      
      try {
        // Test GET first (to see if endpoint exists)
        const getResponse = await fetch(url, {
          method: 'GET',
          headers: {
            [auth.header]: auth.value,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`   📡 GET ${actualEndpoint}: ${getResponse.status} ${getResponse.statusText}`);
        
        if (getResponse.status === 200) {
          console.log(`   ✅ GET endpoint exists!`);
          const data = await getResponse.json();
          console.log(`   📊 Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
          
          // Try POST to test subscription creation
          try {
            const postResponse = await fetch(url, {
              method: 'POST',
              headers: {
                [auth.header]: auth.value,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: testEmail,
                publication_id: publicationId,
                reactivate_existing: true,
                double_opt_in: true,
                source: 'API Test'
              })
            });
            
            console.log(`   📡 POST ${actualEndpoint}: ${postResponse.status} ${postResponse.statusText}`);
            
            if (postResponse.ok) {
              const postData = await postResponse.json();
              console.log(`   🎉 SUCCESS! Subscription created!`);
              console.log(`   📊 Response: ${JSON.stringify(postData, null, 2)}`);
              foundWorkingEndpoint = true;
            } else {
              const errorText = await postResponse.text();
              console.log(`   ❌ POST error: ${errorText.substring(0, 100)}...`);
            }
          } catch (postError) {
            console.log(`   ❌ POST error: ${postError.message}`);
          }
        } else if (getResponse.status === 401) {
          console.log(`   ❌ Unauthorized`);
        } else if (getResponse.status === 404) {
          console.log(`   ❌ Not found`);
        } else {
          const errorText = await getResponse.text();
          console.log(`   ❌ Error: ${errorText.substring(0, 100)}...`);
        }
      } catch (error) {
        console.log(`   ❌ Network error: ${error.message}`);
      }
    }
    console.log('');
  }
  
  if (!foundWorkingEndpoint) {
    console.log('❌ No working subscription endpoint found.');
    console.log('\n💡 Possible solutions:');
    console.log('   1. Check Beehiv API documentation for the correct endpoint');
    console.log('   2. Contact Beehiv support for API access');
    console.log('   3. Verify your API key has subscription management permissions');
    console.log('   4. Check if subscriptions are enabled for your publication');
  } else {
    console.log('🎉 Found working subscription endpoint!');
  }
}

// Run the discovery
discoverSubscriptionEndpoint().catch(console.error);
