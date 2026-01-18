const DEFAULT_SITE_URL = 'https://www.therma.one';

export function getSiteUrl(): string {
  const raw =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_SITE_URL;

  return raw.replace(/\/$/, '');
}
