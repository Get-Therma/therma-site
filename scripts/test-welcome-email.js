#!/usr/bin/env node

/**
 * Test Welcome Email - Full Template
 * Includes: Quote, Benefits, What is Therma, Team section
 */

require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function testWelcomeEmail() {
  console.log('📧 Testing Full Welcome Email...\n');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing RESEND_API_KEY');
    return;
  }

  const testEmail = process.argv[2] || 'omar@gettherma.ai';
  const firstName = process.argv[3] || '';
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  
  console.log(`📧 Sending to: ${testEmail}`);
  if (firstName) console.log(`👤 Personalized for: ${firstName}`);

  try {
    const resend = new Resend(apiKey);
    
    const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Welcome to Therma</title>
    <style>
      @media only screen and (max-width: 600px) {
        .email-container { padding: 20px 15px !important; }
        .email-card { padding: 20px !important; }
        .email-header { padding: 20px 15px !important; }
        .brand-logo { width: 60px !important; height: 60px !important; }
        .brand-name { font-size: 48px !important; }
        h1 { font-size: 24px !important; }
        h3 { font-size: 21px !important; }
      }
    </style>
  </head>
  <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #050F1A; background-color: #F8F4ED; margin: 0; padding: 0;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      
      <!-- Header -->
      <div class="email-header" style="text-align: center; margin-bottom: 40px; padding: 30px 20px; background: #FFFFFF; border-radius: 16px; border: 1px solid #E6E1D8;">
        <img 
          src="https://www.therma.one/therma-logo-80x80.png" 
          alt="Therma Logo" 
          width="80" 
          height="80"
          class="brand-logo"
          style="display: block; margin: 0 auto 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);"
        />
        <div class="brand-name" style="font-size: 64px; font-weight: 400; color: #343818; margin-bottom: 10px; font-family: Georgia, serif; letter-spacing: 2px;">
          Therma
        </div>
        <p style="font-size: 14px; margin: 0; color: #5C5C5C; font-style: italic;">
          See your patterns. Keep what works. Steady your days.
        </p>
      </div>

      <!-- Main Content -->
      <div class="email-card" style="background: #FFFFFF; border-radius: 12px; padding: 30px; border: 1px solid #E6E1D8; margin-bottom: 30px;">
        <h1 style="color: #343818; font-size: 32px; margin: 0 0 20px 0; font-weight: 400; text-align: center; font-family: Georgia, serif;">
          Welcome to the journey! 🎉
        </h1>
        
        <p style="font-size: 14px; margin-bottom: 20px; color: #5C5C5C;">
          ${greeting}
        </p>
        
        <p style="font-size: 14px; margin-bottom: 25px; color: #5C5C5C;">
          Thank you for joining the Therma waitlist! We're genuinely excited to have you on this journey toward steadier, more mindful days.
        </p>

        <!-- Quote -->
        <div style="background: #FEFBF3; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #343818; text-align: center;">
          <p style="font-size: 18px; font-style: italic; color: #343818; margin: 0 0 10px 0; line-height: 1.5;">
            "The mind is everything. What you think you become."
          </p>
          <p style="font-size: 14px; color: rgba(5, 15, 26, 0.6); margin: 0;">
            — Buddha, on the power of mindful awareness
          </p>
        </div>

        <!-- Benefits -->
        <div style="background: #FFFFFF; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #E6E1D8;">
          <h3 style="margin: 0 0 15px 0; color: #343818; font-size: 24px; font-weight: 400; font-family: Georgia, serif;">
            What's next on your journey?
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #5C5C5C;">
            <li style="margin-bottom: 8px; font-size: 14px;">Early access to Therma when we launch</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Exclusive updates on our progress and new features</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Special perks for our first 1,000 mindful pioneers</li>
            <li style="margin-bottom: 8px; font-size: 14px;">Science-backed insights delivered to your inbox</li>
          </ul>
        </div>

        <!-- What is Therma -->
        <div style="margin: 25px 0;">
          <h3 style="color: #343818; font-size: 24px; margin: 0 0 15px 0; font-weight: 400; font-family: Georgia, serif;">
            What is Therma?
          </h3>
          <p style="font-size: 14px; color: #5C5C5C; line-height: 1.6; margin: 0;">
            Therma is a private, AI-guided journaling app that turns your check-ins, habits, and notes into pattern maps—highlighting bright spots to keep and frictions to tweak—so small changes add up to steadier weeks.
          </p>
        </div>

        <!-- Team Section -->
        <div style="text-align: center; margin: 30px 0; padding: 25px; background: #FEFBF3; border-radius: 12px; border: 1px solid rgba(52, 56, 24, 0.2);">
          <img 
            src="https://www.therma.one/bot-avatar@1x.png" 
            alt="Therma Team" 
            width="60" 
            height="60"
            style="display: block; margin: 0 auto 20px; border-radius: 50%; border: 3px solid rgba(52, 56, 24, 0.3); box-shadow: 0 4px 12px rgba(52, 56, 24, 0.2);"
          />
          <p style="font-size: 14px; color: #5C5C5C; margin: 0 0 15px 0; line-height: 1.5;">
            We're building something special together—a tool that honors your privacy while helping you discover the patterns that make your days more meaningful.
          </p>
          <p style="font-size: 14px; color: #343818; margin: 0; font-weight: 400;">
            We can't wait to share this journey with you.
          </p>
        </div>

        <!-- Social Links -->
        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #FFFFFF; border-radius: 12px; border: 1px solid #E6E1D8;">
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #5C5C5C;">
            <strong>Stay connected:</strong>
          </p>
          <div style="margin-top: 15px;">
            <a href="https://twitter.com/gettherma" style="color: #343818; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 500;">Twitter</a>
            <a href="https://linkedin.com/company/get-therma" style="color: #343818; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 500;">LinkedIn</a>
          </div>
        </div>

        <p style="font-size: 14px; color: rgba(5, 15, 26, 0.6); margin-top: 30px; text-align: center;">
          Questions? Just reply to this email—we read every message and would love to hear from you!
        </p>

        <p style="font-size: 14px; color: rgba(5, 15, 26, 0.6); margin-top: 20px; text-align: center;">
          With warmth and anticipation,<br/>
          <strong style="color: #343818;">The Therma Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; background: #FFFFFF; border-radius: 8px; border: 1px solid #E6E1D8;">
        <p style="font-size: 12px; color: rgba(5, 15, 26, 0.6); margin: 0; line-height: 1.4;">
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
      subject: 'Welcome to Therma! 🎉',
      replyTo: 'support@gettherma.ai',
      html: emailHtml
    });

    if (result.data?.id) {
      console.log('✅ Sent!');
      console.log(`🆔 ${result.data.id}`);
    } else {
      console.error('❌ Failed:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWelcomeEmail().catch(console.error);
