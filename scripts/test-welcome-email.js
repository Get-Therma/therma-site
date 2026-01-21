#!/usr/bin/env node

/**
 * Test Welcome Email with Improved Template
 * Sends the streamlined welcome email template with CTA button
 */

require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function testWelcomeEmail() {
  console.log('📧 Testing Improved Welcome Email Template...\n');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing RESEND_API_KEY environment variable');
    return;
  }

  // Get email and optional first name from command line
  const testEmail = process.argv[2] || 'omar@gettherma.ai';
  const firstName = process.argv[3] || ''; // Optional: pass first name as 3rd argument
  
  // Personalized headline
  const headline = firstName ? `You're in, ${firstName}! 🎉` : "You're in! 🎉";
  
  console.log(`📧 Sending welcome email to: ${testEmail}`);
  if (firstName) console.log(`👤 Personalized for: ${firstName}`);
  console.log('📤 Using improved streamlined template\n');

  try {
    const resend = new Resend(apiKey);
    
    // Streamlined email template with CTA button and preheader
    const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Welcome to Therma</title>
    <!-- Preheader text - shows in inbox preview -->
    <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #F8F4ED;">
      You're in! Here's what to expect from Therma...
      &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
    <style>
      @media only screen and (max-width: 600px) {
        .email-container { padding: 20px 15px !important; }
        .email-card { padding: 20px !important; }
        .email-header { padding: 20px 15px !important; }
        .brand-logo { width: 60px !important; height: 60px !important; }
        .brand-name { font-size: 48px !important; }
        h1 { font-size: 26px !important; }
        .cta-button { padding: 14px 24px !important; }
      }
    </style>
  </head>
  <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #050F1A; background-color: #F8F4ED; margin: 0; padding: 0; min-height: 100vh; -webkit-font-smoothing: antialiased;">
    <!-- Background gradient -->
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(120% 120% at 50% 50%, rgba(52, 56, 24, 0.12) 0%, rgba(52, 56, 24, 0.05) 35%, transparent 60%), linear-gradient(135deg, #F8F4ED 0%, rgba(52, 56, 24, 0.08) 40%, rgba(52, 56, 24, 0.04) 70%, #F8F4ED 100%); z-index: -1;"></div>

    <div class="email-container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px; position: relative; z-index: 1;">
      <!-- Header -->
      <div class="email-header" style="text-align: center; margin-bottom: 30px; padding: 30px 20px; background: #FFFFFF; border-radius: 16px; border: 1px solid #E6E1D8;">
        <img 
          src="https://www.therma.one/therma-logo-80x80.png" 
          alt="Therma Logo" 
          width="80" 
          height="80"
          class="brand-logo"
          style="display: block; margin: 0 auto 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);"
        />
        <div class="brand-name" style="font-size: 56px; font-weight: 400; color: #343818; margin-bottom: 8px; font-family: Georgia, serif; letter-spacing: 1px;">
          Therma
        </div>
        <p style="font-size: 14px; margin: 0; color: #5C5C5C; font-style: italic;">
          See your patterns. Keep what works. Steady your days.
        </p>
      </div>

      <!-- Main content -->
      <div class="email-card" style="background: #FFFFFF; border-radius: 12px; padding: 30px; border: 1px solid #E6E1D8; margin-bottom: 20px;">
        <h1 style="color: #343818; font-size: 30px; margin: 0 0 20px 0; font-weight: 400; text-align: center; font-family: Georgia, serif;">
          ${headline}
        </h1>
        
        <p style="font-size: 16px; margin-bottom: 25px; color: #5C5C5C; line-height: 1.6;">
          You're officially on the Therma waitlist! We're building something special for people who want steadier, more mindful days—and you're now part of it.
        </p>

        <!-- What you'll get -->
        <div style="background: rgba(52, 56, 24, 0.06); padding: 20px 25px; border-radius: 12px; margin: 25px 0;">
          <p style="margin: 0 0 12px 0; color: #343818; font-size: 15px; font-weight: 500;">
            Here's what you'll get:
          </p>
          <div style="color: #5C5C5C;">
            <p style="margin: 8px 0; font-size: 14px;">🚀 Early access when we launch</p>
            <p style="margin: 8px 0; font-size: 14px;">✨ Exclusive updates & sneak peeks</p>
            <p style="margin: 8px 0; font-size: 14px;">🎁 Special perks for early supporters</p>
          </div>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a 
            href="https://therma.one?utm_source=email&utm_medium=welcome&utm_campaign=waitlist"
            class="cta-button"
            style="display: inline-block; background: #343818; color: #FFFFFF; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 500;"
          >
            Learn More About Therma →
          </a>
        </div>

        <!-- Social links -->
        <div style="text-align: center; margin: 25px 0; padding-top: 20px; border-top: 1px solid #E6E1D8;">
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #5C5C5C;">
            <strong>Stay connected:</strong>
          </p>
          <div>
            <a href="https://twitter.com/gettherma?utm_source=email&utm_medium=welcome&utm_campaign=waitlist" style="color: #343818; text-decoration: none; margin: 0 12px; font-size: 14px; font-weight: 500;">
              Twitter
            </a>
            <a href="https://linkedin.com/company/get-therma?utm_source=email&utm_medium=welcome&utm_campaign=waitlist" style="color: #343818; text-decoration: none; margin: 0 12px; font-size: 14px; font-weight: 500;">
              LinkedIn
            </a>
          </div>
        </div>

        <p style="font-size: 14px; color: rgba(5, 15, 26, 0.6); margin-top: 25px; text-align: center;">
          Questions? Just reply to this email—we read every message!
        </p>

        <p style="font-size: 14px; color: rgba(5, 15, 26, 0.6); margin-top: 15px; text-align: center;">
          With warmth,<br/>
          <strong style="color: #343818;">The Therma Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 15px; background: #FFFFFF; border-radius: 8px; border: 1px solid #E6E1D8;">
        <p style="font-size: 12px; color: rgba(5, 15, 26, 0.5); margin: 0; line-height: 1.4;">
          You're receiving this because you signed up for the Therma waitlist.<br/>
          If you didn't sign up, you can safely ignore this email.
        </p>
      </div>
    </div>
  </body>
</html>
    `;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Therma <support@gettherma.ai>',
      to: [testEmail],
      subject: firstName ? `You're in, ${firstName}! Welcome to Therma 🎉` : "You're in! Welcome to Therma 🎉",
      replyTo: 'support@gettherma.ai',
      html: emailHtml
    });

    if (result.data?.id) {
      console.log('✅ Welcome email sent successfully!');
      console.log(`🆔 Email ID: ${result.data.id}`);
      console.log(`📤 From: ${process.env.RESEND_FROM || 'support@gettherma.ai'}`);
      console.log(`📧 To: ${testEmail}`);
      console.log('\n🎉 Check your inbox for the improved welcome email!');
      console.log('\n📋 New features:');
      console.log('   • Preheader text for inbox preview');
      console.log('   • Personalized headline');
      console.log('   • Clear CTA button');
      console.log('   • Streamlined content (shorter)');
      console.log('   • UTM tracking on all links');
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

testWelcomeEmail().catch(console.error);
