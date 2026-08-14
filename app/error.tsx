'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <>
      <header className="section-pad flex items-center justify-between border-b border-ink/10 py-5">
        <Link href="/" className="text-xl font-extrabold tracking-[-1.5px]">
          LOGIKA<span className="text-orange">in</span>
        </Link>
      </header>
      <main className="section-pad flex min-h-[calc(100vh-88px)] flex-col justify-center py-24">
        <p className="mono text-[10px] text-orange">500 / TERJADI KESALAHAN</p>
        <h1 className="display mt-5 max-w-3xl text-[clamp(56px,8vw,104px)] font-extrabold leading-none">
          Ada yang<br />
          <em className="not-italic text-orange">tidak beres.</em>
        </h1>
        <p className="mt-8 max-w-md text-base leading-8 text-muted">
          Terjadi kesalahan di server kami. Tim teknis sudah dinotifikasi. Silakan coba lagi atau hubungi kami jika masalah berlanjut.
        </p>
        {error.digest && (
          <p className="mono mt-3 text-xs text-muted">
            Error ID: <span className="font-bold">{error.digest}</span>
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={reset}
            className="bg-ink px-5 py-4 text-xs font-bold text-paper"
          >
            Coba lagi <span className="ml-2 text-orange">↺</span>
          </button>
          <Link href="/" className="border-b border-ink pb-2 text-xs font-bold">
            Kembali ke beranda
          </Link>
          <Link href="/#contact" className="border-b border-ink pb-2 text-xs font-bold">
            Hubungi kami
          </Link>
        </div>
      </main>
      <footer className="section-pad flex flex-col gap-3 border-t border-ink/25 py-8 text-xs md:flex-row md:items-center">
        <p className="text-lg font-extrabold tracking-[-1.5px]">LOGIKA<span className="text-orange">in</span></p>
        <p className="text-muted">Think Clearly. Build Logically.</p>
        <span className="text-muted md:ml-auto">© 2026 LOGIKAin · hello@logikain.id</span>
      </footer>
    </>
  )
}
