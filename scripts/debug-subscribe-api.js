// scripts/debug-subscribe-api.js
require('dotenv').config({ path: '.env.local' });

async function debugSubscribeAPI() {
  console.log('🔍 Debugging Subscribe API Integration\n');

  const testEmail = `debug-test-${Date.now()}@example.com`;
  console.log(`📧 Testing with email: ${testEmail}\n`);

  try {
    console.log('🌐 Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        source: 'Debug Test',
        utm_source: 'debug',
        utm_medium: 'script',
        utm_campaign: 'api-debug'
      })
    });

    const result = await response.json();
    
    console.log('📊 API Response:');
    console.log('   Status:', response.status);
    console.log('   OK:', result.ok);
    console.log('   Beehiv Success:', result.beehiivSuccess);
    console.log('   Email Success:', result.emailSuccess);
    console.log('   DB Success:', result.dbSuccess);
    console.log('   Domain:', result.domain);
    console.log('   From Email:', result.fromEmail);
    console.log('   Email Duration:', result.emailDuration);
    console.log('   Message:', result.message);
    console.log('');

    // Test Beehiv directly
    console.log('🧪 Testing Beehiv directly...');
    const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email: `direct-beehiv-${Date.now()}@example.com`,
        reactivate_existing: true,
        double_opt_in: true,
        source: 'Direct Test'
      })
    });

    console.log('   Beehiv Direct Status:', beehiivResponse.status);
    if (beehiivResponse.ok) {
      const beehiivData = await beehiivResponse.json();
      console.log('   ✅ Beehiv Direct Success:', beehiivData.data?.id);
    } else {
      const errorText = await beehiivResponse.text();
      console.log('   ❌ Beehiv Direct Error:', errorText);
    }
    console.log('');

    // Test Resend directly
    console.log('📧 Testing Resend directly...');
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      const resendResult = await resend.emails.send({
        from: 'Therma <hello@therma.one>',
        to: [`direct-resend-${Date.now()}@example.com`],
        subject: 'Direct Resend Test',
        html: '<h1>Direct Resend Test</h1>'
      });
      
      if (resendResult.data?.id) {
        console.log('   ✅ Resend Direct Success:', resendResult.data.id);
      } else {
        console.log('   ❌ Resend Direct Error:', resendResult.error);
      }
    } catch (resendError) {
      console.log('   ❌ Resend Direct Exception:', resendError.message);
    }
    console.log('');

    // Analysis
    console.log('📋 Analysis:');
    if (result.beehiivSuccess && result.emailSuccess) {
      console.log('   ✅ Both services reported success');
      console.log('   💡 Check Beehiv dashboard for new subscriber');
      console.log('   💡 Check email inbox for welcome email');
    } else if (result.beehiivSuccess && !result.emailSuccess) {
      console.log('   ⚠️  Beehiv succeeded but email failed');
      console.log('   💡 Check domain verification in Resend');
    } else if (!result.beehiivSuccess && result.emailSuccess) {
      console.log('   ⚠️  Email succeeded but Beehiv failed');
      console.log('   💡 Check Beehiv API key and publication ID');
    } else {
      console.log('   ❌ Both services failed');
      console.log('   💡 Check API keys and configuration');
    }

  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
  }
}

// Run debug
debugSubscribeAPI().catch(console.error);
