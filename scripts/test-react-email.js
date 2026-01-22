#!/usr/bin/env node

/**
 * Test the welcome email template
 */

require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function testEmail() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing RESEND_API_KEY');
    return;
  }

  const testEmail = process.argv[2] || 'omar@gettherma.ai';
  const firstName = process.argv[3] || 'there';
  
  console.log(`📧 Sending to: ${testEmail}`);
  console.log(`👤 Name: ${firstName}\n`);

  try {
    const resend = new Resend(apiKey);
    
    const result = await resend.emails.send({
      from: 'Therma <support@gettherma.ai>',
      to: [testEmail],
      subject: firstName !== 'there' ? `Welcome, ${firstName}!` : 'Welcome to Therma!',
      replyTo: 'support@gettherma.ai',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Welcome to Therma</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { padding: 24px 16px !important; }
      .email-card { padding: 24px 20px !important; }
      h1 { font-size: 24px !important; }
    }
  </style>
</head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #F8F4ED; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
  
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; color: #F8F4ED; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
    Early access + DevLogs, demos, and prompts across our socials.
  </div>

  <div class="email-container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Main Card -->
    <div class="email-card" style="background: #FFFFFF; border-radius: 12px; padding: 40px 32px; border: 1px solid #E6E1D8;">
      
      <!-- Greeting -->
      <p style="font-size: 16px; margin: 0 0 24px 0; color: #1a1a1a;">
        Hi ${firstName},
      </p>

      <!-- Main Headline -->
      <h1 style="color: #343818; font-size: 28px; margin: 0 0 24px 0; font-weight: 600; line-height: 1.3;">
        You're in. Welcome to Therma.
      </h1>
      
      <!-- Intro -->
      <p style="font-size: 16px; margin: 0 0 32px 0; color: #1a1a1a; line-height: 1.7;">
        Thanks for signing up. Therma is built for people who want steadier days without broadcasting their life to the world. You'll get early access, exclusive updates, and a first look at the privacy-first journal that helps you notice what raises your temperature, and what steadies it.
      </p>

      <!-- Temperature Check Section -->
      <div style="background: #FEFBF3; border-radius: 12px; padding: 24px; margin-bottom: 32px; border-left: 4px solid #343818;">
        <p style="font-size: 16px; margin: 0 0 16px 0; color: #1a1a1a; font-weight: 600;">
          A small thing you can use today (30 seconds):
        </p>
        
        <ol style="margin: 0 0 16px 0; padding-left: 20px; color: #1a1a1a; font-size: 15px; line-height: 1.8;">
          <li style="margin-bottom: 8px;">What's the temperature of your day? <span style="color: #5C5C5C;">(cold / warm / overheated)</span></li>
          <li style="margin-bottom: 8px;">What raised it?</li>
          <li>What would lower it by one degree?</li>
        </ol>
        
        <p style="font-size: 14px; margin: 0; color: #5C5C5C; font-style: italic;">
          If you reply with just the temperature, that's enough.<br/>
          (It helps us shape the beta.)
        </p>
      </div>

      <!-- Social Links -->
      <p style="font-size: 16px; margin: 0 0 12px 0; color: #1a1a1a; font-weight: 600;">
        Follow along:
      </p>
      
      <div style="margin-bottom: 32px; font-size: 15px; line-height: 2;">
        <div><strong>Instagram:</strong> <a href="https://instagram.com/gettherma" style="color: #343818; text-decoration: none;">https://instagram.com/gettherma</a></div>
        <div><strong>X:</strong> <a href="https://x.com/gettherma" style="color: #343818; text-decoration: none;">https://x.com/gettherma</a></div>
        <div><strong>LinkedIn:</strong> <a href="https://linkedin.com/company/get-therma" style="color: #343818; text-decoration: none;">https://linkedin.com/company/get-therma</a></div>
      </div>

      <!-- Email Promise -->
      <p style="font-size: 15px; margin: 0 0 32px 0; color: #5C5C5C; line-height: 1.7;">
        We'll email you when it's worth your attention: beta access, meaningful updates, and tools like the prompt above.
      </p>

      <!-- Sign Off -->
      <p style="font-size: 16px; margin: 0; color: #1a1a1a;">
        — The Therma Team<br/>
        <a href="https://therma.one" style="color: #343818; text-decoration: none;">therma.one</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px 20px; margin-top: 16px;">
      <p style="font-size: 13px; color: #5C5C5C; margin: 0; line-height: 1.5;">
        You're receiving this because you signed up for the Therma waitlist.
      </p>
    </div>
  </div>
</body>
</html>
      `
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

testEmail().catch(console.error);
