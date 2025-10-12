import React from 'react';

export const ThankYouEmailTemplate = ({ email }: { email: string }) => {
  return (
    <html>
      <body style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        lineHeight: '1.6', 
        color: '#333',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #8fbc8f 0%, #f5f5dc 100%)',
          padding: '40px 20px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            margin: '0 0 10px 0',
            color: '#2d5016',
            fontFamily: 'serif'
          }}>
            Welcome to Therma
          </h1>
          <p style={{ 
            fontSize: '18px', 
            margin: '0',
            color: '#4a7c59',
            fontStyle: 'italic'
          }}>
            Thank you for joining our waitlist!
          </p>
        </div>

        <div style={{ padding: '0 20px' }}>
          <h2 style={{ color: '#2d5016', fontSize: '24px' }}>
            You're on the list! 🎉
          </h2>
          
          <p>
            Hi there,
          </p>
          
          <p>
            Thank you for joining the Therma waitlist! We're excited to have you on this journey toward steadier, more mindful days.
          </p>

          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #8fbc8f'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2d5016' }}>
              What's next?
            </h3>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>Early access to Therma when we launch</li>
              <li>Exclusive updates on our progress</li>
              <li>Special perks for our first 1,000 users</li>
            </ul>
          </div>

          <p>
            <strong>What is Therma?</strong><br/>
            Therma is a private, AI-guided journaling app that turns your check-ins, habits, and notes into pattern maps—highlighting bright spots to keep and frictions to tweak—so small changes add up to steadier weeks.
          </p>

          <div style={{ 
            textAlign: 'center', 
            margin: '30px 0',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ margin: '0', fontSize: '16px', color: '#666' }}>
              <strong>Stay connected:</strong><br/>
              Follow us for updates and mindfulness tips
            </p>
            <div style={{ marginTop: '15px' }}>
              <a href="https://twitter.com/gettherma" style={{ 
                color: '#8fbc8f', 
                textDecoration: 'none',
                margin: '0 10px'
              }}>
                Twitter
              </a>
              <a href="https://linkedin.com/company/gettherma" style={{ 
                color: '#8fbc8f', 
                textDecoration: 'none',
                margin: '0 10px'
              }}>
                LinkedIn
              </a>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '30px' }}>
            Questions? Just reply to this email—we'd love to hear from you!
          </p>

          <p style={{ fontSize: '14px', color: '#999', marginTop: '20px' }}>
            Best regards,<br/>
            The Therma Team
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />
          
          <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
            You're receiving this because you signed up for the Therma waitlist.<br/>
            If you didn't sign up, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  );
};
