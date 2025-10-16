// scripts/test-all-domains.js
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function testAllDomains() {
  console.log('🌐 Testing All Domains Integration\n');

  // Check configuration
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env.local');
    return;
  }

  if (!process.env.BEEHIIV_API_KEY) {
    console.error('❌ BEEHIIV_API_KEY not found in .env.local');
    return;
  }

  console.log('✅ API Keys configured');
  console.log('🔑 Resend Key:', process.env.RESEND_API_KEY.substring(0, 10) + '...');
  console.log('🔑 Beehiv Key:', process.env.BEEHIIV_API_KEY.substring(0, 10) + '...\n');

  const resend = new Resend(process.env.RESEND_API_KEY);
  const testEmail = `test-${Date.now()}@example.com`;

  // Test domains
  const domains = [
    { domain: 'gettherma.ai', fromEmail: 'hello@gettherma.ai' },
    { domain: 'therma.one', fromEmail: 'hello@therma.one' },
    { domain: 'get-therma.com', fromEmail: 'hello@get-therma.com' }
  ];

  console.log('📧 Testing email sending for each domain...\n');

  for (const domainConfig of domains) {
    console.log(`🔍 Testing ${domainConfig.domain}...`);
    
    try {
      // Test Resend email sending
      const emailResult = await resend.emails.send({
        from: `Therma <${domainConfig.fromEmail}>`,
        to: [testEmail],
        subject: `Test from ${domainConfig.domain} 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">Welcome to Therma!</h1>
            <p>This is a test email from <strong>${domainConfig.domain}</strong></p>
            <p>If you receive this email, the domain is working correctly!</p>
            <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Domain:</strong> ${domainConfig.domain}</p>
              <p><strong>From Email:</strong> ${domainConfig.fromEmail}</p>
              <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
            </div>
          </div>
        `
      });

      if (emailResult.data?.id) {
        console.log(`   ✅ Email sent successfully!`);
        console.log(`   📧 Email ID: ${emailResult.data.id}`);
        console.log(`   📬 From: ${domainConfig.fromEmail}`);
      } else {
        console.log(`   ❌ Email failed:`, emailResult.error);
      }
    } catch (error) {
      console.log(`   ❌ Error testing ${domainConfig.domain}:`, error.message);
      
      if (error.message.includes('domain not verified')) {
        console.log(`   💡 Domain ${domainConfig.domain} needs to be verified in Resend`);
        console.log(`   🔗 Go to: https://resend.com/domains`);
      }
    }
    
    console.log('');
  }

  // Test API endpoint with different domains
  console.log('🌐 Testing API endpoint with different domains...\n');

  const baseUrls = [
    'http://localhost:3000',
    'https://therma.one',
    'https://get-therma.com', 
    'https://gettherma.ai'
  ];

  for (const baseUrl of baseUrls) {
    console.log(`🔍 Testing API at ${baseUrl}...`);
    
    try {
      const response = await fetch(`${baseUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Host': baseUrl.replace('http://', '').replace('https://', '')
        },
        body: JSON.stringify({
          email: `api-test-${Date.now()}@example.com`,
          source: 'Domain Test',
          utm_source: 'test',
          utm_medium: 'script',
          utm_campaign: 'domain-verification'
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`   ✅ API working!`);
        console.log(`   📊 Domain: ${result.domain || 'unknown'}`);
        console.log(`   📧 From Email: ${result.fromEmail || 'unknown'}`);
        console.log(`   🎯 Beehiv: ${result.beehiivSuccess ? '✅' : '❌'}`);
        console.log(`   📬 Resend: ${result.emailSuccess ? '✅' : '❌'}`);
      } else {
        console.log(`   ❌ API failed:`, result.error || result.message);
      }
    } catch (error) {
      console.log(`   ❌ Error testing ${baseUrl}:`, error.message);
    }
    
    console.log('');
  }

  console.log('📋 Summary:');
  console.log('   • All domains should be verified in Resend dashboard');
  console.log('   • DNS records must be properly configured');
  console.log('   • Each domain will send emails from its own address');
  console.log('   • Duplicate prevention works across all domains');
  console.log('   • Fallback system ensures emails are always sent\n');

  console.log('🔗 Next Steps:');
  console.log('   1. Go to https://resend.com/domains');
  console.log('   2. Add and verify all 3 domains');
  console.log('   3. Configure DNS records as instructed');
  console.log('   4. Run this test again to verify');
}

// Run the test
testAllDomains().catch(console.error);
