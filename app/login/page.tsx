import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '../components/login-form'
import { Wordmark } from '../components/nav'

export const metadata: Metadata = { title: 'Masuk | LOGIKAin', robots: { index: false, follow: false } }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams; const destination = next === '/admin' ? '/admin' : '/portal'; const message = error === 'staff_required' ? 'Akun belum memiliki akses staff aktif.' : error === 'profile_error' ? 'Profile akun tidak dapat dibaca.' : error === 'membership_required' ? 'Akun belum dihubungkan ke client portal.' : ''
  return <main className="min-h-screen bg-ink px-6 py-8 text-paper md:px-12"><header className="flex items-center justify-between"><Link href="/" aria-label="LOGIKAin home"><Wordmark className="text-xl text-paper" /></Link><a href="/register" className="text-xs font-bold text-paper/70 hover:text-orange">Belum punya akun? <span className="text-orange">Daftar</span></a></header><section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-12 py-14 md:grid-cols-[.9fr_1.1fr] md:gap-24"><div><p className="mono text-[10px] text-orange">CLIENT PORTAL / SECURE ACCESS</p><h1 className="mt-5 max-w-xl text-5xl font-extrabold tracking-[-3px] md:text-7xl">Masuk dan lanjutkan pekerjaan.</h1><p className="mt-6 max-w-md text-sm leading-7 text-paper/60">Gunakan username atau email yang terdaftar untuk membuka workspace Anda.</p></div><div className="max-w-md rounded-sm border border-paper/15 bg-paper/[.04] p-6 md:p-8"><h2 className="text-2xl font-extrabold">Selamat datang kembali.</h2>{message && <p className="mt-5 border border-orange/40 bg-orange/10 p-4 text-sm text-orange">{message}</p>}<LoginForm next={destination} /><p className="mt-6 text-center text-xs text-paper/50">Belum punya akun? <a href="/register" className="font-bold text-orange">Buat akun baru</a></p></div></section></main>
}
