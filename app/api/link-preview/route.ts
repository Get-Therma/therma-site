import { NextRequest, NextResponse } from 'next/server';

// Mark route as dynamic since it uses request.url
export const dynamic = 'force-dynamic';

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Validate URL
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const metadata = await fetchLinkMetadata(url);
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching link metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}

async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  try {
    // Fetch the HTML content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ThermaBot/1.0; +https://therma.one)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      // Set a timeout
      signal: AbortSignal.timeout(10000), // 10 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Parse HTML to extract metadata
    const metadata: LinkMetadata = {};
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract Open Graph tags
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (ogTitleMatch) {
      metadata.title = ogTitleMatch[1].trim();
    }

    const ogDescriptionMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (ogDescriptionMatch) {
      metadata.description = ogDescriptionMatch[1].trim();
    }

    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (ogImageMatch) {
      metadata.image = ogImageMatch[1].trim();
    }

    const ogSiteNameMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (ogSiteNameMatch) {
      metadata.siteName = ogSiteNameMatch[1].trim();
    }

    // Extract Twitter Card tags as fallback
    if (!metadata.title) {
      const twitterTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      if (twitterTitleMatch) {
        metadata.title = twitterTitleMatch[1].trim();
      }
    }

    if (!metadata.description) {
      const twitterDescriptionMatch = html.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      if (twitterDescriptionMatch) {
        metadata.description = twitterDescriptionMatch[1].trim();
      }
    }

    if (!metadata.image) {
      const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      if (twitterImageMatch) {
        metadata.image = twitterImageMatch[1].trim();
      }
    }

    // Extract favicon
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    if (faviconMatch) {
      metadata.favicon = faviconMatch[1].trim();
    }

    // Extract meta description as fallback
    if (!metadata.description) {
      const metaDescriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      if (metaDescriptionMatch) {
        metadata.description = metaDescriptionMatch[1].trim();
      }
    }

    // Clean up URLs (make them absolute)
    if (metadata.image && !metadata.image.startsWith('http')) {
      const baseUrl = new URL(url);
      metadata.image = new URL(metadata.image, baseUrl.origin).href;
    }

    if (metadata.favicon && !metadata.favicon.startsWith('http')) {
      const baseUrl = new URL(url);
      metadata.favicon = new URL(metadata.favicon, baseUrl.origin).href;
    }

    // Truncate long descriptions
    if (metadata.description && metadata.description.length > 200) {
      metadata.description = metadata.description.substring(0, 200) + '...';
    }

    return metadata;
  } catch (error) {
    console.error('Error fetching link metadata:', error);
    throw error;
  }
}
