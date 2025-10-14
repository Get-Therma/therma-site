import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { sql } from 'drizzle-orm';

// Consent table schema (you'll need to add this to your schema.ts)
interface ConsentRecord {
  id: string;
  sessionId: string;
  userId?: string;
  consentType: 'session' | 'anonymous' | 'account';
  acceptedAt: string;
  dataRetentionDays: number;
  revokedAt?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, consentType, dataRetentionDays } = body;

    if (!sessionId || !consentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate consent ID
    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // For now, we'll store in a simple way. In production, you'd want a proper database table
    const consentData: ConsentRecord = {
      id: consentId,
      sessionId,
      consentType,
      acceptedAt: new Date().toISOString(),
      dataRetentionDays: dataRetentionDays || getDefaultRetentionDays(consentType)
    };

    // Log consent creation for audit
    console.log('Consent created:', {
      consentId,
      sessionId,
      consentType,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      userAgent: req.headers.get('user-agent')
    });

    // In production, you would:
    // 1. Store in database with proper encryption
    // 2. Set secure HTTP-only cookies
    // 3. Log to audit system
    // 4. Send to compliance monitoring system

    return NextResponse.json(consentData);

  } catch (error) {
    console.error('Consent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create consent' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { consentId } = body;

    if (!consentId) {
      return NextResponse.json(
        { error: 'Missing consent ID' },
        { status: 400 }
      );
    }

    // Log consent revocation for audit
    console.log('Consent revoked:', {
      consentId,
      timestamp: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      userAgent: req.headers.get('user-agent')
    });

    // In production, you would:
    // 1. Mark consent as revoked in database
    // 2. Trigger data deletion process
    // 3. Log to audit system
    // 4. Notify compliance team

    return NextResponse.json({ status: 'revoked' });

  } catch (error) {
    console.error('Consent revocation error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke consent' },
      { status: 500 }
    );
  }
}

function getDefaultRetentionDays(consentType: string): number {
  switch (consentType) {
    case 'session': return 0;
    case 'anonymous': return 90;
    case 'account': return 365;
    default: return 0;
  }
}
