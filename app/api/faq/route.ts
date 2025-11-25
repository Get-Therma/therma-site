import { NextRequest, NextResponse } from 'next/server';
import { contentfulAPI } from '../../../lib/contentful';

// Mark route as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    if (query) {
      // Search FAQ items
      const results = await contentfulAPI.searchFAQItems(query);
      return NextResponse.json({ results });
    } else if (category) {
      // Get FAQ items by category
      const items = await contentfulAPI.getFAQItems(category);
      return NextResponse.json({ items });
    } else {
      // Get all FAQ items
      const items = await contentfulAPI.getFAQItems();
      return NextResponse.json({ items });
    }
  } catch (error) {
    console.error('FAQ API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ data' },
      { status: 500 }
    );
  }
}
