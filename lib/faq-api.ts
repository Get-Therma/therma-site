export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
  isVerified: boolean;
  verifiedAt?: string | null;
  sourceUrl?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_FAQ_API_BASE || 'http://localhost:4000';

export async function faqSearch(query: string): Promise<{ results: FAQItem[] }> {
  try {
    const res = await fetch(`${API_BASE}/api/faq/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('FAQ search failed');
    return res.json();
  } catch (error) {
    console.error('FAQ search error:', error);
    return { results: [] };
  }
}

export async function faqList(tag?: string) {
  try {
    const res = await fetch(`${API_BASE}/api/faq/list${tag ? `?tag=${encodeURIComponent(tag)}` : ''}`);
    if (!res.ok) throw new Error('FAQ list failed');
    return res.json();
  } catch (error) {
    console.error('FAQ list error:', error);
    return { items: [] };
  }
}

export async function getLaunchStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/launch/status`);
    if (!res.ok) throw new Error('Launch status failed');
    return res.json();
  } catch (error) {
    console.error('Launch status error:', error);
    return { 
      status: 'unknown', 
      dates: { announced: null, expected: null, live: null }, 
      notes: 'Unable to fetch launch status' 
    };
  }
}

export async function joinWaitlist(name?: string, email?: string) {
  try {
    const res = await fetch(`${API_BASE}/api/waitlist/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    if (!res.ok) throw new Error('Waitlist join failed');
    return res.json();
  } catch (error) {
    console.error('Waitlist join error:', error);
    return { status: 'error', message: 'Failed to join waitlist' };
  }
}
