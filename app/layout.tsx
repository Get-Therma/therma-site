import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Therma · Coming Soon',
  description: 'Your space to slow down, check in, and feel supported. Daily reflections, gentle prompts, and an AI companion that listens.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}