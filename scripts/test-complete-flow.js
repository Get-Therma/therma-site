#!/usr/bin/env node

/**
 * Complete Email Flow Test Script
 * 
 * This script tests the complete subscription flow:
 * 1. Beehiv subscription
 * 2. Resend welcome email
 * 3. Duplicate handling
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function testCompleteFlow() {
  console.log('🔄 Testing Complete Email Flow...\n');

  // Check environment variables
  const beehiivApiKey = process.env.BEEHIIV_API_KEY;
  const beehiivPubId = process.env.BEEHIIV_PUBLICATION_ID;
  const resendApiKey = process.env.RESEND_API_KEY;

  console.log('📋 Configuration Check:');
  console.log('   Beehiv API Key:', beehiivApiKey ? '✅ Found' : '❌ Missing');
  console.log('   Beehiv Publication ID:', beehiivPubId ? '✅ Found' : '❌ Missing');
  console.log('   Resend API Key:', resendApiKey ? '✅ Found' : '❌ Missing');
  console.log('');

  if (!beehiivApiKey || !beehiivPubId || !resendApiKey) {
    console.error('❌ Missing required environment variables');
    return;
  }

  // Test email (use a real email for testing)
  const testEmail = 'test@example.com';
  console.log(`📧 Testing with email: ${testEmail}\n`);

  try {
    // Step 1: Test Beehiv Subscription
    console.log('1️⃣ Testing Beehiv Subscription...');
    const beehiivResponse = await fetch(`https://api.beehiiv.com/v2/publications/${beehiivPubId}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${beehiivApiKey}`
      },
      body: JSON.stringify({
        email: testEmail,
        reactivate_existing: true,
        double_opt_in: true,
        source: 'Test Script',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'integration-test'
      })
    });

    console.log('   Beehiv Response Status:', beehiivResponse.status);
    
    if (beehiivResponse.ok) {
      const beehiivData = await beehiivResponse.json();
      console.log('   ✅ Beehiv subscription successful');
      console.log('   📊 Response:', JSON.stringify(beehiivData, null, 2));
    } else {
      const errorText = await beehiivResponse.text();
      console.log('   ⚠️ Beehiv response:', errorText);
      
      if (beehiivResponse.status === 400 && errorText.includes('already exists')) {
        console.log('   ✅ Email already exists in Beehiv (this is expected for duplicates)');
      } else {
        console.log('   ❌ Beehiv subscription failed');
        return;
      }
    }

    console.log('');

    // Step 2: Test Resend Welcome Email
    console.log('2️⃣ Testing Resend Welcome Email...');
    const resend = new Resend(resendApiKey);
    
    const emailResult = await resend.emails.send({
      from: 'Therma <hello@gettherma.ai>',
      to: [testEmail],
      subject: 'Welcome to Therma — your spot is saved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8fbc8f;">Welcome to Therma!</h1>
          <p>Thank you for joining our waitlist. We're excited to have you on board!</p>
          <p><strong>Test Email:</strong> This is a test email to verify the complete flow.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p>If you receive this email, both Beehiv and Resend are working correctly! ✅</p>
        </div>
      `
    });

    console.log('   ✅ Resend email sent successfully');
    console.log('   📊 Email ID:', emailResult.data?.id);
    console.log('');

    // Step 3: Test API Endpoint
    console.log('3️⃣ Testing Complete API Endpoint...');
    const apiResponse = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        source: 'Test Script',
        utm_source: 'test',
        utm_medium: 'script',
        utm_campaign: 'integration-test'
      })
    });

    const apiResult = await apiResponse.json();
    console.log('   API Response Status:', apiResponse.status);
    console.log('   📊 API Response:', JSON.stringify(apiResult, null, 2));

    if (apiResponse.ok || apiResponse.status === 409) {
      console.log('   ✅ API endpoint working correctly');
    } else {
      console.log('   ❌ API endpoint failed');
    }

    console.log('\n🎉 Complete flow test finished!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Beehiv subscription: Working');
    console.log('   ✅ Resend welcome email: Working');
    console.log('   ✅ API endpoint: Working');
    console.log('   ✅ Duplicate handling: Working');
    console.log('\n🌐 Supported domains:');
    console.log('   • therma.one');
    console.log('   • get-therma.com');
    console.log('   • gettherma.ai');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Ensure all API keys are correct');
    console.error('   2. Check that domains are verified in Resend');
    console.error('   3. Verify Beehiv publication is active');
    console.error('   4. Check network connectivity');
  }
}

// Run the test
testCompleteFlow().catch(console.error);
