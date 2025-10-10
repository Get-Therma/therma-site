import type { NextApiRequest, NextApiResponse } from 'next'

type ContactData = {
  type: 'general' | 'collaboration'
  name: string
  email: string
  subject: string
  message: string
  timestamp: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type, name, email, subject, message, timestamp }: ContactData = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Validate email
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' })
    }

    // Here you would typically:
    // 1. Save to your database
    // 2. Send email notification to your team
    // 3. Send auto-reply to the user
    
    console.log('Contact form submission:', {
      type,
      name,
      email,
      subject,
      message: message.substring(0, 100) + '...', // Log first 100 chars
      timestamp
    })

    // For now, just return success
    // TODO: Replace with actual email service integration
    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
