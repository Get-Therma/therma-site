
import { useEffect, useState } from 'react'

const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid']
const LS_KEY = 'therma_attrib'

function getQueryParams() {
  const out: Record<string, string> = {}
  const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  UTM_KEYS.forEach(k => { const v = sp.get(k); if (v) out[k] = v })
  return out
}
function loadAttrib(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} }
}
function saveAttrib(data: Record<string,string>) {
  const curr = loadAttrib()
  localStorage.setItem(LS_KEY, JSON.stringify({ ...curr, ...data }))
}

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)

  useEffect(() => {
    const qp = getQueryParams()
    if (Object.keys(qp).length) saveAttrib(qp)
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Check if email has already been submitted
    const submittedEmails = JSON.parse(localStorage.getItem('therma_submitted_emails') || '[]');
    if (submittedEmails.includes(email.toLowerCase())) {
      setMsg('This email is already on our waitlist!');
      return;
    }
    
    setMsg('Submitting…')
    try {
      // Check if Beehiiv API key is available
      const beehiivApiKey = process.env.NEXT_PUBLIC_BEEHIIV_API_KEY;
      
      if (beehiivApiKey && beehiivApiKey !== 'YOUR_BEEHIIV_API_KEY') {
        // Submit to Beehiiv API
        const beehiivResponse = await fetch('https://api.beehiiv.com/v2/publications/pub_0365e6c3-9f7c-4e2c-b315-bb3cd68b205e/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${beehiivApiKey}`
          },
          body: JSON.stringify({
            email: email,
            utm_source: loadAttrib().utm_source || (typeof document !== 'undefined' ? document.referrer : null),
            utm_medium: loadAttrib().utm_medium || 'website',
            utm_campaign: loadAttrib().utm_campaign || 'waitlist',
            reactivate_existing: false,
            send_welcome_email: true
          })
        });

        if (!beehiivResponse.ok) {
          throw new Error(`Beehiiv API error: ${beehiivResponse.status}`);
        }

        const result = await beehiivResponse.json();
        console.log('Beehiiv subscription created:', result);
      } else {
        // Fallback: Log the submission for now
        console.log('Beehiiv API key not configured. Email logged locally:', email);
        console.log('Attribution data:', loadAttrib());
      }
      
      // Add email to submitted emails list to prevent duplicates
      const submittedEmails = JSON.parse(localStorage.getItem('therma_submitted_emails') || '[]');
      submittedEmails.push(email.toLowerCase());
      localStorage.setItem('therma_submitted_emails', JSON.stringify(submittedEmails));
      
      // Show thank you page
      setTimeout(() => {
        setShowThankYou(true)
      }, 1000)
    } catch (err) {
      console.error('Form submission error:', err);
      setMsg('Something went wrong. Please try again.')
    }
  }

  if (showThankYou) {
    return (
      <div className="stack">
        <div className="confirmation-icon">😊</div>
        <h1>Thank you</h1>
        <div className="sp-8"></div>
        <p className="muted">Thanks for joining the waitlist - updates will come by email.</p>
      </div>
    )
  }

  return (
    <form className="stack" style={{ gap: 12 }} onSubmit={onSubmit}>
      <div className="pillInput">
        <input type="email" placeholder="Leave your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div><button className="btn" type="submit">Join Waitlist</button></div>
      <p className="caption" role="status">{msg}</p>
    </form>
  )
}
