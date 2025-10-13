import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beta Program Terms · Therma',
  description: 'Terms for participating in the Therma beta: confidentiality, feedback license, no warranty, and data caution.',
};

export default function BetaTermsPage() {
  return (
    <main style={{ padding: '2rem 1.25rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Beta Program Terms</h1>
      
      <p>Pre‑release software can change quickly and may contain bugs. By joining the beta, you agree:</p>
      
      <ul>
        <li><strong>Confidentiality:</strong> Don't publicly share screenshots or benchmarks without permission.</li>
        <li><strong>Feedback license:</strong> You grant us the right to use feedback to improve Therma.</li>
        <li><strong>No warranty:</strong> Beta may be interrupted or discontinued at any time.</li>
        <li><strong>Data caution:</strong> Avoid entering highly sensitive information during early beta.</li>
      </ul>
      
      <h2>Contact</h2>
      <p><a href="mailto:support@gettherma.ai">support@gettherma.ai</a></p>
    </main>
  );
}
