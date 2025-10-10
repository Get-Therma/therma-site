import type { NextApiRequest, NextApiResponse } from 'next';
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
