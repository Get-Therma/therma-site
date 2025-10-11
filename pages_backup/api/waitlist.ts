import type { NextApiRequest, NextApiResponse } from 'next';
import { captureException } from '@sentry/nextjs';
import { db } from '../../lib/db';
import { waitlist, waitlistSchema } from '../../lib/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, utm_campaign, utm_medium, utm_source, referrer, hp } = req.body;

      // Honeypot check
      if (hp) {
        return res.status(400).json({ message: 'Bot detected' });
      }

      // Validate email
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Create attribution object
      const attribution = {
        utm_campaign: utm_campaign || null,
        utm_medium: utm_medium || null,
        utm_source: utm_source || null,
        referrer: referrer || null,
      };

      // Insert into database
      const result = await db.insert(waitlist).values({
        email: email.toLowerCase().trim(),
        attribution: JSON.stringify(attribution),
        referer: referrer || null,
      }).returning();

      console.log('Waitlist submission saved:', result[0]);

      // Send email notification
      if (process.env.RESEND_API_KEY && process.env.WAITLIST_FROM && process.env.CONTACT_TO) {
        try {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: process.env.WAITLIST_FROM,
              to: [process.env.CONTACT_TO],
              subject: `New Waitlist Signup: ${email}`,
              html: `
                <h2>New Waitlist Signup</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>UTM Campaign:</strong> ${utm_campaign || 'None'}</p>
                <p><strong>UTM Medium:</strong> ${utm_medium || 'None'}</p>
                <p><strong>UTM Source:</strong> ${utm_source || 'None'}</p>
                <p><strong>Referrer:</strong> ${referrer || 'None'}</p>
                <hr>
                <p><small>Signed up at: ${new Date().toISOString()}</small></p>
                <p><small>Waitlist ID: ${result[0].id}</small></p>
              `,
            }),
          });

          if (!emailResponse.ok) {
            console.error('Failed to send waitlist email:', await emailResponse.text());
          } else {
            console.log('Waitlist email sent successfully');
          }
        } catch (emailError) {
          console.error('Waitlist email sending error:', emailError);
        }
      }

      // Send Slack notification
      if (process.env.SLACK_WEBHOOK_URL) {
        try {
          const slackMessage = {
            text: `🎉 New Waitlist Signup!\n📧 Email: ${email}\n📊 Campaign: ${utm_campaign || 'None'}\n🔗 Source: ${utm_source || 'None'}\n⏰ Time: ${new Date().toLocaleString()}\n🆔 ID: ${result[0].id}`
          };

          const slackResponse = await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(slackMessage),
          });

          if (!slackResponse.ok) {
            console.error('Failed to send Slack notification:', await slackResponse.text());
          } else {
            console.log('Slack notification sent successfully');
          }
        } catch (slackError) {
          console.error('Slack notification error:', slackError);
        }
      }

      res.status(200).json({ message: 'Successfully joined waitlist!' });
    } catch (error) {
      console.error('Waitlist submission error:', error);
      
      if (error instanceof Error && error.message.includes('duplicate key')) {
        return res.status(409).json({ message: 'Email already exists in waitlist' });
      }
      
      res.status(500).json({ message: 'Failed to join waitlist' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
