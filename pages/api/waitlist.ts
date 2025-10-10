import type { NextApiRequest, NextApiResponse } from 'next'

type WaitlistData = {
  email: string
  attribution: Record<string, string>
  referer: string | null
  ts: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, attribution, referer, ts }: WaitlistData = req.body

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' })
    }

    // Here you would typically:
    // 1. Save to your database
    // 2. Send to email service (Mailchimp, ConvertKit, etc.)
    // 3. Send confirmation email
    
    console.log('Waitlist signup:', {
      email,
      attribution,
      referer,
      timestamp: new Date(ts).toISOString()
    })

    // For now, just return success
    // TODO: Replace with actual database/email service integration
    res.status(200).json({ 
      success: true, 
      message: 'Successfully added to waitlist' 
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
