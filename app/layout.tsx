import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from './components/analytics'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://logikain.id')

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#171717',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'LOGIKAin — Yang rumit, kami LOGIKAin.', template: '%s | LOGIKAin' },
  description: 'LOGIKAin membantu bisnis mengubah proses yang berantakan menjadi sistem digital yang mudah dipahami, siap dipakai, dan punya arah.',
  keywords: ['logikain', 'LOGIKAin', 'jasa pembuatan website', 'software house', 'digital agency', 'sistem informasi', 'web app', 'aplikasi web', 'otomatisasi bisnis'],
  authors: [{ name: 'LOGIKAin Team', url: siteUrl }],
  creator: 'LOGIKAin',
  publisher: 'LOGIKAin',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
  icons: { icon: '/icon.png', apple: '/icon.png' },
  openGraph: { type: 'website', locale: 'id_ID', url: siteUrl, siteName: 'LOGIKAin', title: 'LOGIKAin — Yang rumit, kami LOGIKAin.', description: 'Digital partner untuk bisnis yang bergerak.', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'LOGIKAin' }] },
  twitter: { card: 'summary_large_image', title: 'LOGIKAin — Yang rumit, kami LOGIKAin.', description: 'Digital partner untuk bisnis yang bergerak.', images: ['/opengraph-image'], creator: '@logikain' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: { google: 'vd89hi2bFvrnSi81pgVIb4CobTBGOp3F8na_P22qV3s' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'LOGIKAin' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        {/* DNS prefetch for Supabase */}
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="preconnect" href="https://supabase.co" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'Organization', name: 'LOGIKAin', alternateName: 'LOGIKAin Digital Partner', url: siteUrl, logo: `${siteUrl}/icon.png` },
            { '@type': 'WebSite', name: 'LOGIKAin', alternateName: 'LOGIKAin', url: siteUrl },
          ],
        }) }} />
        <Analytics />
      </body>
    </html>
  )
}
