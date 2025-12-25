import { NextRequest, NextResponse } from 'next/server';

// Mark route as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

interface EscalationRequest {
  sessionId: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  userMessage: string;
  userId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: EscalationRequest = await req.json();
    const { sessionId, reason, urgency, userMessage, userId } = body;

    if (!sessionId || !reason || !urgency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate ticket ID
    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log escalation for audit (this is critical for compliance)
    const escalationLog = {
      ticketId,
      sessionId,
      userId,
      reason,
      urgency,
      userMessage,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      userAgent: req.headers.get('user-agent'),
      status: 'created'
    };

    console.log('SAFETY ESCALATION:', escalationLog);

    // In production, you would:
    // 1. Store in secure audit database
    // 2. Send immediate alert to on-call staff
    // 3. Create support ticket in your system
    // 4. Log to compliance monitoring system
    // 5. Send notification to clinical team if high urgency

    // For high urgency escalations, trigger immediate alerts
    if (urgency === 'high') {
      await triggerHighUrgencyAlert(escalationLog);
    }

    // Estimate response time based on urgency
    const estimatedResponseTime = getEstimatedResponseTime(urgency);

    return NextResponse.json({
      ticketId,
      estimatedResponseTime,
      status: 'escalated',
      message: urgency === 'high' 
        ? 'Your concern has been escalated to our support team. They will respond within 15 minutes during business hours.'
        : 'Your request has been logged. Our support team will respond within 2 hours during business hours.'
    });

  } catch (error) {
    console.error('Escalation error:', error);
    return NextResponse.json(
      { error: 'Failed to create escalation' },
      { status: 500 }
    );
  }
}

async function triggerHighUrgencyAlert(escalationLog: any) {
  // In production, this would:
  // 1. Send SMS to on-call staff
  // 2. Create Slack/Teams alert
  // 3. Send email to clinical team
  // 4. Log to incident management system
  
  console.log('HIGH URGENCY ALERT TRIGGERED:', escalationLog);
  
  // Example: Send to monitoring system
  try {
    // await fetch('https://your-monitoring-system.com/alerts', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     type: 'safety_escalation',
    //     priority: 'critical',
    //     data: escalationLog
    //   })
    // });
  } catch (error) {
    console.error('Failed to send high urgency alert:', error);
  }
}

function getEstimatedResponseTime(urgency: string): string {
  switch (urgency) {
    case 'high':
      return '15 minutes';
    case 'medium':
      return '2 hours';
    case 'low':
      return '24 hours';
    default:
      return '2 hours';
  }
}

// GET endpoint to check escalation status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Missing ticket ID' },
        { status: 400 }
      );
    }

    // In production, you would check the actual ticket status
    // For now, return a mock response
    return NextResponse.json({
      ticketId,
      status: 'in_progress',
      assignedTo: 'Support Team',
      lastUpdate: new Date().toISOString(),
      estimatedResolution: '2 hours'
    });

  } catch (error) {
    console.error('Escalation status error:', error);
    return NextResponse.json(
      { error: 'Failed to get escalation status' },
      { status: 500 }
    );
  }
}
