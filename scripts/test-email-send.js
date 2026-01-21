#!/usr/bin/env node

/**
 * Test Email Sending with Updated Configuration
 * Tests email sending with support@gettherma.ai and new logo
 */

require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function testEmailSend() {
  console.log('📧 Testing Email Send with Updated Configuration...\n');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing RESEND_API_KEY environment variable');
    return;
  }

  // Get test email from command line or use default
  const testEmail = process.argv[2] || 'test@example.com';
  
  console.log(`📧 Sending test email to: ${testEmail}`);
  console.log('📤 From: support@gettherma.ai');
  console.log('🎨 Using new Therma logo\n');

  try {
    const resend = new Resend(apiKey);
    
    const result = await resend.emails.send({
      from: 'Therma <support@gettherma.ai>',
      to: [testEmail],
      subject: 'Welcome to Therma! 🎉 (Test Email)',
      replyTo: 'support@gettherma.ai',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to Therma</title>
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #FFFFFF; background-color: #000000; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px; padding: 30px 20px; background: rgba(255, 255, 255, 0.05); border-radius: 16px;">
                <img 
                  src="https://www.therma.one/therma-logo-80x80.png" 
                  alt="Therma Logo" 
                  width="80" 
                  height="80"
                  style="display: block; margin: 0 auto 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);"
                />
                <h1 style="font-size: 48px; font-weight: 400; color: #8fbc8f; margin: 0; font-family: serif;">
                  Therma
                </h1>
              </div>
              
              <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <h2 style="color: #8fbc8f; font-size: 28px; margin: 0 0 20px 0; text-align: center;">
                  Test Email Sent! 🎉
                </h2>
                <p style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.9);">
                  This is a test email to verify the email configuration is working correctly.
                </p>
                <p style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.9);">
                  <strong>Configuration:</strong><br/>
                  • From: support@gettherma.ai<br/>
                  • Reply-To: support@gettherma.ai<br/>
                  • Logo: New Therma "Th" logo with pastel gradient
                </p>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-top: 30px; text-align: center;">
                  If you can see the logo above, the email template is working correctly! ✅
                </p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (result.data?.id) {
      console.log('✅ Email sent successfully!');
      console.log(`🆔 Email ID: ${result.data.id}`);
      console.log('\n🎉 Test email sent! Check your inbox.');
      console.log('📧 Verify that:');
      console.log('   • The email is from support@gettherma.ai');
      console.log('   • The Therma logo displays correctly');
      console.log('   • Replies go to support@gettherma.ai');
    } else {
      console.error('❌ Failed to send email:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('📋 Response:', error.response);
    }
  }
}

testEmailSend().catch(console.error);
