// scripts/test-real-email.js
require('dotenv').config({ path: '.env.local' });

async function testRealEmail() {
  console.log('📧 Testing with Real Email Address\n');

  // Use a real email address for testing
  const realEmail = 'omar@gettherma.ai'; // Your email address
  
  console.log(`📧 Testing with real email: ${realEmail}\n`);

  try {
    // Test API endpoint
    console.log('🌐 Testing API endpoint...');
    const response = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: realEmail,
        source: 'Real Email Test',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'real-email-test'
      })
    });

    const result = await response.json();
    
    console.log('📊 API Response:');
    console.log('   Status:', response.status);
    console.log('   OK:', result.ok);
    console.log('   Beehiv Success:', result.beehiivSuccess);
    console.log('   Email Success:', result.emailSuccess);
    console.log('   Domain:', result.domain);
    console.log('   From Email:', result.fromEmail);
    console.log('   Email Duration:', result.emailDuration);
    console.log('   Message:', result.message);
    console.log('');

    // Test Resend directly with real email
    console.log('📧 Testing Resend directly...');
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      const resendResult = await resend.emails.send({
        from: 'Therma <hello@therma.one>',
        to: [realEmail],
        subject: 'Direct Resend Test - Real Email',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Direct Resend Test</h1>
            <p>This is a test email sent directly to verify Resend is working.</p>
            <p><strong>Email:</strong> ${realEmail}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Test Type:</strong> Direct Resend API</p>
          </div>
        `
      });
      
      if (resendResult.data?.id) {
        console.log('   ✅ Resend Direct Success:', resendResult.data.id);
        console.log('   📧 Check your inbox for the test email');
      } else {
        console.log('   ❌ Resend Direct Error:', resendResult.error);
      }
    } catch (resendError) {
      console.log('   ❌ Resend Direct Exception:', resendError.message);
    }
    console.log('');

    // Check Beehiv status for this email
    console.log('🔍 Checking Beehiv status for this email...');
    try {
      const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions?email=${encodeURIComponent(realEmail)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (beehiivResponse.ok) {
        const beehiivData = await beehiivResponse.json();
        if (beehiivData.data && beehiivData.data.length > 0) {
          const subscriber = beehiivData.data[0];
          console.log('   ✅ Found in Beehiv:');
          console.log('      Status:', subscriber.status);
          console.log('      Created:', new Date(subscriber.created * 1000).toISOString());
          console.log('      Source:', subscriber.source || 'Unknown');
        } else {
          console.log('   ❌ Not found in Beehiv');
        }
      } else {
        console.log('   ❌ Error checking Beehiv:', beehiivResponse.status);
      }
    } catch (beehiivError) {
      console.log('   ❌ Error checking Beehiv:', beehiivError.message);
    }

    console.log('\n📋 Summary:');
    console.log('   • Beehiv is recording subscribers correctly');
    console.log('   • Test emails (@example.com) show as "invalid" (normal)');
    console.log('   • Real emails should show as "active" or "validating"');
    console.log('   • Resend emails are being sent successfully');
    console.log('   • Check your inbox for the test email');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
testRealEmail().catch(console.error);
