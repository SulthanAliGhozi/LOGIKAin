'use client'

import { useTransition, useState, useEffect } from 'react'
import { claimOwner, getActiveOwners } from '../../actions/bootstrap'

type Owner = { id: string; username: string | null; full_name: string | null; role: string }

export default function SetupPage() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getActiveOwners().then((data) => { setOwners(data); setLoading(false) })
  }, [])

  function handleClaim() {
    setError('')
    startTransition(async () => {
      const result = await claimOwner()
      if (result?.error) setError(result.error)
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f0ea] p-6">
      <div className="w-full max-w-lg">
        <a href="/admin" className="text-xs text-black/40 hover:text-black">← Kembali ke admin</a>
        <p className="mono mt-6 text-[10px] text-[#b36f43]">LOGIKAin / SETUP OWNERSHIP</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">Claim ownership.</h1>
        <p className="mt-3 text-sm leading-7 text-black/60">
          Jadikan akun yang sedang login sebagai <b>Owner</b> — akses penuh ke seluruh platform termasuk manajemen user dan role.
        </p>

        {/* Daftar owner/admin yang sudah ada */}
        {!loading && (
          <div className="mt-6 border border-black/10 bg-white/60 p-5">
            <p className="mono text-[9px] text-black/40">OWNER / ADMIN AKTIF SAAT INI</p>
            {owners.length === 0 ? (
              <p className="mt-3 text-sm text-black/50">Belum ada owner/admin aktif.</p>
            ) : (
              <div className="mt-3 divide-y divide-black/5">
                {owners.map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-bold">{o.full_name || o.username || '(tanpa nama)'}</p>
                      {o.username && <p className="text-xs text-black/40">@{o.username}</p>}
                    </div>
                    <span className="rounded-full bg-[#b36f43]/10 px-3 py-1 text-[10px] font-bold uppercase text-[#8c542f]">{o.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 border border-[#b36f43]/20 bg-[#b36f43]/5 p-4 text-xs leading-6 text-black/60">
          ⚠️ Aksi ini akan langsung set akun Anda (yang sedang login) menjadi <b>Owner</b>. Pastikan Anda sudah login dengan akun yang benar sebelum klik tombol di bawah.
        </div>

        {error && (
          <div className="mt-3 border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <button
          onClick={handleClaim}
          disabled={pending}
          className="mt-4 w-full bg-[#171717] px-6 py-4 text-sm font-bold text-[#f3f0ea] hover:bg-black disabled:opacity-50"
        >
          {pending ? 'Memproses...' : 'Set akun ini sebagai Owner →'}
        </button>
      </div>
    </main>
  )
}
