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
    domain: 'therma.one',
    fromEmail: 'welcome@gettherma.ai',
    fromName: 'Therma',
    verified: true, // Fastest domain - 268ms
    priority: 1
  },
  {
    domain: 'get-therma.com',
    fromEmail: 'welcome@gettherma.ai',
    fromName: 'Therma',
    verified: true, // Second fastest - 283ms
    priority: 2
  },
  {
    domain: 'gettherma.ai',
    fromEmail: 'welcome@gettherma.ai',
    fromName: 'Therma',
    verified: true, // Third fastest - 406ms
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
