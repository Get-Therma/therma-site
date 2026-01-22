import React from 'react';

/**
 * Welcome Email Template for Resend
 * 
 * Classic Therma welcome email with:
 * - Header with logo and tagline
 * - Inspirational quote
 * - Benefits list
 * - What is Therma section
 * - Team avatar and message
 * - Social links
 */

export interface EmailConfig {
  brandName?: string;
  logoUrl?: string;
  avatarUrl?: string;
  tagline?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
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
  };
  unsubscribeText?: string;
}

const defaultConfig: EmailConfig = {
  brandName: 'Therma',
  logoUrl: 'https://www.therma.one/therma-logo-80x80.png',
  avatarUrl: 'https://www.therma.one/bot-avatar@1x.png',
  tagline: 'See your patterns. Keep what works. Steady your days.',
  primaryColor: '#343818',
  backgroundColor: '#F8F4ED',
  textColor: '#050F1A',
  secondaryTextColor: '#5C5C5C',
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
    linkedin: 'https://linkedin.com/company/get-therma'
  },
  unsubscribeText: "You're receiving this because you signed up for the Therma waitlist. If you didn't sign up, you can safely ignore this email."
};

export interface ThankYouEmailProps {
  email: string;
  config?: Partial<EmailConfig>;
  personalization?: {
    firstName?: string;
  };
}

export const ThankYouEmailTemplate = ({ 
  email, 
  config = {},
  personalization = {}
}: ThankYouEmailProps) => {
  const emailConfig: EmailConfig = { ...defaultConfig, ...config };
  
  const primaryColor = emailConfig.primaryColor || '#343818';
  const backgroundColor = emailConfig.backgroundColor || '#F8F4ED';
  const secondaryTextColor = emailConfig.secondaryTextColor || '#5C5C5C';
  
  const greeting = personalization.firstName 
    ? `Hi ${personalization.firstName},` 
    : 'Hi there,';

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Welcome to {emailConfig.brandName}</title>
        <style>{`
          @media only screen and (max-width: 600px) {
            .email-container { padding: 20px 15px !important; }
            .email-card { padding: 20px !important; }
            .email-header { padding: 20px 15px !important; }
            .brand-logo { width: 60px !important; height: 60px !important; }
            .brand-name { font-size: 48px !important; }
            h1 { font-size: 24px !important; }
            h3 { font-size: 21px !important; }
          }
        `}</style>
      </head>
      <body style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: '1.6', 
        color: '#050F1A',
        backgroundColor: backgroundColor,
        margin: 0,
        padding: 0
      }}>
        <div className="email-container" style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          {/* Header */}
          <div className="email-header" style={{
            textAlign: 'center' as const,
            marginBottom: '40px',
            padding: '30px 20px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E6E1D8'
          }}>
            {emailConfig.logoUrl && (
              <img 
                src={emailConfig.logoUrl}
                alt={`${emailConfig.brandName} Logo`}
                width={80}
                height={80}
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
              fontWeight: 400,
              color: primaryColor,
              marginBottom: '10px',
              fontFamily: 'Georgia, serif',
              letterSpacing: '2px'
            }}>
              {emailConfig.brandName}
            </div>
            {emailConfig.tagline && (
              <p style={{ 
                fontSize: '14px', 
                margin: 0,
                color: secondaryTextColor,
                fontStyle: 'italic'
              }}>
                {emailConfig.tagline}
              </p>
            )}
          </div>

          {/* Main Content */}
          <div className="email-card" style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid #E6E1D8',
            marginBottom: '30px'
          }}>
            <h1 style={{ 
              color: primaryColor, 
              fontSize: '32px',
              margin: '0 0 20px 0',
              fontWeight: 400,
              textAlign: 'center' as const,
              fontFamily: 'Georgia, serif'
            }}>
              Welcome to the journey! 🎉
            </h1>
            
            <p style={{ fontSize: '14px', marginBottom: '20px', color: secondaryTextColor }}>
              {greeting}
            </p>
            
            <p style={{ fontSize: '14px', marginBottom: '25px', color: secondaryTextColor }}>
              Thank you for joining the Therma waitlist! We're genuinely excited to have you on this journey toward steadier, more mindful days.
            </p>

            {/* Quote */}
            {emailConfig.quote && (
              <div style={{
                background: '#FEFBF3',
                padding: '25px',
                borderRadius: '12px',
                margin: '25px 0',
                borderLeft: `4px solid ${primaryColor}`,
                textAlign: 'center' as const
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
                  color: 'rgba(5, 15, 26, 0.6)',
                  margin: 0,
                  fontStyle: 'normal'
                }}>
                  — {emailConfig.quote.author}
                </p>
              </div>
            )}

            {/* Benefits */}
            {emailConfig.benefits && emailConfig.benefits.length > 0 && (
              <div style={{
                background: '#FFFFFF',
                padding: '25px',
                borderRadius: '12px',
                margin: '25px 0',
                border: '1px solid #E6E1D8'
              }}>
                <h3 style={{ 
                  margin: '0 0 15px 0', 
                  color: primaryColor,
                  fontSize: '24px',
                  fontWeight: 400,
                  fontFamily: 'Georgia, serif'
                }}>
                  What's next on your journey?
                </h3>
                <ul style={{ 
                  margin: 0, 
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

            {/* What is Therma */}
            {emailConfig.productDescription && (
              <div style={{ margin: '25px 0' }}>
                <h3 style={{ 
                  color: primaryColor,
                  fontSize: '24px',
                  margin: '0 0 15px 0',
                  fontWeight: 400,
                  fontFamily: 'Georgia, serif'
                }}>
                  What is {emailConfig.brandName}?
                </h3>
                <p style={{ 
                  fontSize: '14px',
                  color: secondaryTextColor,
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {emailConfig.productDescription}
                </p>
              </div>
            )}

            {/* Team Section */}
            {emailConfig.teamMessage && (
              <div style={{
                textAlign: 'center' as const,
                margin: '30px 0',
                padding: '25px',
                background: '#FEFBF3',
                borderRadius: '12px',
                border: '1px solid rgba(52, 56, 24, 0.2)'
              }}>
                {emailConfig.avatarUrl && (
                  <img 
                    src={emailConfig.avatarUrl}
                    alt={`${emailConfig.brandName} Team`}
                    width={60}
                    height={60}
                    style={{
                      display: 'block',
                      margin: '0 auto 20px',
                      borderRadius: '50%',
                      border: '3px solid rgba(52, 56, 24, 0.3)',
                      boxShadow: '0 4px 12px rgba(52, 56, 24, 0.2)'
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
                  margin: 0,
                  fontWeight: 400
                }}>
                  We can't wait to share this journey with you.
                </p>
              </div>
            )}

            {/* Social Links */}
            {emailConfig.socialLinks && (
              <div style={{
                textAlign: 'center' as const,
                margin: '30px 0',
                padding: '20px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E6E1D8'
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
                      fontWeight: 500
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
                      fontWeight: 500
                    }}>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}

            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(5, 15, 26, 0.6)', 
              marginTop: '30px',
              textAlign: 'center' as const
            }}>
              Questions? Just reply to this email—we read every message and would love to hear from you!
            </p>

            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(5, 15, 26, 0.6)', 
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
              color: 'rgba(5, 15, 26, 0.6)', 
              margin: 0,
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
