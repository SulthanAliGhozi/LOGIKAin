import { Nav } from '../components/nav'
import { Footer } from '../components/footer'
import Link from 'next/link'

const b2cProducts = [
  { slug: 'web-umkm-starter', name: 'Website UMKM Starter', price: 350000, desc: 'Website 1 halaman + Katalog WhatsApp. Selesai dalam 3 hari.' },
  { slug: 'paket-desain-sosmed', name: 'Paket Desain Sosmed', price: 150000, desc: '10 Template Feed Instagram premium siap pakai (Canva).' },
  { slug: 'ebook-closing', name: 'E-Book: Closing Sprint', price: 99000, desc: 'Teknik rahasia closing 3 juta pertama dalam 7 hari.' }
]

export default function StorePage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#f3f0ea] p-6 md:p-20 text-[#171717]">
        <div className="max-w-5xl mx-auto">
          <p className="mono text-[10px] tracking-widest text-[#b36f43] mb-4">B2C DIGITAL STORE</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-[-2px] mb-4">Produk Instan.</h1>
          <p className="text-sm text-black/60 max-w-xl mb-12">Beli layanan cepat dan aset digital langsung tanpa perlu meeting. Pembayaran otomatis via QRIS.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {b2cProducts.map(p => (
              <div key={p.slug} className="border border-black/10 bg-white/50 p-6 flex flex-col hover:border-[#b36f43]/40 transition-colors">
                <h3 className="text-xl font-bold tracking-tight">{p.name}</h3>
                <p className="text-xs text-black/60 mt-3 flex-grow">{p.desc}</p>
                <div className="mt-8 border-t border-black/10 pt-4 flex items-center justify-between">
                  <span className="font-mono font-bold">Rp {p.price.toLocaleString('id-ID')}</span>
                  <Link href={`/checkout/${p.slug}`} className="bg-[#171717] text-[#f3f0ea] px-4 py-2 text-xs font-bold hover:bg-[#b36f43] transition-colors">
                    Beli ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
