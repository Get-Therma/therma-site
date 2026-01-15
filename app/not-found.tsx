import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - 404',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <style>{`
          .home-link {
            display: inline-block;
            padding: 12px 24px;
            background-color: #ff5930;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .home-link:hover {
            background-color: #e04a26;
          }
        `}</style>
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '600px',
        }}>
          <h1 style={{
            fontSize: '6rem',
            margin: 0,
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff5930, #fcb200, #830698, #7ca2fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            404
          </h1>
          <h2 style={{
            fontSize: '2rem',
            marginTop: '1rem',
            marginBottom: '1rem',
            fontWeight: 600,
          }}>
            Page Not Found
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}>
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className="home-link">
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
