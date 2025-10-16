// lib/domain-config.ts
export interface DomainConfig {
  domain: string;
  fromEmail: string;
  fromName: string;
  verified: boolean;
  priority: number;
}

export const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    domain: 'gettherma.ai',
    fromEmail: 'hello@gettherma.ai',
    fromName: 'Therma',
    verified: false, // Will be updated based on Resend verification
    priority: 1
  },
  {
    domain: 'therma.one',
    fromEmail: 'hello@therma.one',
    fromName: 'Therma',
    verified: false,
    priority: 2
  },
  {
    domain: 'get-therma.com',
    fromEmail: 'hello@get-therma.com',
    fromName: 'Therma',
    verified: false,
    priority: 3
  }
];

export function getBestDomainConfig(): DomainConfig {
  // Return the highest priority verified domain, or fallback to first
  const verified = DOMAIN_CONFIGS.filter(config => config.verified);
  if (verified.length > 0) {
    return verified.sort((a, b) => a.priority - b.priority)[0];
  }
  return DOMAIN_CONFIGS[0]; // Fallback to gettherma.ai
}

export function getDomainFromReferrer(referrer?: string): DomainConfig {
  if (!referrer) return getBestDomainConfig();
  
  try {
    const url = new URL(referrer);
    const domain = url.hostname.replace('www.', '');
    
    const config = DOMAIN_CONFIGS.find(c => c.domain === domain);
    return config || getBestDomainConfig();
  } catch {
    return getBestDomainConfig();
  }
}

export function getDomainFromRequest(req: Request): DomainConfig {
  try {
    const url = new URL(req.url);
    const hostname = req.headers.get('host') || url.hostname;
    const domain = hostname.replace('www.', '');
    
    const config = DOMAIN_CONFIGS.find(c => c.domain === domain);
    return config || getBestDomainConfig();
  } catch {
    return getBestDomainConfig();
  }
}
