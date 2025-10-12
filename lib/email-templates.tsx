import React from 'react';

export const ThankYouEmailTemplate = ({ email }: { email: string }) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Therma</title>
      </head>
      <body style={{ 
        fontFamily: 'PPPangaia, system-ui, -apple-system, sans-serif', 
        lineHeight: '1.6', 
        color: '#FFFFFF',
        backgroundColor: '#000000',
        margin: 0,
        padding: 0,
        minHeight: '100vh'
      }}>
        {/* Background with animated gradients similar to website */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 80%, rgba(143, 188, 143, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(245, 245, 220, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(143, 188, 143, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #1a1a1a 100%)
          `,
          zIndex: -1
        }}></div>

        <div style={{ 
          maxWidth: '600px',
          margin: '0 auto',
          padding: '40px 20px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Header with logo and branding */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '40px',
            padding: '30px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '400',
              color: '#8fbc8f',
              marginBottom: '10px',
              fontFamily: 'PPPangaia, serif',
              letterSpacing: '2px'
            }}>
              Therma
            </div>
            <p style={{ 
              fontSize: '18px', 
              margin: '0',
              color: 'rgba(255, 255, 255, 0.8)',
              fontStyle: 'italic'
            }}>
              See your patterns. Keep what works. Steady your days.
            </p>
          </div>

          {/* Main content */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(15px)',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '30px'
          }}>
            <h1 style={{ 
              color: '#8fbc8f', 
              fontSize: '28px',
              margin: '0 0 20px 0',
              fontWeight: '400',
              textAlign: 'center'
            }}>
              Welcome to the journey! 🎉
            </h1>
            
            <p style={{ fontSize: '16px', marginBottom: '20px', color: 'rgba(255, 255, 255, 0.9)' }}>
              Hi there,
            </p>
            
            <p style={{ fontSize: '16px', marginBottom: '25px', color: 'rgba(255, 255, 255, 0.9)' }}>
              Thank you for joining the Therma waitlist! We're genuinely excited to have you on this journey toward steadier, more mindful days.
            </p>

            {/* Science-based quote */}
            <div style={{ 
              background: 'rgba(143, 188, 143, 0.1)',
              padding: '25px',
              borderRadius: '12px',
              margin: '25px 0',
              borderLeft: '4px solid #8fbc8f',
              textAlign: 'center'
            }}>
              <p style={{ 
                fontSize: '18px',
                fontStyle: 'italic',
                color: '#8fbc8f',
                margin: '0 0 10px 0',
                lineHeight: '1.5'
              }}>
                "The mind is everything. What you think you become."
              </p>
              <p style={{ 
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0',
                fontStyle: 'normal'
              }}>
                — Buddha, on the power of mindful awareness
              </p>
            </div>

            {/* What's next section */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '25px',
              borderRadius: '12px',
              margin: '25px 0',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ 
                margin: '0 0 15px 0', 
                color: '#8fbc8f',
                fontSize: '20px',
                fontWeight: '400'
              }}>
                What's next on your journey?
              </h3>
              <ul style={{ 
                margin: '0', 
                paddingLeft: '20px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                <li style={{ marginBottom: '8px' }}>Early access to Therma when we launch</li>
                <li style={{ marginBottom: '8px' }}>Exclusive updates on our progress and new features</li>
                <li style={{ marginBottom: '8px' }}>Special perks for our first 1,000 mindful pioneers</li>
                <li style={{ marginBottom: '8px' }}>Science-backed insights delivered to your inbox</li>
              </ul>
            </div>

            {/* Therma explanation */}
            <div style={{ margin: '25px 0' }}>
              <h3 style={{ 
                color: '#8fbc8f',
                fontSize: '18px',
                margin: '0 0 15px 0',
                fontWeight: '400'
              }}>
                What is Therma?
              </h3>
              <p style={{ 
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Therma is a private, AI-guided journaling app that turns your check-ins, habits, and notes into pattern maps—highlighting bright spots to keep and frictions to tweak—so small changes add up to steadier weeks.
              </p>
            </div>

            {/* Warm invitation */}
            <div style={{ 
              textAlign: 'center',
              margin: '30px 0',
              padding: '25px',
              background: 'rgba(143, 188, 143, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(143, 188, 143, 0.2)'
            }}>
              <p style={{ 
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 15px 0',
                lineHeight: '1.5'
              }}>
                We're building something special together—a tool that honors your privacy while helping you discover the patterns that make your days more meaningful.
              </p>
              <p style={{ 
                fontSize: '16px',
                color: '#8fbc8f',
                margin: '0',
                fontWeight: '400'
              }}>
                We can't wait to share this journey with you.
              </p>
            </div>

            {/* Social links */}
            <div style={{ 
              textAlign: 'center', 
              margin: '30px 0',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px'
            }}>
              <p style={{ 
                margin: '0 0 15px 0', 
                fontSize: '16px', 
                color: 'rgba(255, 255, 255, 0.8)' 
              }}>
                <strong>Stay connected:</strong>
              </p>
              <div style={{ marginTop: '15px' }}>
                <a href="https://twitter.com/gettherma" style={{ 
                  color: '#8fbc8f', 
                  textDecoration: 'none',
                  margin: '0 15px',
                  fontSize: '16px'
                }}>
                  Twitter
                </a>
                <a href="https://linkedin.com/company/gettherma" style={{ 
                  color: '#8fbc8f', 
                  textDecoration: 'none',
                  margin: '0 15px',
                  fontSize: '16px'
                }}>
                  LinkedIn
                </a>
              </div>
            </div>

            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)', 
              marginTop: '30px',
              textAlign: 'center'
            }}>
              Questions? Just reply to this email—we'd love to hear from you!
            </p>

            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.6)', 
              marginTop: '20px',
              textAlign: 'center'
            }}>
              With warmth and anticipation,<br/>
              <strong style={{ color: '#8fbc8f' }}>The Therma Team</strong>
            </p>
          </div>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <p style={{ 
              fontSize: '12px', 
              color: 'rgba(255, 255, 255, 0.5)', 
              margin: '0',
              lineHeight: '1.4'
            }}>
              You're receiving this because you signed up for the Therma waitlist.<br/>
              If you didn't sign up, you can safely ignore this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};
