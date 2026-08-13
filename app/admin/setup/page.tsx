'use client'

import { useTransition, useState } from 'react'
import { bootstrapOwner } from '../../actions/bootstrap'

export default function SetupPage() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleBootstrap() {
    startTransition(async () => {
      const result = await bootstrapOwner()
      if (result?.error) setError(result.error)
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f0ea] p-6">
      <div className="w-full max-w-lg">
        <p className="mono text-[10px] text-[#b36f43]">LOGIKAin / SETUP AWAL</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-2px]">Setup pertama kali.</h1>
        <p className="mt-3 text-sm leading-7 text-black/60">
          Halaman ini hanya aktif selama belum ada satu pun akun dengan role <b>owner</b> atau <b>admin</b>. 
          Klik tombol di bawah untuk menjadikan akun Anda yang sedang login sebagai <b>Owner</b> — akses penuh ke seluruh platform.
        </p>

        <div className="mt-8 border border-black/10 bg-white/60 p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#b36f43]" />
            <p className="text-xs leading-6 text-black/60">
              Setelah ada owner pertama, halaman ini tidak bisa digunakan lagi — 
              semua perubahan role harus dilakukan lewat <b>/admin/users</b>.
            </p>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#b36f43]" />
            <p className="text-xs leading-6 text-black/60">
              Pastikan Anda sudah login dengan akun yang ingin dijadikan owner sebelum klik tombol ini.
            </p>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#b36f43]" />
            <p className="text-xs leading-6 text-black/60">
              Dibutuhkan <b>SUPABASE_SERVICE_ROLE_KEY</b> di file <code className="rounded bg-black/5 px-1">.env</code>.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handleBootstrap}
          disabled={pending}
          className="mt-6 w-full bg-[#171717] px-6 py-4 text-sm font-bold text-[#f3f0ea] disabled:opacity-50"
        >
          {pending ? 'Memproses...' : 'Jadikan akun ini sebagai Owner →'}
        </button>

        <p className="mt-4 text-center text-xs text-black/40">
          Sudah punya owner/admin?{' '}
          <a href="/admin" className="font-bold text-[#b36f43]">Kembali ke admin</a>
        </p>
      </div>
    </main>
  )
}
