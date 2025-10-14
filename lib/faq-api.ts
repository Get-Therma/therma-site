import { contentfulAPI, FAQItem, LaunchStatus } from './contentful';

// Re-export types for external use
export type { FAQItem, LaunchStatus };

// Fallback to Contentful, with mock data as backup
export async function faqSearch(query: string): Promise<{ results: FAQItem[] }> {
  try {
    // Try Contentful first
    const contentfulResults = await contentfulAPI.searchFAQItems(query);
    if (contentfulResults.length > 0) {
      return { results: contentfulResults };
    }

    // Fallback to local search if Contentful is empty
    const allFAQ = await contentfulAPI.getFAQItems();
    const localResults = allFAQ.filter(item => 
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    return { results: localResults };
  } catch (error) {
    console.error('FAQ search error:', error);
    // Return empty results on error
    return { results: [] };
  }
}

export async function faqList(category?: string) {
  try {
    const items = await contentfulAPI.getFAQItems(category);
    return { items };
  } catch (error) {
    console.error('FAQ list error:', error);
    return { items: [] };
  }
}

export async function getLaunchStatus() {
  try {
    const status = await contentfulAPI.getLaunchStatus();
    if (status) {
      return {
        status: status.status,
        dates: {
          announced: status.announcedDate,
          expected: status.expectedDate,
          live: status.liveDate,
        },
        notes: status.notes || 'Launch information is not currently available.',
        lastUpdated: status.lastUpdated,
      };
    }

    // Fallback response
    return {
      status: 'planned',
      dates: { announced: null, expected: null, live: null },
      notes: 'Launch information is not currently available.',
    };
  } catch (error) {
    console.error('Launch status error:', error);
    return {
      status: 'unknown',
      dates: { announced: null, expected: null, live: null },
      notes: 'Unable to fetch launch status',
    };
  }
}

export async function joinWaitlist(name?: string, email?: string) {
  try {
    // This would typically integrate with your actual waitlist system
    // For now, we'll just log it
    console.log('Waitlist join request:', { name, email, timestamp: new Date().toISOString() });
    
    return { 
      status: 'ok', 
      waitlistId: `w_${Date.now()}`,
      message: 'Thank you for joining our waitlist!'
    };
  } catch (error) {
    console.error('Waitlist join error:', error);
    return { status: 'error', message: 'Failed to join waitlist' };
  }
}
