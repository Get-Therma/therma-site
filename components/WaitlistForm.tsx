
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
    
    const endpoint = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT
    if (!endpoint) {
      // If no endpoint is configured, just show success message
      setMsg('Thank you! You\'ve been added to the waitlist.')
      setShowThankYou(true)
      
      // Add email to submitted emails list to prevent duplicates
      const submittedEmails = JSON.parse(localStorage.getItem('therma_submitted_emails') || '[]');
      submittedEmails.push(email.toLowerCase());
      localStorage.setItem('therma_submitted_emails', JSON.stringify(submittedEmails));
      return
    }
    setMsg('Submitting…')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          attribution: loadAttrib(),
          referer: typeof document !== 'undefined' ? document.referrer : null,
          ts: Date.now()
        })
      })
      if (!res.ok) throw new Error('Bad response')
      
      // Add email to submitted emails list to prevent duplicates
      const submittedEmails = JSON.parse(localStorage.getItem('therma_submitted_emails') || '[]');
      submittedEmails.push(email.toLowerCase());
      localStorage.setItem('therma_submitted_emails', JSON.stringify(submittedEmails));
      
      // Show thank you page
      setTimeout(() => {
        setShowThankYou(true)
      }, 1000)
    } catch (err) {
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
