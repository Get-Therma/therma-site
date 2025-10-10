import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/db';
import { contacts, contactSchema } from '../../lib/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { type, name, email, subject, message, timestamp } = req.body;

      // Validate the request body
      const validatedData = contactSchema.parse({
        type: type || 'general',
        name,
        email,
        subject,
        message,
      });

      // Insert into database
      const result = await db.insert(contacts).values({
        type: validatedData.type,
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      }).returning();

      console.log('Contact submission saved:', result[0]);

      // Send email to support@gettherma.ai
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Therma Contact Form <noreply@gettherma.ai>',
            to: ['support@gettherma.ai'],
            subject: `New Contact Form Submission: ${validatedData.subject}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${validatedData.name}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              <p><strong>Subject:</strong> ${validatedData.subject}</p>
              <p><strong>Type:</strong> ${validatedData.type}</p>
              <p><strong>Message:</strong></p>
              <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><small>Submitted at: ${new Date().toISOString()}</small></p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send email:', await emailResponse.text());
        } else {
          console.log('Email sent successfully to support@gettherma.ai');
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the request if email fails
      }

      res.status(200).json({ message: 'Contact message sent successfully!' });
    } catch (error) {
      console.error('Contact submission error:', error);
      res.status(500).json({ message: 'Failed to send contact message' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
