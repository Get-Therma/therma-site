import { NextRequest, NextResponse } from 'next/server';
import { contentfulAPI } from '../../../lib/contentful';

export async function GET(req: NextRequest) {
  try {
    const status = await contentfulAPI.getLaunchStatus();
    
    if (status) {
      return NextResponse.json({
        status: status.status,
        dates: {
          announced: status.announcedDate,
          expected: status.expectedDate,
          live: status.liveDate,
        },
        notes: status.notes || 'Launch information is not currently available.',
        lastUpdated: status.lastUpdated,
      });
    }

    // Fallback response
    return NextResponse.json({
      status: 'planned',
      dates: { announced: null, expected: null, live: null },
      notes: 'Launch information is not currently available.',
    });
  } catch (error) {
    console.error('Launch status API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch launch status' },
      { status: 500 }
    );
  }
}
