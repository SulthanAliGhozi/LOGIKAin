import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Analytics } from './components/analytics'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://logikain.id'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#171717',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'LOGIKAin — Yang rumit, kami LOGIKAin.', template: '%s | LOGIKAin' },
  description: 'LOGIKAin membantu bisnis mengubah proses yang berantakan menjadi sistem digital yang mudah dipahami, siap dipakai, dan punya arah.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'id_ID', url: siteUrl, siteName: 'LOGIKAin', title: 'Yang rumit, kami LOGIKAin.', description: 'Digital partner untuk bisnis yang bergerak.', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'LOGIKAin — Yang rumit, kami LOGIKAin.', description: 'Digital partner untuk bisnis yang bergerak.', images: ['/opengraph-image'] },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        {/* DNS prefetch for Supabase */}
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="preconnect" href="https://supabase.co" crossOrigin="anonymous" />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  )
}
