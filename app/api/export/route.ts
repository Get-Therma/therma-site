import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { waitlist } from '../../../lib/schema';

export async function GET(request: NextRequest) {
  try {
    // Get all waitlist entries
    const entries = await db.select().from(waitlist);
    
    // Convert to CSV format
    const csvHeaders = ['ID', 'Email', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Referrer', 'Created At'];
    const csvRows = entries.map(entry => {
      const attribution = entry.attribution ? JSON.parse(entry.attribution) : {};
      return [
        entry.id,
        entry.email,
        attribution.utm_source || '',
        attribution.utm_medium || '',
        attribution.utm_campaign || '',
        entry.referer || '',
        entry.createdAt?.toISOString() || ''
      ];
    });
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="therma-waitlist.csv"'
      }
    });
    
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ message: 'Failed to export data' }, { status: 500 });
  }
}
