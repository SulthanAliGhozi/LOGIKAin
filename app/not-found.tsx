import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from './components/nav'

export const metadata: Metadata = {
  title: '404 - Halaman tidak ditemukan | LOGIKAin',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <div id="top"><Nav /></div>
      <main className="section-pad flex min-h-[calc(100vh-88px)] flex-col justify-center py-24">
        <p className="mono text-[10px] text-orange">404 / HALAMAN TIDAK DITEMUKAN</p>
        <h1 className="display mt-5 max-w-3xl text-[clamp(56px,8vw,104px)] font-extrabold leading-none">
          Jalan<br />
          <em className="not-italic text-orange">buntu.</em>
        </h1>
        <p className="mt-8 max-w-md text-base leading-8 text-muted">
          Halaman yang Anda cari tidak ada, sudah dipindahkan, atau alamatnya tidak tepat. Kami bisa bantu cari arah yang benar.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="bg-ink px-5 py-4 text-xs font-bold text-paper">
            Kembali ke beranda <span className="ml-2 text-orange">&#x2197;</span>
          </Link>
          <Link href="/#services" className="border-b border-ink pb-2 text-xs font-bold">
            Lihat solusi
          </Link>
          <Link href="/#contact" className="border-b border-ink pb-2 text-xs font-bold">
            Hubungi kami
          </Link>
        </div>
        <div className="mt-16 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-5 text-xs">
          <Link href="/services" className="hover:text-orange">
            <b className="block text-xl">01</b>
            <span className="text-muted">Solusi</span>
          </Link>
          <Link href="/insights" className="hover:text-orange">
            <b className="block text-xl">02</b>
            <span className="text-muted">Insight</span>
          </Link>
          <Link href="/contact" className="hover:text-orange">
            <b className="block text-xl">03</b>
            <span className="text-muted">Kontak</span>
          </Link>
        </div>
      </main>
      <footer className="section-pad flex flex-col gap-3 border-t border-ink/25 py-8 text-xs md:flex-row md:items-center">
        <p className="text-lg font-extrabold tracking-[-1.5px]">LOGIKA<span className="text-orange">in</span></p>
        <p className="text-muted">Think Clearly. Build Logically.</p>
        <span className="text-muted md:ml-auto">&copy; 2026 LOGIKAin &middot; hello@logikain.id</span>
      </footer>
    </>
  )
}
