import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, message, type } = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Name, email, and message are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Create email content
    const subject = type === 'collaboration' 
      ? `New Collaboration Inquiry from ${name}`
      : `New Contact Form Submission from ${name}`;
    
    const emailBody = `
New ${type === 'collaboration' ? 'Collaboration' : 'Contact'} Form Submission

Name: ${name}
Email: ${email}
Type: ${type === 'collaboration' ? 'Collaborations & Business' : 'General Contact'}

Message:
${message}

---
Submitted from Therma website contact form
`;

    // For now, we'll just log the email (in production, you'd send via email service)
    console.log('Contact form submission:', {
      subject,
      to: 'support@gettherma.ai',
      body: emailBody,
      from: email
    });

    // In a real implementation, you would:
    // 1. Send email via Resend, SendGrid, or similar service
    // 2. Store in database if needed
    // 3. Send confirmation email to user

    return NextResponse.json({ 
      message: 'Contact form submitted successfully',
      subject,
      to: 'support@gettherma.ai'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ message: 'Failed to submit contact form' }, { status: 500 });
  }
}
