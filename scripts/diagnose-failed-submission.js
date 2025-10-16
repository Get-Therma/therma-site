// scripts/diagnose-failed-submission.js
require('dotenv').config({ path: '.env.local' });

async function diagnoseFailedSubmission() {
  console.log('🔍 Diagnosing Failed Submission\n');

  if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID || !process.env.RESEND_API_KEY) {
    console.error('❌ Missing API keys');
    console.log('   BEEHIIV_API_KEY:', !!process.env.BEEHIIV_API_KEY);
    console.log('   BEEHIIV_PUBLICATION_ID:', !!process.env.BEEHIIV_PUBLICATION_ID);
    console.log('   RESEND_API_KEY:', !!process.env.RESEND_API_KEY);
    return;
  }

  try {
    // Test 1: Check API endpoint health
    console.log('🌐 Testing API endpoint health...');
    const healthResponse = await fetch('http://localhost:3001/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `health-check-${Date.now()}@example.com`,
        source: 'Health Check'
      })
    });

    console.log('   API Status:', healthResponse.status);
    if (healthResponse.ok) {
      const result = await healthResponse.json();
      console.log('   ✅ API is responding');
      console.log('   Beehiv Success:', result.beehiivSuccess);
      console.log('   Email Success:', result.emailSuccess);
      console.log('   Domain:', result.domain);
    } else {
      console.log('   ❌ API is not responding properly');
      const errorText = await healthResponse.text();
      console.log('   Error:', errorText);
    }
    console.log('');

    // Test 2: Check Beehiv API directly
    console.log('🧪 Testing Beehiv API directly...');
    const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`
      },
      body: JSON.stringify({
        email: `direct-test-${Date.now()}@example.com`,
        reactivate_existing: true,
        double_opt_in: true,
        source: 'Direct API Test'
      })
    });

    console.log('   Beehiv Status:', beehiivResponse.status);
    if (beehiivResponse.ok) {
      const beehiivData = await beehiivResponse.json();
      console.log('   ✅ Beehiv API is working');
      console.log('   Subscriber ID:', beehiivData.data?.id);
      console.log('   Status:', beehiivData.data?.status);
    } else {
      console.log('   ❌ Beehiv API error');
      const errorText = await beehiivResponse.text();
      console.log('   Error:', errorText);
    }
    console.log('');

    // Test 3: Check Resend API directly
    console.log('📧 Testing Resend API directly...');
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      const resendResult = await resend.emails.send({
        from: 'Therma <hello@therma.one>',
        to: [`resend-test-${Date.now()}@example.com`],
        subject: 'Resend API Test',
        html: '<h1>Resend API Test</h1><p>This is a test email to verify Resend is working.</p>'
      });
      
      if (resendResult.data?.id) {
        console.log('   ✅ Resend API is working');
        console.log('   Email ID:', resendResult.data.id);
      } else {
        console.log('   ❌ Resend API error');
        console.log('   Error:', resendResult.error);
      }
    } catch (resendError) {
      console.log('   ❌ Resend API exception');
      console.log('   Error:', resendError.message);
    }
    console.log('');

    // Test 4: Check recent failed submissions
    console.log('📊 Checking recent subscribers for issues...');
    const subscribersResponse = await fetch(`https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions?limit=20`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (subscribersResponse.ok) {
      const subscribersData = await subscribersResponse.json();
      console.log('   Total subscribers:', subscribersData.data?.length || 0);
      
      // Check for invalid statuses
      const invalidSubscribers = subscribersData.data?.filter(sub => sub.status === 'invalid') || [];
      const activeSubscribers = subscribersData.data?.filter(sub => sub.status === 'active') || [];
      
      console.log('   Active subscribers:', activeSubscribers.length);
      console.log('   Invalid subscribers:', invalidSubscribers.length);
      
      if (invalidSubscribers.length > 0) {
        console.log('   📋 Recent invalid subscribers:');
        invalidSubscribers.slice(0, 5).forEach((sub, index) => {
          console.log(`      ${index + 1}. ${sub.email} (${sub.status})`);
        });
      }
    } else {
      console.log('   ❌ Could not fetch subscribers');
    }
    console.log('');

    // Test 5: Check domain performance
    console.log('🌐 Testing domain performance...');
    const domains = ['therma.one', 'get-therma.com', 'gettherma.ai'];
    
    for (const domain of domains) {
      try {
        const startTime = Date.now();
        const domainResponse = await fetch('http://localhost:3001/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Host': domain
          },
          body: JSON.stringify({
            email: `domain-test-${Date.now()}@example.com`,
            source: 'Domain Test'
          })
        });
        const duration = Date.now() - startTime;
        
        if (domainResponse.ok) {
          const result = await domainResponse.json();
          console.log(`   ✅ ${domain}: ${duration}ms (${result.emailSuccess ? 'Email OK' : 'Email Failed'})`);
        } else {
          console.log(`   ❌ ${domain}: ${duration}ms (HTTP ${domainResponse.status})`);
        }
      } catch (error) {
        console.log(`   ❌ ${domain}: Error - ${error.message}`);
      }
    }
    console.log('');

    // Summary
    console.log('📋 Diagnosis Summary:');
    console.log('   • Check if the email was a test email (@example.com) - these show as "invalid"');
    console.log('   • Real emails should show as "active" or "validating"');
    console.log('   • Check your Beehiv dashboard for the specific email');
    console.log('   • Check spam folder for Resend emails');
    console.log('   • If using a real email, it should appear in the subscribers list');

  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
  }
}

// Run diagnosis
diagnoseFailedSubmission().catch(console.error);
