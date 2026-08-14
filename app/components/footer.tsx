import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-ink pt-20 text-paper md:pt-32">
      <div className="section-pad">
        <div className="grid gap-12 border-b border-paper/10 pb-20 md:grid-cols-2 md:pb-32">
          <div>
            <h2 className="display text-4xl font-extrabold md:text-6xl">
              Punya ide brilian?<br />
              <em className="not-italic text-orange">Mari kita wujudkan.</em>
            </h2>
            <Link href="/start-project" className="mt-10 flex w-fit items-center gap-3 bg-orange px-8 py-4 text-xs font-bold text-ink hover:bg-paper">
              Jadwalkan Konsultasi <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 md:gap-12">
            <div>
              <p className="mono mb-6 text-[10px] text-orange">PERUSAHAAN</p>
              <ul className="space-y-4 text-paper/70">
                <li><Link href="/about" className="hover:text-white">Tentang Kami</Link></li>
                <li><Link href="/projects" className="hover:text-white">Portofolio</Link></li>
                <li><Link href="/insights" className="hover:text-white">Blog & Insight</Link></li>
                <li><Link href="/contact" className="hover:text-white">Hubungi Kami</Link></li>
              </ul>
            </div>
            <div>
              <p className="mono mb-6 text-[10px] text-orange">LAYANAN</p>
              <ul className="space-y-4 text-paper/70">
                <li><Link href="/services/website-umkm" className="hover:text-white">Website UMKM</Link></li>
                <li><Link href="/services/web-platform-saas" className="hover:text-white">Web Apps & SaaS</Link></li>
                <li><Link href="/services/ai-business-automation" className="hover:text-white">AI & Otomatisasi</Link></li>
                <li><Link href="/services/branding-desain" className="hover:text-white">Branding Digital</Link></li>
                <li><Link href="/services" className="hover:text-white font-bold text-orange">Lihat Semua →</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mono mb-6 text-[10px] text-orange">LEGAL</p>
              <ul className="space-y-4 text-paper/70">
                <li><Link href="/terms" className="hover:text-white">Syarat & Ketentuan</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Kebijakan Privasi</Link></li>
              </ul>
              
              <p className="mono mt-10 mb-4 text-[10px] text-orange">SOSIAL MEDIA</p>
              <div className="flex gap-4">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 hover:border-orange hover:text-orange">In</a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 hover:border-orange hover:text-orange">Ig</a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 hover:border-orange hover:text-orange">Tk</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 py-8 text-xs text-paper/50 md:flex-row">
          <p className="text-xl font-extrabold tracking-[-1.5px] text-paper">
            LOGIKA<span className="text-orange">in</span>
          </p>
          <p>Think Clearly. Build Logically.</p>
          <p>© 2026 LOGIKAin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
