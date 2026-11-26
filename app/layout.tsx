import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Providers } from '@/components/providers'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })

export const metadata: Metadata = {
  title: 'Campus Helper — PGs, tiffin & books near campus, no brokers',
  description:
    'Find PGs, tiffin and mess services and second-hand books near your college. Talk to owners directly on WhatsApp — zero brokerage.',
  generator: 'v0.app',
  openGraph: {
    title: 'Campus Helper — no-broker student living',
    description: 'PGs, tiffin and second-hand books near your college, straight from owners.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#3b3fb8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="antialiased">
        <Providers>
          <SiteHeader />
          <main className="pb-16">{children}</main>
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
