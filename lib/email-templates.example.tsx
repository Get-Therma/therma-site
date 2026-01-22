/**
 * Welcome Email Customization Examples
 * 
 * This file shows how to customize the welcome email template
 * with different configurations and personalization options.
 */

import { ThankYouEmailTemplate } from './email-templates';

// Example 1: Basic usage (default configuration)
export const basicExample = ThankYouEmailTemplate({
  email: 'user@example.com'
});

// Example 2: Personalized with first name
export const personalizedExample = ThankYouEmailTemplate({
  email: 'user@example.com',
  personalization: {
    firstName: 'Sarah'
  }
});

// Example 3: Custom branding and colors
export const customBrandingExample = ThankYouEmailTemplate({
  email: 'user@example.com',
  config: {
    brandName: 'Therma',
    primaryColor: '#6B8E23', // Olive green
    backgroundColor: '#F8F4ED',
    textColor: '#1a1a1a',
    secondaryTextColor: '#5C5C5C'
  }
});

// Example 4: With social links
export const socialLinksExample = ThankYouEmailTemplate({
  email: 'user@example.com',
  config: {
    socialLinks: {
      instagram: 'https://instagram.com/gettherma',
      x: 'https://x.com/gettherma',
      linkedin: 'https://linkedin.com/company/get-therma'
    }
  }
});

// Example 5: Full customization
export const fullCustomExample = ThankYouEmailTemplate({
  email: 'user@example.com',
  personalization: {
    firstName: 'Alex',
    customMessage: "Welcome aboard! We've been waiting for someone like you."
  },
  config: {
    brandName: 'Therma',
    primaryColor: '#8fbc8f',
    backgroundColor: '#F8F4ED',
    textColor: '#1a1a1a',
    secondaryTextColor: '#5C5C5C',
    socialLinks: {
      instagram: 'https://instagram.com/gettherma',
      x: 'https://x.com/gettherma',
      linkedin: 'https://linkedin.com/company/get-therma'
    },
    unsubscribeText: 'You signed up for the Therma waitlist. Not interested? No worries, just ignore this email.'
  }
});

/**
 * Usage in API route:
 * 
 * import { ThankYouEmailTemplate } from '@/lib/email-templates';
 * 
 * // In your subscribe route:
 * const emailTemplate = ThankYouEmailTemplate({
 *   email: userEmail,
 *   personalization: {
 *     firstName: extractFirstName(userEmail), // Optional
 *   },
 *   config: {
 *     // Override any defaults here
 *     primaryColor: '#8fbc8f',
 *   }
 * });
 */
