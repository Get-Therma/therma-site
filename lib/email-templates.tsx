import React from 'react';

/**
 * Welcome Email Template for Resend
 * 
 * Conversational welcome email with:
 * - Temperature check prompt
 * - Building in public schedule
 * - All social links
 */

export interface EmailConfig {
  brandName?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    pinterest?: string;
  };
  unsubscribeText?: string;
}

const defaultConfig: EmailConfig = {
  brandName: 'Therma',
  primaryColor: '#343818',
  backgroundColor: '#F8F4ED',
  textColor: '#1a1a1a',
  secondaryTextColor: '#5C5C5C',
  socialLinks: {
    instagram: 'https://instagram.com/gettherma',
    linkedin: 'https://linkedin.com/company/get-therma',
    twitter: 'https://x.com/gettherma',
    pinterest: 'https://pinterest.com/gettherma'
  },
  unsubscribeText: "You're receiving this because you signed up for the Therma waitlist."
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
  const textColor = emailConfig.textColor || '#1a1a1a';
  const secondaryTextColor = emailConfig.secondaryTextColor || '#5C5C5C';
  
  const firstName = personalization.firstName || 'there';
  const social = emailConfig.socialLinks || defaultConfig.socialLinks!;

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Welcome to {emailConfig.brandName}</title>
        <style>{`
          @media only screen and (max-width: 600px) {
            .email-container {
              padding: 24px 16px !important;
            }
            .email-card {
              padding: 24px 20px !important;
            }
            h1 {
              font-size: 24px !important;
            }
            .social-links a {
              display: block !important;
              margin: 8px 0 !important;
            }
          }
        `}</style>
      </head>
      <body style={{ 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: '1.6', 
        color: textColor,
        backgroundColor: backgroundColor,
        margin: 0,
        padding: 0,
        WebkitFontSmoothing: 'antialiased'
      }}>
        {/* Preheader */}
        <div style={{
          display: 'none',
          fontSize: '1px',
          color: backgroundColor,
          lineHeight: '1px',
          maxHeight: 0,
          maxWidth: 0,
          opacity: 0,
          overflow: 'hidden'
        }}>
          Early access + DevLogs, demos, and prompts across our socials.
          &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
        </div>

        <div className="email-container" style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          {/* Main Card */}
          <div className="email-card" style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '40px 32px',
            border: '1px solid #E6E1D8'
          }}>
            {/* Greeting */}
            <p style={{ 
              fontSize: '16px', 
              margin: '0 0 24px 0',
              color: textColor
            }}>
              Hi {firstName},
            </p>

            {/* Main Headline */}
            <h1 style={{ 
              color: primaryColor, 
              fontSize: '28px',
              margin: '0 0 24px 0',
              fontWeight: '600',
              lineHeight: '1.3'
            }}>
              You're In—Welcome to Therma
            </h1>
            
            {/* Intro */}
            <p style={{ 
              fontSize: '16px', 
              margin: '0 0 32px 0',
              color: textColor,
              lineHeight: '1.7'
            }}>
              You just took a smart step. Therma is built for people who want steadier days without broadcasting their life to the world. You'll get early access, exclusive updates, and a first look at the privacy-first journaling companion that shows you what to change by honoring what already works.
            </p>

            {/* Temperature Check Section */}
            <div style={{
              background: '#FEFBF3',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              borderLeft: `4px solid ${primaryColor}`
            }}>
              <p style={{ 
                fontSize: '16px', 
                margin: '0 0 16px 0',
                color: textColor,
                fontWeight: '600'
              }}>
                A small thing you can use today (30 seconds):
              </p>
              
              <ol style={{ 
                margin: '0 0 16px 0',
                paddingLeft: '20px',
                color: textColor,
                fontSize: '15px',
                lineHeight: '1.8'
              }}>
                <li style={{ marginBottom: '8px' }}>What's the temperature of your day? <span style={{ color: secondaryTextColor }}>(cold / warm / overheated)</span></li>
                <li style={{ marginBottom: '8px' }}>What raised it?</li>
                <li>What would lower it by one degree?</li>
              </ol>
              
              <p style={{ 
                fontSize: '14px', 
                margin: '0',
                color: secondaryTextColor,
                fontStyle: 'italic'
              }}>
                If you reply with just the temperature, that's enough.<br/>
                (It helps us shape the beta.)
              </p>
            </div>

            {/* Social Links */}
            <p style={{ 
              fontSize: '16px', 
              margin: '0 0 12px 0',
              color: textColor,
              fontWeight: '600'
            }}>
              Follow along:
            </p>
            
            <div className="social-links" style={{ 
              marginBottom: '32px',
              fontSize: '15px',
              lineHeight: '2'
            }}>
              {social.instagram && (
                <div>
                  <strong>Instagram:</strong>{' '}
                  <a href={social.instagram} style={{ color: primaryColor, textDecoration: 'none' }}>
                    {social.instagram.replace('https://', '')}
                  </a>
                </div>
              )}
              {social.linkedin && (
                <div>
                  <strong>LinkedIn:</strong>{' '}
                  <a href={social.linkedin} style={{ color: primaryColor, textDecoration: 'none' }}>
                    {social.linkedin.replace('https://', '')}
                  </a>
                </div>
              )}
              {social.twitter && (
                <div>
                  <strong>Twitter:</strong>{' '}
                  <a href={social.twitter} style={{ color: primaryColor, textDecoration: 'none' }}>
                    {social.twitter.replace('https://', '')}
                  </a>
                </div>
              )}
              {social.pinterest && (
                <div>
                  <strong>Pinterest:</strong>{' '}
                  <a href={social.pinterest} style={{ color: primaryColor, textDecoration: 'none' }}>
                    {social.pinterest.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>

            {/* Email Promise */}
            <p style={{ 
              fontSize: '15px', 
              margin: '0 0 32px 0',
              color: secondaryTextColor,
              lineHeight: '1.7'
            }}>
              We'll email you when it's worth your attention: beta access, meaningful updates, and tools like the prompt above.
            </p>

            {/* Sign Off */}
            <p style={{ 
              fontSize: '16px', 
              margin: '0',
              color: textColor
            }}>
              — The Therma Team<br/>
              <a href="https://therma.one" style={{ color: primaryColor, textDecoration: 'none' }}>therma.one</a>
            </p>
          </div>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center' as const,
            padding: '24px 20px',
            marginTop: '16px'
          }}>
            <p style={{ 
              fontSize: '13px', 
              color: secondaryTextColor, 
              margin: '0',
              lineHeight: '1.5'
            }}>
              {emailConfig.unsubscribeText}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};
