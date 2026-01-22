// app/api/email-webhook/route.ts
// Webhook endpoint to receive email events from Resend
// Set up at: https://resend.com/webhooks

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { emailEvents } from '../../../lib/schema';

// Resend webhook event types
type ResendEventType = 
  | 'email.sent'
  | 'email.delivered'
  | 'email.delivery_delayed'
  | 'email.opened'
  | 'email.clicked'
  | 'email.bounced'
  | 'email.complained';

interface ResendWebhookPayload {
  type: ResendEventType;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
    // For click events
    click?: {
      link: string;
      timestamp: string;
      user_agent?: string;
      ip_address?: string;
    };
    // For open events
    open?: {
      timestamp: string;
      user_agent?: string;
      ip_address?: string;
    };
    // For bounce events
    bounce?: {
      type: string;
      message: string;
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature (optional but recommended)
    // const svixId = req.headers.get('svix-id');
    // const svixTimestamp = req.headers.get('svix-timestamp');
    // const svixSignature = req.headers.get('svix-signature');
    
    const payload: ResendWebhookPayload = await req.json();
    
    console.log('📧 Email webhook received:', payload.type);
    console.log('📧 Email ID:', payload.data.email_id);
    
    // Extract event type (remove 'email.' prefix)
    const eventType = payload.type.replace('email.', '');
    
    // Extract recipient email (first in the array)
    const recipientEmail = payload.data.to?.[0] || null;
    
    // Extract event-specific data
    let linkUrl: string | null = null;
    let userAgent: string | null = null;
    let ipAddress: string | null = null;
    
    if (payload.data.click) {
      linkUrl = payload.data.click.link;
      userAgent = payload.data.click.user_agent ?? null;
      ipAddress = payload.data.click.ip_address ?? null;
    }
    
    if (payload.data.open) {
      userAgent = payload.data.open.user_agent || null;
      ipAddress = payload.data.open.ip_address || null;
    }
    
    // Store event in database
    try {
      const db = await getDb();
      
      await db.insert(emailEvents).values({
        emailId: payload.data.email_id,
        recipientEmail,
        eventType,
        linkUrl,
        userAgent,
        ipAddress,
        metadata: payload as unknown as Record<string, unknown>,
      });
      
      console.log('✅ Email event stored:', eventType, 'for', recipientEmail);
    } catch (dbError) {
      console.error('❌ Failed to store email event:', dbError);
      // Still return 200 to acknowledge receipt
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    // Return 200 to prevent Resend from retrying
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

// Health check for webhook endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    endpoint: 'email-webhook',
    description: 'Resend webhook receiver for email events'
  });
}
