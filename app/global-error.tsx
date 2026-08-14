'use client'

import { useEffect } from 'react'

// global-error wraps the root layout, so it must include <html> and <body>
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <html lang="id">
      <body style={{ margin: 0, background: '#171717', color: '#f3f0ea', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <p style={{ fontSize: '10px', letterSpacing: '2px', color: '#b36f43', fontFamily: 'monospace', marginBottom: '1rem' }}>
          CRITICAL ERROR
        </p>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1, marginBottom: '1.5rem' }}>
          Platform<br />
          <span style={{ color: '#b36f43' }}>error.</span>
        </h1>
        <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(243,240,234,0.6)', maxWidth: '400px', textAlign: 'center', marginBottom: '2rem' }}>
          Terjadi kesalahan kritis pada platform. Silakan refresh halaman atau hubungi support LOGIKAin.
        </p>
        {error.digest && (
          <p style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(243,240,234,0.4)', marginBottom: '1.5rem' }}>
            ID: {error.digest}
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{ background: '#b36f43', color: '#f3f0ea', border: 'none', padding: '14px 24px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Refresh platform ↺
          </button>
          <a
            href="/"
            style={{ color: 'rgba(243,240,234,0.6)', fontSize: '12px', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(243,240,234,0.3)', paddingBottom: '2px', display: 'flex', alignItems: 'center' }}
          >
            Kembali ke beranda
          </a>
        </div>
      </body>
    </html>
  )
}
