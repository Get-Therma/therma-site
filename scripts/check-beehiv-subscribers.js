// scripts/check-beehiv-subscribers.js
require('dotenv').config({ path: '.env.local' });

async function checkBeehivSubscribers() {
  console.log('🔍 Checking Beehiv Subscribers\n');

  if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
    console.error('❌ Beehiv API key or Publication ID not found');
    return;
  }

  try {
    // Get recent subscribers
    console.log('📊 Fetching recent subscribers...');
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions?limit=10`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Successfully fetched subscribers');
      console.log('📊 Total subscribers:', data.data?.length || 0);
      console.log('');
      
      if (data.data && data.data.length > 0) {
        console.log('📋 Recent subscribers:');
        data.data.forEach((subscriber, index) => {
          console.log(`   ${index + 1}. ${subscriber.email}`);
          console.log(`      Status: ${subscriber.status}`);
          console.log(`      Created: ${new Date(subscriber.created * 1000).toISOString()}`);
          console.log(`      Source: ${subscriber.source || 'Unknown'}`);
          console.log(`      ID: ${subscriber.id}`);
          console.log('');
        });
      } else {
        console.log('📭 No subscribers found');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error fetching subscribers:', errorText);
    }

    // Test creating a new subscriber
    console.log('🧪 Testing new subscriber creation...');
    const testEmail = `verification-test-${Date.now()}@example.com`;
    
    const createResponse = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email: testEmail,
        reactivate_existing: true,
        double_opt_in: true,
        source: 'Verification Test'
      })
    });

    console.log('📊 Create Response Status:', createResponse.status);
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ New subscriber created successfully');
      console.log('📧 Email:', createData.data?.email);
      console.log('📊 Status:', createData.data?.status);
      console.log('🆔 ID:', createData.data?.id);
      console.log('📅 Created:', new Date(createData.data?.created * 1000).toISOString());
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Error creating subscriber:', errorText);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run check
checkBeehivSubscribers().catch(console.error);
