#!/usr/bin/env node

/**
 * Test Welcome Email - Clean with Borders
 */

require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');

async function testWelcomeEmail() {
  console.log('📧 Testing Welcome Email with Borders...\n');

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ Missing RESEND_API_KEY environment variable');
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
    <div style="display: none; max-height: 0; overflow: hidden;">You're in! Here's what to expect from Therma...</div>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F5F5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F5;">
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border: 1px solid #E0E0E0; border-radius: 8px;">
            
            <!-- Header with logo -->
            <tr>
              <td align="center" style="padding: 32px 40px; border-bottom: 1px solid #E0E0E0;">
                <img 
                  src="https://www.therma.one/therma-logo-80x80.png" 
                  alt="Therma" 
                  width="56" 
                  height="56"
                  style="display: block; border-radius: 12px; margin-bottom: 16px;"
                />
                <span style="font-size: 24px; font-weight: 500; color: #1A1A1A; letter-spacing: 0.5px;">Therma</span>
              </td>
            </tr>
            
            <!-- Main content -->
            <tr>
              <td style="padding: 32px 40px;">
                <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #333333;">
                  ${greeting}
                </p>
                
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;">
                  You're on the Therma waitlist. We're building a mindful journaling app that helps you see patterns and steady your days.
                </p>
                
                <!-- Benefits box -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px; border: 1px solid #E0E0E0; border-radius: 6px;">
                  <tr>
                    <td style="padding: 20px 24px;">
                      <p style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #1A1A1A; text-transform: uppercase; letter-spacing: 0.5px;">
                        What you'll get
                      </p>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 6px 0; font-size: 15px; color: #555555;">• Early access when we launch</td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0; font-size: 15px; color: #555555;">• Exclusive updates & sneak peeks</td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0; font-size: 15px; color: #555555;">• Special perks for early supporters</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #333333;">
                  Questions? Just reply to this email—we read every message.
                </p>
                
                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                  With warmth,<br/>
                  <strong>The Therma Team</strong>
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 24px 40px; border-top: 1px solid #E0E0E0; background-color: #FAFAFA; border-radius: 0 0 8px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="text-align: center;">
                      <a href="https://therma.one" style="color: #666666; text-decoration: none; font-size: 14px; font-weight: 500;">therma.one</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: center; padding-top: 12px;">
                      <span style="font-size: 12px; color: #999999;">
                        You're receiving this because you signed up for the Therma waitlist.
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM || 'Therma <support@gettherma.ai>',
      to: [testEmail],
      subject: "You're on the Therma waitlist",
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
