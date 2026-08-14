import type { Metadata } from 'next'
import { PublicShell, PageIntro } from '../components/public-shell'
import { ArrowRight } from 'lucide-react'
import { Reveal, HoverCTA } from '../components/reveal'

export const metadata: Metadata = { 
  title: 'Tentang Kami', 
  description: 'LOGIKAin adalah startup penyedia layanan digital (Software House & Digital Agency) yang didirikan oleh mahasiswa Telkom University. Berfokus pada transformasi digital, otomasi bisnis, dan web platform.' 
}

export default function AboutPage() { 
  return (
    <PublicShell>
      <PageIntro 
        eyebrow="TENTANG KAMI / LOGIKAin" 
        title={<>Teknologi dengan<br /><em className="not-italic text-orange">logika manusia.</em></>} 
        description="Lebih dari sekadar agensi digital. LOGIKAin adalah startup teknologi yang berfokus membangun solusi bisnis B2B premium melalui perpaduan desain, kode, dan otomasi." 
      />

      {/* Origin Story / Profiling */}
      <section className="section-pad grid gap-10 border-y border-line py-20 md:grid-cols-[1fr_1.5fr] md:py-32">
        <div>
          <Reveal delay={0.1}><p className="mono text-[10px] text-muted">IDENTITAS KAMI</p></Reveal>
          <Reveal delay={0.2}><h2 className="display mt-5 text-4xl font-extrabold md:text-5xl">Titik awal dari<br /><em className="not-italic text-orange">Telkom University.</em></h2></Reveal>
        </div>
        <Reveal delay={0.3}>
        <div className="space-y-6 text-base leading-8 text-muted md:text-lg md:leading-9">
          <p>
            <strong className="text-ink">LOGIKAin</strong> lahir sebagai sebuah startup *Software House & Digital Agency* yang diinisiasi oleh mahasiswa <strong className="text-ink">Telkom University</strong>. Kami melihat banyak bisnis terjebak dalam proses manual yang lambat atau teknologi yang terlalu rumit untuk digunakan.
          </p>
          <p>
            Kami hadir untuk menjembatani celah tersebut. Kami percaya bahwa secanggih apapun sebuah kode ditulis, ia tidak akan berguna jika tidak menggunakan logika yang memanusiakan penggunanya.
          </p>
          <div className="mt-8 grid gap-4 border-t border-line pt-8 md:grid-cols-3">
            <div>
              <p className="text-3xl font-extrabold text-ink">B2B</p>
              <p className="mt-2 text-xs">Fokus Solusi Bisnis</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-ink">End-to-End</p>
              <p className="mt-2 text-xs">Dari Riset hingga Rilis</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-ink">Premium</p>
              <p className="mt-2 text-xs">Standar Desain Global</p>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* Philosophy */}
      <section className="section-pad bg-ink py-24 text-paper md:py-32">
        <Reveal slide={false}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mono text-[10px] text-orange">FILOSOFI KERJA KAMI</p>
          <h2 className="display mt-5 text-4xl font-extrabold md:text-6xl">
            Think Clearly.<br />
            <em className="not-italic text-orange">Build Logically.</em>
          </h2>
          <p className="mt-8 text-sm leading-8 text-paper/70 md:text-base md:leading-9">
            Kami tidak sekadar menulis kode. Kami merancang alur operasi yang mempercepat keputusan, membangun pengalaman visual yang membuat klien betah, dan mengotomatisasi hal-hal repetitif agar tim Anda bisa fokus pada pertumbuhan.
          </p>
        </div>
        </Reveal>
      </section>

      {/* What we do */}
      <section className="section-pad py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Reveal><p className="mono text-[10px] text-orange">FOKUS KEAHLIAN</p></Reveal>
            <Reveal>
              <h2 className="display mt-5 text-4xl font-extrabold md:text-5xl">Kami tidak mengerjakan segalanya.</h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-muted">
                Kami membatasi layanan kami hanya pada hal-hal yang benar-benar kami kuasai di level tertinggi. Jika Anda butuh solusi murahan yang asal jadi, kami bukan tempatnya.
              </p>
            </Reveal>
          </div>
          <div className="grid gap-6">
            {[
              ['Otomatisasi Bisnis (AI & Workflow)', 'Menggantikan pekerjaan manual yang berulang dengan sistem cerdas.'],
              ['Pengembangan Web Platform', 'Membangun aplikasi web, SaaS, dan portal B2B yang tangguh.'],
              ['UI/UX & Product Design', 'Merancang tampilan antarmuka yang setara dengan produk kelas dunia.'],
            ].map(([title, desc], i) => (
              <Reveal key={i} delay={i * 0.1}>
              <div className="border border-line p-6 hover:border-orange transition-colors">
                <p className="mono text-[10px] text-orange">0{i + 1}</p>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted">{desc}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-[#eae4dc] py-24 text-center md:py-32">
        <Reveal>
        <h2 className="display text-4xl font-extrabold md:text-6xl">Siap membangun sesuatu?</h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-muted">
          Mari diskusikan masalah bisnis Anda, dan temukan bagaimana logika dan teknologi bisa menyelesaikannya.
        </p>
        <div className="mt-10 flex justify-center">
          <HoverCTA href="/start-project" className="flex w-fit items-center gap-3 bg-ink px-8 py-4 text-xs font-bold text-paper hover:bg-orange transition-colors">
            Jadwalkan Konsultasi <ArrowRight className="h-4 w-4" />
          </HoverCTA>
        </div>
        </Reveal>
      </section>
    </PublicShell>
  )
}
