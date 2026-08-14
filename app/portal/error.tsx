'use client'

import { useEffect } from 'react'

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f3f0ea] p-6 text-[#171717]">
      <div className="w-full max-w-lg text-center">
        <p className="mono text-[10px] text-[#b36f43]">CLIENT PORTAL / ERROR</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-[-3px]">
          Ada yang<br />
          <span className="text-[#b36f43]">tidak beres.</span>
        </h1>
        <p className="mt-5 text-sm leading-7 text-black/55">
          Halaman portal ini tidak dapat dimuat. Silakan coba lagi — data proyek dan invoice Anda aman.
        </p>
        {error.digest && (
          <p className="mono mt-3 text-xs text-black/30">ID: {error.digest}</p>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={reset}
            className="bg-[#171717] px-6 py-3 text-xs font-bold text-[#f3f0ea]"
          >
            Coba lagi ↺
          </button>
          <a href="/portal" className="border-b border-black/30 pb-px text-xs font-bold text-black/60">
            Kembali ke portal
          </a>
        </div>
      </div>
    </main>
  )
}
