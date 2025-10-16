#!/usr/bin/env node

/**
 * Resend Integration Test Script
 * 
 * This script tests the Resend email service integration
 * Run this after setting up your RESEND_API_KEY
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function testResendIntegration() {
  console.log('📧 Testing Resend Integration...\n');

  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('❌ Missing RESEND_API_KEY environment variable');
    console.error('\n📝 Please set up your .env.local file with:');
    console.error('   RESEND_API_KEY="your_resend_api_key"');
    console.error('\n🔗 Get your API key from: https://resend.com/api-keys');
    return;
  }

  console.log('✅ RESEND_API_KEY found');
  console.log('   API Key:', apiKey.substring(0, 8) + '...');
  console.log('');

  try {
    console.log('📧 Initializing Resend client...');
    const resend = new Resend(apiKey);

    console.log('📤 Sending test email...');
    
    const emailResult = await resend.emails.send({
      from: 'Therma <hello@gettherma.ai>',
      to: ['test@example.com'], // Use a real email for testing
      subject: 'Test Email from Therma Integration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8fbc8f;">Therma Integration Test</h1>
          <p>This is a test email to verify Resend integration is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p>If you receive this email, Resend integration is working! ✅</p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📊 Response:', JSON.stringify(emailResult, null, 2));
    console.log('\n🎉 Resend integration is working correctly!');
    console.log('   Check the recipient email to confirm delivery.');

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Verify your API key is correct');
    console.error('   2. Check that the "from" domain is verified in Resend');
    console.error('   3. Ensure your Resend account is active');
    console.error('   4. Check Resend status page for any service issues');
    console.error('\n📋 Full error details:', error);
  }
}

// Run the test
testResendIntegration().catch(console.error);
