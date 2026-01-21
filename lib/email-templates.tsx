import React from 'react';

/**
 * Welcome Email Template for Resend
 * 
 * A highly customizable, responsive welcome email template with:
 * - Dark theme with gradient backgrounds
 * - Mobile-responsive design
 * - Easy customization via config object
 * - Personalization support (first name, custom messages)
 * - Modular component structure
 * 
 * @example
 * // Basic usage
 * ThankYouEmailTemplate({ email: 'user@example.com' })
 * 
 * // With personalization
 * ThankYouEmailTemplate({ 
 *   email: 'user@example.com',
 *   personalization: { firstName: 'Sarah' }
 * })
 * 
 * // With custom config
 * ThankYouEmailTemplate({
 *   email: 'user@example.com',
 *   config: { primaryColor: '#6B8E23', brandName: 'Therma' }
 * })
 * 
 * See email-templates.example.tsx for more examples
 */

// Email design configuration - easily customizable
export interface EmailConfig {
  // Branding
  logoUrl?: string;
  logoWidth?: number;
  logoHeight?: number;
  brandName?: string;
  tagline?: string;
  
  // Colors
  primaryColor?: string; // Main brand color (e.g., #8fbc8f)
  backgroundColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
  
  // Content
  greeting?: string;
  welcomeMessage?: string;
  quote?: {
    text: string;
    author: string;
  };
  benefits?: string[];
  productDescription?: string;
  teamMessage?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  
  // Images
  avatarUrl?: string;
  
  // Footer
  unsubscribeText?: string;
}

// Default configuration
const defaultConfig: EmailConfig = {
  logoUrl: 'https://www.therma.one/therma-logo-80x80.png',
  logoWidth: 80,
  logoHeight: 80,
  brandName: 'Therma',
  tagline: 'See your patterns. Keep what works. Steady your days.',
  primaryColor: '#343818',
  backgroundColor: '#F8F4ED',
  textColor: '#050F1A',
  secondaryTextColor: '#5C5C5C',
  greeting: 'Hi there,',
  welcomeMessage: "Thank you for joining the Therma waitlist! We're genuinely excited to have you on this journey toward steadier, more mindful days.",
  quote: {
    text: "The mind is everything. What you think you become.",
    author: "Buddha, on the power of mindful awareness"
  },
  benefits: [
    'Early access to Therma when we launch',
    'Exclusive updates on our progress and new features',
    'Special perks for our first 1,000 mindful pioneers',
    'Science-backed insights delivered to your inbox'
  ],
  productDescription: "Therma is a private, AI-guided journaling app that turns your check-ins, habits, and notes into pattern maps—highlighting bright spots to keep and frictions to tweak—so small changes add up to steadier weeks.",
  teamMessage: "We're building something special together—a tool that honors your privacy while helping you discover the patterns that make your days more meaningful.",
  socialLinks: {
    twitter: 'https://twitter.com/gettherma',
    linkedin: 'https://linkedin.com/company/get-therma',
    website: 'https://therma.one'
  },
  avatarUrl: 'https://www.therma.one/bot-avatar@1x.png',
  unsubscribeText: "You're receiving this because you signed up for the Therma waitlist. If you didn't sign up, you can safely ignore this email."
};

/**
 * Converts any color format to rgba() with specified opacity
 * Handles hex (#8fbc8f), rgb(), rgba(), and hsl() formats
 */
function colorWithOpacity(color: string, opacity: number): string {
  // If already rgba/rgb format, try to extract and use it
  if (color.startsWith('rgba(')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
    }
  }
  
  if (color.startsWith('rgb(')) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
    }
  }
  
  // Handle hex colors (#8fbc8f, #8fbc8f33, #abc, #abc3)
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    
    // Remove any existing opacity hex digits (8 or 4 character hex)
    if (hex.length === 8 || hex.length === 4) {
      hex = hex.slice(0, hex.length === 8 ? 6 : 3);
    }
    
    // Handle 3-character hex (expand to 6)
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // Convert hex to RGB
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
  
  // Handle hsl() colors - convert to rgb first
  if (color.startsWith('hsl(')) {
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%/);
    if (match) {
      const h = parseInt(match[1]) / 360;
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;
      
      // Convert HSL to RGB
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h * 6) % 2 - 1));
      const m = l - c / 2;
      
      let r = 0, g = 0, b = 0;
      
      if (h < 1/6) { r = c; g = x; b = 0; }
      else if (h < 2/6) { r = x; g = c; b = 0; }
      else if (h < 3/6) { r = 0; g = c; b = x; }
      else if (h < 4/6) { r = 0; g = x; b = c; }
      else if (h < 5/6) { r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }
      
      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
      
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
  
  // Fallback: return the color as-is (might be a named color like 'red')
  // For opacity, we'll try to wrap it, but this is best-effort
  return color;
}

// Reusable style objects
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
    position: 'relative' as const,
    zIndex: 1
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '30px',
    border: '1px solid #E6E1D8',
    marginBottom: '30px'
  },
  headerCard: {
    textAlign: 'center' as const,
    marginBottom: '40px',
    padding: '30px 20px',
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E6E1D8'
  },
  quoteCard: {
    background: '#FEFBF3',
    padding: '25px',
    borderRadius: '12px',
    margin: '25px 0',
    borderLeft: '4px solid #343818',
    textAlign: 'center' as const
  },
  benefitsCard: {
    background: '#FFFFFF',
    padding: '25px',
    borderRadius: '12px',
    margin: '25px 0',
    border: '1px solid #E6E1D8'
  },
  teamCard: {
    textAlign: 'center' as const,
    margin: '30px 0',
    padding: '25px',
    background: '#FEFBF3',
    borderRadius: '12px',
    border: '1px solid rgba(52, 56, 24, 0.2)'
  }
};

export interface ThankYouEmailProps {
  email: string;
  config?: Partial<EmailConfig>;
  personalization?: {
    firstName?: string;
    customMessage?: string;
  };
}

export const ThankYouEmailTemplate = ({ 
  email, 
  config = {},
  personalization = {}
}: ThankYouEmailProps) => {
  // Merge user config with defaults
  const emailConfig: EmailConfig = { ...defaultConfig, ...config };
  // Ensure all colors are strings (never undefined) for TypeScript
  // Use non-null assertion since defaultConfig always has these values
  const primaryColor = (emailConfig.primaryColor ?? defaultConfig.primaryColor ?? '#8fbc8f') as string;
  const backgroundColor = (emailConfig.backgroundColor ?? defaultConfig.backgroundColor ?? '#000000') as string;
  const textColor = (emailConfig.textColor ?? defaultConfig.textColor ?? '#ffffff') as string;
  const secondaryTextColor = (emailConfig.secondaryTextColor ?? defaultConfig.secondaryTextColor ?? 'rgba(255, 255, 255, 0.9)') as string;
  
  // Personalize greeting if firstName is provided
  const greeting = personalization.firstName 
    ? `Hi ${personalization.firstName},` 
    : emailConfig.greeting || 'Hi there,';

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Welcome to {emailConfig.brandName}</title>
        <style>{`
          @media only screen and (max-width: 600px) {
            .email-container {
              padding: 20px 15px !important;
            }
            .email-card {
              padding: 20px !important;
            }
            .email-header {
              padding: 20px 15px !important;
            }
            .brand-logo {
              width: 60px !important;
              height: 60px !important;
            }
            .brand-name {
              font-size: 48px !important;
            }
            .tagline {
              font-size: 12px !important;
            }
            h1 {
              font-size: 24px !important;
            }
            h3 {
              font-size: 21px !important;
            }
          }
        `}</style>
      </head>
      <body style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.6', 
        color: textColor,
        backgroundColor: backgroundColor,
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}>
        {/* Background with animated gradients similar to website */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(120% 120% at 50% 50%, ${colorWithOpacity(primaryColor, 0.12)} 0%, ${colorWithOpacity(primaryColor, 0.05)} 35%, transparent 60%),
            linear-gradient(135deg, ${backgroundColor} 0%, ${colorWithOpacity(primaryColor, 0.08)} 40%, ${colorWithOpacity(primaryColor, 0.04)} 70%, ${backgroundColor} 100%)
          `,
          zIndex: -1
        }}></div>

        <div className="email-container" style={styles.container}>
          {/* Header with logo and branding */}
          <div className="email-header" style={styles.headerCard}>
            {emailConfig.logoUrl && (
              <img 
                src={emailConfig.logoUrl}
                alt={`${emailConfig.brandName} Logo`}
                width={emailConfig.logoWidth}
                height={emailConfig.logoHeight}
                className="brand-logo"
              style={{
                display: 'block',
                margin: '0 auto 20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            />
            )}
            <div className="brand-name" style={{
              fontSize: '64px',
              fontWeight: '400',
              color: primaryColor,
              marginBottom: '10px',
              fontFamily: 'PPPangaia, serif',
              letterSpacing: '2px'
            }}>
              {emailConfig.brandName}
            </div>
            {emailConfig.tagline && (
              <p className="tagline" style={{ 
              fontSize: '14px', 
              margin: '0',
              color: secondaryTextColor,
              fontStyle: 'italic'
            }}>
                {emailConfig.tagline}
            </p>
            )}
          </div>

          {/* Main content */}
          <div className="email-card" style={styles.card}>
            <h1 style={{ 
              color: primaryColor, 
              fontSize: '32px',
              margin: '0 0 20px 0',
              fontWeight: '400',
              textAlign: 'center' as const,
              fontFamily: 'PPPangaia, serif'
            }}>
              Welcome to the journey! 🎉
            </h1>
            
            <p style={{ fontSize: '14px', marginBottom: '20px', color: secondaryTextColor }}>
              {greeting}
            </p>
            
            <p style={{ fontSize: '14px', marginBottom: '25px', color: secondaryTextColor }}>
              {personalization.customMessage || emailConfig.welcomeMessage}
            </p>

            {/* Inspirational quote */}
            {emailConfig.quote && (
            <div style={{ 
                ...styles.quoteCard,
                background: colorWithOpacity(primaryColor, 0.1),
                borderLeft: `4px solid ${primaryColor}`
            }}>
              <p style={{ 
                fontSize: '18px',
                fontStyle: 'italic',
                  color: primaryColor,
                margin: '0 0 10px 0',
                lineHeight: '1.5'
              }}>
                  "{emailConfig.quote.text}"
              </p>
              <p style={{ 
                fontSize: '14px',
                color: colorWithOpacity(textColor, 0.6),
                margin: '0',
                fontStyle: 'normal'
              }}>
                  — {emailConfig.quote.author}
              </p>
            </div>
            )}

            {/* What's next section */}
            {emailConfig.benefits && emailConfig.benefits.length > 0 && (
              <div style={styles.benefitsCard}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                  color: primaryColor,
                fontSize: '24px',
                fontWeight: '400'
              }}>
                What's next on your journey?
              </h3>
              <ul style={{ 
                margin: '0', 
                paddingLeft: '20px',
                  color: secondaryTextColor
                }}>
                  {emailConfig.benefits.map((benefit, index) => (
                    <li key={index} style={{ marginBottom: '8px', fontSize: '14px' }}>
                      {benefit}
                    </li>
                  ))}
              </ul>
            </div>
            )}

            {/* Product explanation */}
            {emailConfig.productDescription && (
            <div style={{ margin: '25px 0' }}>
              <h3 style={{ 
                  color: primaryColor,
                fontSize: '24px',
                margin: '0 0 15px 0',
                fontWeight: '400'
              }}>
                  What is {emailConfig.brandName}?
              </h3>
              <p style={{ 
                fontSize: '14px',
                  color: secondaryTextColor,
                lineHeight: '1.6',
                margin: '0'
              }}>
                  {emailConfig.productDescription}
              </p>
            </div>
            )}

            {/* Warm invitation with profile picture */}
            {emailConfig.teamMessage && (
            <div style={{ 
                ...styles.teamCard,
                background: colorWithOpacity(primaryColor, 0.08),
                border: `1px solid ${colorWithOpacity(primaryColor, 0.2)}`
              }}>
                {emailConfig.avatarUrl && (
                  <img 
                    src={emailConfig.avatarUrl}
                    alt={`${emailConfig.brandName} Team`}
                width="60" 
                height="60"
                style={{
                  display: 'block',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                      border: `3px solid ${colorWithOpacity(primaryColor, 0.3)}`,
                      boxShadow: `0 4px 12px ${colorWithOpacity(primaryColor, 0.2)}`
                }}
              />
                )}
              <p style={{ 
                fontSize: '14px',
                  color: secondaryTextColor,
                margin: '0 0 15px 0',
                lineHeight: '1.5'
              }}>
                  {emailConfig.teamMessage}
              </p>
              <p style={{ 
                fontSize: '14px',
                  color: primaryColor,
                margin: '0',
                fontWeight: '400'
              }}>
                We can't wait to share this journey with you.
              </p>
            </div>
            )}

            {/* Social links */}
            {emailConfig.socialLinks && (emailConfig.socialLinks.twitter || emailConfig.socialLinks.linkedin || emailConfig.socialLinks.website) && (
            <div style={{ 
                textAlign: 'center' as const, 
              margin: '30px 0',
              padding: '20px',
              background: '#FFFFFF',
              borderRadius: '12px'
            }}>
              <p style={{ 
                margin: '0 0 15px 0', 
                fontSize: '14px', 
                color: secondaryTextColor 
              }}>
                <strong>Stay connected:</strong>
              </p>
              <div style={{ marginTop: '15px' }}>
                  {emailConfig.socialLinks.twitter && (
                    <a href={emailConfig.socialLinks.twitter} style={{ 
                      color: primaryColor, 
                  textDecoration: 'none',
                  margin: '0 15px',
                      fontSize: '14px',
                      fontWeight: '500'
                }}>
                  Twitter
                </a>
                  )}
                  {emailConfig.socialLinks.linkedin && (
                    <a href={emailConfig.socialLinks.linkedin} style={{ 
                      color: primaryColor, 
                  textDecoration: 'none',
                  margin: '0 15px',
                      fontSize: '14px',
                      fontWeight: '500'
                }}>
                  LinkedIn
                </a>
                  )}
                  {emailConfig.socialLinks.website && (
                    <a href={emailConfig.socialLinks.website} style={{ 
                      color: primaryColor, 
                      textDecoration: 'none',
                      margin: '0 15px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}

            <p style={{ 
              fontSize: '14px', 
              color: colorWithOpacity(textColor, 0.6), 
              marginTop: '30px',
              textAlign: 'center' as const
            }}>
              Questions? Just reply to this email—we read every message and would love to hear from you!
            </p>

            <p style={{ 
              fontSize: '14px', 
              color: colorWithOpacity(textColor, 0.6), 
              marginTop: '20px',
              textAlign: 'center' as const
            }}>
              With warmth and anticipation,<br/>
              <strong style={{ color: primaryColor }}>The {emailConfig.brandName} Team</strong>
            </p>
          </div>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center' as const,
            padding: '20px',
            background: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E6E1D8'
          }}>
            <p style={{ 
              fontSize: '12px', 
              color: colorWithOpacity(textColor, 0.6), 
              margin: '0',
              lineHeight: '1.4'
            }}>
              {emailConfig.unsubscribeText}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};
