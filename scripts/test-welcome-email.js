#!/usr/bin/env node

/**
 * Test Welcome Email with New Template
 * Sends the enhanced welcome email template to test the design
 */

require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Import the email template (we'll need to compile it or use a workaround)
// For now, let's use a direct approach with the template structure

async function testWelcomeEmail() {
  console.log('📧 Testing Enhanced Welcome Email Template...\n');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing RESEND_API_KEY environment variable');
    return;
  }

  // Get email from command line or use default
  const testEmail = process.argv[2] || 'omar@gettherma.ai';
  
  console.log(`📧 Sending welcome email to: ${testEmail}`);
  console.log('📤 Using enhanced email template\n');

  try {
    const resend = new Resend(apiKey);
    
    // Since we're in a Node.js script, we'll use the HTML directly
    // In production, this would use the React component via sendOptimizedEmail
    const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Welcome to Therma</title>
    <style>
      @media only screen and (max-width: 600px) {
        .email-container {
          padding: 20px 15px !important;
        }
        .email-card {
          padding: 20px !important;
        }
        .email-header {
          padding: 20px 15px !important;
        }
        .brand-logo {
          width: 60px !important;
          height: 60px !important;
        }
        .brand-name {
          font-size: 36px !important;
        }
        .tagline {
          font-size: 16px !important;
        }
        h1 {
          font-size: 24px !important;
        }
        h3 {
          font-size: 18px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: PPPangaia, system-ui, -apple-system, sans-serif; line-height: 1.6; color: #FFFFFF; background-color: #000000; margin: 0; padding: 0; min-height: 100vh; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    <!-- Background with animated gradients -->
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 20% 80%, rgba(143, 188, 143, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245, 245, 220, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(143, 188, 143, 0.15) 0%, transparent 50%), linear-gradient(135deg, #000000 0%, #1a1a1a 100%); z-index: -1;"></div>

    <div class="email-container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px; position: relative; z-index: 1;">
      <!-- Header with logo and branding -->
      <div class="email-header" style="text-align: center; margin-bottom: 40px; padding: 30px 20px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);">
        <img 
          src="https://therma.one/therma-logo.svg" 
          alt="Therma Logo" 
          width="80" 
          height="80"
          class="brand-logo"
          style="display: block; margin: 0 auto 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);"
        />
        <div class="brand-name" style="font-size: 48px; font-weight: 400; color: #8fbc8f; margin-bottom: 10px; font-family: PPPangaia, serif; letter-spacing: 2px;">
          Therma
        </div>
        <p class="tagline" style="font-size: 18px; margin: 0; color: rgba(255, 255, 255, 0.8); font-style: italic;">
          See your patterns. Keep what works. Steady your days.
        </p>
      </div>

      <!-- Main content -->
      <div class="email-card" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); border-radius: 12px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 30px;">
        <h1 style="color: #8fbc8f; font-size: 28px; margin: 0 0 20px 0; font-weight: 400; text-align: center;">
          Welcome to the journey! 🎉
        </h1>
        
        <p style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.9);">
          Hi there,
        </p>
        
        <p style="font-size: 16px; margin-bottom: 25px; color: rgba(255, 255, 255, 0.9);">
          Thank you for joining the Therma waitlist! We're genuinely excited to have you on this journey toward steadier, more mindful days.
        </p>

        <!-- Inspirational quote -->
        <div style="background: rgba(143, 188, 143, 0.1); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #8fbc8f; text-align: center;">
          <p style="font-size: 18px; font-style: italic; color: #8fbc8f; margin: 0 0 10px 0; line-height: 1.5;">
            "The mind is everything. What you think you become."
          </p>
          <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin: 0; font-style: normal;">
            — Buddha, on the power of mindful awareness
          </p>
        </div>

        <!-- What's next section -->
        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(255, 255, 255, 0.1);">
          <h3 style="margin: 0 0 15px 0; color: #8fbc8f; font-size: 20px; font-weight: 400;">
            What's next on your journey?
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: rgba(255, 255, 255, 0.9);">
            <li style="margin-bottom: 8px; font-size: 16px;">Early access to Therma when we launch</li>
            <li style="margin-bottom: 8px; font-size: 16px;">Exclusive updates on our progress and new features</li>
            <li style="margin-bottom: 8px; font-size: 16px;">Special perks for our first 1,000 mindful pioneers</li>
            <li style="margin-bottom: 8px; font-size: 16px;">Science-backed insights delivered to your inbox</li>
          </ul>
        </div>

        <!-- Product explanation -->
        <div style="margin: 25px 0;">
          <h3 style="color: #8fbc8f; font-size: 18px; margin: 0 0 15px 0; font-weight: 400;">
            What is Therma?
          </h3>
          <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); line-height: 1.6; margin: 0;">
            Therma is a private, AI-guided journaling app that turns your check-ins, habits, and notes into pattern maps—highlighting bright spots to keep and frictions to tweak—so small changes add up to steadier weeks.
          </p>
        </div>

        <!-- Warm invitation with profile picture -->
        <div style="text-align: center; margin: 30px 0; padding: 25px; background: rgba(143, 188, 143, 0.08); border-radius: 12px; border: 1px solid rgba(143, 188, 143, 0.2);">
          <img 
            src="https://therma.one/bot-avatar@1x.png" 
            alt="Therma Team" 
            width="60" 
            height="60"
            style="display: block; margin: 0 auto 20px; border-radius: 50%; border: 3px solid rgba(143, 188, 143, 0.3); box-shadow: 0 4px 12px rgba(143, 188, 143, 0.2);"
          />
          <p style="font-size: 16px; color: rgba(255, 255, 255, 0.9); margin: 0 0 15px 0; line-height: 1.5;">
            We're building something special together—a tool that honors your privacy while helping you discover the patterns that make your days more meaningful.
          </p>
          <p style="font-size: 16px; color: #8fbc8f; margin: 0; font-weight: 400;">
            We can't wait to share this journey with you.
          </p>
        </div>

        <!-- Social links -->
        <div style="text-align: center; margin: 30px 0; padding: 20px; background: rgba(255, 255, 255, 0.03); border-radius: 12px;">
          <p style="margin: 0 0 15px 0; font-size: 16px; color: rgba(255, 255, 255, 0.8);">
            <strong>Stay connected:</strong>
          </p>
          <div style="margin-top: 15px;">
            <a href="https://twitter.com/gettherma" style="color: #8fbc8f; text-decoration: none; margin: 0 15px; font-size: 16px; font-weight: 500;">
              Twitter
            </a>
            <a href="https://linkedin.com/company/gettherma" style="color: #8fbc8f; text-decoration: none; margin: 0 15px; font-size: 16px; font-weight: 500;">
              LinkedIn
            </a>
          </div>
        </div>

        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-top: 30px; text-align: center;">
          Questions? Just reply to this email—we read every message and would love to hear from you!
        </p>

        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-top: 20px; text-align: center;">
          With warmth and anticipation,<br/>
          <strong style="color: #8fbc8f;">The Therma Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);">
        <p style="font-size: 12px; color: rgba(255, 255, 255, 0.5); margin: 0; line-height: 1.4;">
          You're receiving this because you signed up for the Therma waitlist.<br/>
          If you didn't sign up, you can safely ignore this email.
        </p>
      </div>
    </div>
  </body>
</html>
    `;

    // Use the domain config to get the best sending domain
    const { DOMAIN_CONFIGS } = require('../lib/domain-config');
    const verifiedDomain = DOMAIN_CONFIGS.find(d => d.verified) || DOMAIN_CONFIGS[0];
    
    const result = await resend.emails.send({
      from: `${verifiedDomain.fromName} <${verifiedDomain.fromEmail}>`,
      to: [testEmail],
      subject: 'Welcome to Therma! 🎉',
      replyTo: 'support@gettherma.ai',
      html: emailHtml
    });

    if (result.data?.id) {
      console.log('✅ Welcome email sent successfully!');
      console.log(`🆔 Email ID: ${result.data.id}`);
      console.log(`📤 From: ${verifiedDomain.fromEmail}`);
      console.log(`📧 To: ${testEmail}`);
      console.log('\n🎉 Check your inbox for the enhanced welcome email!');
      console.log('\n📋 Email features:');
      console.log('   • Responsive mobile design');
      console.log('   • Dark theme with gradient backgrounds');
      console.log('   • Customizable branding and colors');
      console.log('   • Personalization support');
      console.log('   • Modern glassmorphism design');
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

