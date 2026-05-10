import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: 'SentinelSOL - Predictive Observability for Solana Validators',
  description: 'An 8MB sidecar that detects node degradation before it impacts your epoch returns. Zero external API fees, zero bloat.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}