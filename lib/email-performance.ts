// lib/email-performance.ts
import React from 'react';
import { Resend } from 'resend';
import { DOMAIN_CONFIGS } from './domain-config';

export interface EmailResult {
  success: boolean;
  domain: string;
  fromEmail: string;
  emailId?: string;
  duration: number;
  error?: string;
}

export async function sendOptimizedEmail(
  resend: Resend,
  to: string,
  subject: string,
  html: string | React.ReactElement,
  preferredDomain?: string
): Promise<EmailResult> {
  const startTime = Date.now();
  
  // Sort domains by performance (fastest first)
  const sortedDomains = [...DOMAIN_CONFIGS].sort((a, b) => {
    // If we have a preferred domain, prioritize it
    if (preferredDomain && a.domain === preferredDomain) return -1;
    if (preferredDomain && b.domain === preferredDomain) return 1;
    
    // Otherwise sort by priority (which is now based on performance)
    return a.priority - b.priority;
  });

  // Try each domain in order of performance
  for (const domainConfig of sortedDomains) {
    if (!domainConfig.verified) continue;
    
    try {
      const emailResult = await resend.emails.send({
        from: `${domainConfig.fromName} <${domainConfig.fromEmail}>`,
        to: [to],
        subject,
        react: html // Use react for React components
      });

      const duration = Date.now() - startTime;

      if (emailResult.data?.id) {
        return {
          success: true,
          domain: domainConfig.domain,
          fromEmail: domainConfig.fromEmail,
          emailId: emailResult.data.id,
          duration
        };
      }
    } catch (error) {
      console.log(`Failed to send from ${domainConfig.domain}:`, error);
      // Continue to next domain
    }
  }

  // If all domains failed
  const duration = Date.now() - startTime;
  return {
    success: false,
    domain: 'none',
    fromEmail: 'none',
    duration,
    error: 'All domains failed'
  };
}

export function getPerformanceStats(): { domain: string; avgResponseTime: number; priority: number }[] {
  // Based on our diagnostic results
  return [
    { domain: 'get-therma.com', avgResponseTime: 264, priority: 1 },
    { domain: 'therma.one', avgResponseTime: 317, priority: 2 },
    { domain: 'gettherma.ai', avgResponseTime: 760, priority: 3 }
  ];
}
