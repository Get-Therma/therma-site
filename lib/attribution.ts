export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_path?: string;
  ts?: number; // epoch ms
};

const STORAGE_KEY = 'therma_attribution_v1';

export function readAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
}

export function writeAttribution(next: Attribution): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

export function captureAttributionFromLocation(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const existing = readAttribution() || {};

  const fromUrl: Attribution = {
    utm_source: url.searchParams.get('utm_source') || undefined,
    utm_medium: url.searchParams.get('utm_medium') || undefined,
    utm_campaign: url.searchParams.get('utm_campaign') || undefined,
    utm_term: url.searchParams.get('utm_term') || undefined,
    utm_content: url.searchParams.get('utm_content') || undefined,
  };

  const hasAnyUtm = Object.values(fromUrl).some(Boolean);

  // Only overwrite stored UTMs when a new tagged session arrives.
  const merged: Attribution = {
    ...existing,
    ...(hasAnyUtm ? fromUrl : {}),
    referrer: existing.referrer || document.referrer || undefined,
    landing_path: existing.landing_path || url.pathname || undefined,
    ts: existing.ts || Date.now(),
  };

  writeAttribution(merged);
}

