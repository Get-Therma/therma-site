/**
 * Welcome Email Customization Examples
 * 
 * This file shows how to customize the welcome email template
 * with different configurations and personalization options.
 */

import { ThankYouEmailTemplate, EmailConfig } from './email-templates';

// Example 1: Basic usage (default configuration)
export const basicExample = ThankYouEmailTemplate({
  email: 'user@example.com'
});

// Example 2: Personalized with first name
export const personalizedExample = ThankYouEmailTemplate({
  email: 'user@example.com',
  personalization: {
    firstName: 'Sarah',
    customMessage: "We're thrilled to have you join us, Sarah! Your journey to steadier days starts now."
  }
});

// Example 3: Custom branding and colors
export const customBrandingExample = ThankYouEmailTemplate({
  email: 'user@example.com',
  config: {
    brandName: 'Therma',
    tagline: 'Your personal pattern recognition companion',
    primaryColor: '#6B8E23', // Olive green
    logoUrl: 'https://therma.one/therma-logo.svg',
    benefits: [
      'Priority access to beta features',
      'Weekly insights on mindfulness and patterns',
      'Early bird pricing when we launch',
      'Direct line to our product team'
    ],
    quote: {
      text: "Awareness is the greatest agent for change.",
      author: "Eckhart Tolle"
    }
  }
});

// Example 4: Minimal design
export const minimalExample = ThankYouEmailTemplate({
  email: 'user@example.com',
  config: {
    quote: undefined, // Remove quote section
    productDescription: undefined, // Remove product description
    teamMessage: undefined, // Remove team message
    socialLinks: {
      website: 'https://therma.one'
    }
  }
});

// Example 5: Full customization
export const fullCustomExample = ThankYouEmailTemplate({
  email: 'user@example.com',
  personalization: {
    firstName: 'Alex',
    customMessage: 'Welcome aboard! We\'ve been waiting for someone like you.'
  },
  config: {
    brandName: 'Therma',
    tagline: 'Patterns. Progress. Peace.',
    primaryColor: '#8fbc8f',
    logoUrl: 'https://therma.one/therma-logo.svg',
    greeting: 'Hello',
    welcomeMessage: 'Thank you for joining our community of mindful individuals.',
    quote: {
      text: 'The journey of a thousand miles begins with a single step.',
      author: 'Lao Tzu'
    },
    benefits: [
      'Exclusive beta access',
      'Monthly feature updates',
      'Community forum access',
      '1-on-1 onboarding session'
    ],
    productDescription: 'Therma helps you discover patterns in your daily life through AI-powered journaling and reflection.',
    teamMessage: 'We\'re a small team passionate about helping people live more intentionally.',
    socialLinks: {
      twitter: 'https://twitter.com/gettherma',
      linkedin: 'https://linkedin.com/company/gettherma',
      website: 'https://therma.one'
    },
    avatarUrl: 'https://therma.one/bot-avatar@1x.png',
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
 *     benefits: customBenefits,
 *   }
 * });
 */

