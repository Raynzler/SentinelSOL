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
  title: 'SentinelSOL - Distributed Validator Node Monitoring',
  description: "A Go daemon polls the validator's Solana JSON-RPC out of process and exports vote-credit accrual and slot progression to Prometheus. 3-sigma Z-score over a rolling one-hour baseline, routed through Alertmanager to Telegram.",
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