#!/usr/bin/env node

/**
 * Simple Welcome Email Test
 * 
 * This script triggers the welcome email by calling the subscribe API
 */

require('dotenv').config({ path: '.env.local' });

async function testWelcomeEmail() {
  console.log('📧 Testing Welcome Email\n');

  // Get test email from command line argument or prompt
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Enter your email address to receive the test welcome email: ', async (testEmail) => {
    readline.close();

    if (!testEmail || !testEmail.includes('@')) {
      console.error('❌ Invalid email address');
      return;
    }

    console.log(`\n📤 Sending welcome email to: ${testEmail}`);
    console.log('⏳ This will subscribe the email and send the welcome message...\n');

    try {
      // Call the local subscribe API
      const response = await fetch('http://localhost:3000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          source: 'test-script',
          utm_source: 'test',
          utm_medium: 'script',
          utm_campaign: 'welcome-email-test'
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Success!');
        console.log('📊 Response:', JSON.stringify(result, null, 2));
        console.log('\n🎉 Check your inbox for the welcome email!');
        console.log('   (May take a few seconds to arrive)\n');
      } else {
        console.error('❌ Error:', result.error || result.message);
        console.error('   Status:', response.status);
      }

    } catch (error) {
      console.error('❌ Error sending test email:', error.message);
      console.error('\n🔍 Make sure:');
      console.error('   1. Your dev server is running (npm run dev)');
      console.error('   2. RESEND_API_KEY is set in .env.local');
      console.error('   3. BEEHIIV_API_KEY is set in .env.local');
    }
  });
}

testWelcomeEmail().catch(console.error);









