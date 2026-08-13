import type { Metadata } from 'next'
import Link from 'next/link'
import { SignUpForm } from '../components/signup-form'
import { Wordmark } from '../components/nav'

export const metadata: Metadata = { title: 'Daftar | LOGIKAin', robots: { index: false, follow: false } }

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-ink px-6 py-8 text-paper md:px-12">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="LOGIKAin home"><Wordmark className="text-xl text-paper" /></Link>
        <a href="/login" className="text-xs font-bold text-paper/70 hover:text-orange">Sudah punya akun? <span className="text-orange">Masuk</span></a>
      </header>
      <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-12 py-14 md:grid-cols-[1.05fr_.95fr] md:gap-24">
        <div>
          <p className="mono text-[10px] text-orange">CLIENT PORTAL / CREATE ACCOUNT</p>
          <h1 className="mt-5 max-w-xl text-5xl font-extrabold tracking-[-3px] md:text-7xl">Buat identitas kerja Anda.</h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-paper/60">Daftar sekali, langsung bisa masuk. Tidak perlu konfirmasi email — akun Anda aktif seketika.</p>
          <div className="mt-8 grid gap-3 text-sm text-paper/70">
            <p>01 <span className="ml-3">Isi username, nama, email, dan password</span></p>
            <p>02 <span className="ml-3">Klik "Buat akun" — selesai</span></p>
            <p>03 <span className="ml-3">Langsung masuk ke portal client Anda</span></p>
          </div>
        </div>
        <div className="max-w-md rounded-sm border border-paper/15 bg-paper/[.04] p-6 md:p-8">
          <h2 className="text-2xl font-extrabold">Buat akun baru.</h2>
          <SignUpForm />
          <p className="mt-6 text-center text-xs text-paper/50">Sudah punya akun? <a href="/login" className="font-bold text-orange">Masuk sekarang</a></p>
        </div>
      </section>
    </main>
  )
}
