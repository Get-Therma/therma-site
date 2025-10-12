import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, source, utm_source, utm_medium, utm_campaign } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const res = await fetch('https://api.beehiiv.com/v2/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ApiKey': process.env.BEEHIIV_API_KEY ?? ''
      },
      body: JSON.stringify({
        email,
        publication_id: process.env.BEEHIIV_PUBLICATION_ID,
        reactivate_existing: true,
        double_opt_in: true,
        source: source ?? 'Website',
        utm_source,
        utm_medium,
        utm_campaign
      }),
      cache: 'no-store'
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || 'Subscription failed' }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
