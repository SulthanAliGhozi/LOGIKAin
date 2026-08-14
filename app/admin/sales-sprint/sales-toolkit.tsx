'use client'

import { useState } from 'react'
import { SprintCalculator } from './sprint-calculator'

type Product = { name: string, price: number, slug: string, desc: string }

export function SalesToolkit({ products }: { products: Product[] }) {
  // 1. Offer & Message Generator
  const [clientName, setClientName] = useState('')
  const [clientNeed, setClientNeed] = useState('mendapat lebih banyak pelanggan dari WhatsApp')
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.slug || '')
  
  const selectedP = products.find(p => p.slug === selectedProduct)

  const generateMessage = () => {
    if (!selectedP) return ''
    return `Halo ${clientName ? clientName : 'Kak'}, saya lihat bisnisnya punya potensi bagus. Saya bisa bantu ${clientNeed} lewat ${selectedP.name}.\n\nYang didapat:\n• ${selectedP.desc}\n• Pengerjaan express\n• Harga penawaran Rp ${selectedP.price.toLocaleString('id-ID')}\n\nKalau berkenan, saya kirim contoh konsepnya gratis dulu. Mau saya buatkan?`
  }
  
  const waLink = `https://wa.me/?text=${encodeURIComponent(generateMessage())}`

  // 2. Market Finder
  const [industry, setIndustry] = useState('kafe')
  const [city, setCity] = useState('Jakarta Selatan')
  const searchQuery = `${industry} ${city}`

  // 3. Lead Collection (Mock state, in reality we'd save to DB via Server Action)
  const [leads, setLeads] = useState<any[]>([])
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', source: 'Google Maps', problem: 'Belum memiliki website', followUp: '' })
  
  const saveLead = (e: React.FormEvent) => {
    e.preventDefault()
    setLeads([...leads, { ...leadForm, product: selectedP?.name, price: selectedP?.price, id: Date.now() }])
    setLeadForm({ ...leadForm, name: '', phone: '' })
    alert('Prospek berhasil ditambahkan ke CRM lokal!')
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* LEFT COLUMN: Main Tools */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Target Calculator */}
        <SprintCalculator products={products} />

        {/* Market Finder */}
        <div className="bg-white p-8 border border-black/10 rounded-xl shadow-sm">
          <div className="flex items-start gap-4 border-b border-black/10 pb-6 mb-6">
            <span className="bg-[#171717] text-white font-mono text-xs px-2 py-1 rounded">01</span>
            <div>
              <h2 className="text-xl font-bold">Market Finder</h2>
              <p className="text-xs text-black/60">Cari calon pelanggan berdasarkan jenis usaha dan lokasi dari berbagai platform.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold mb-2">Jenis Usaha</label>
              <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} className="w-full border border-black/15 p-3 text-sm" placeholder="kafe" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2">Kota / Wilayah</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full border border-black/15 p-3 text-sm" placeholder="Jakarta Selatan" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {['kafe', 'salon', 'barbershop', 'laundry', 'bengkel', 'rental mobil'].map(k => (
              <button key={k} onClick={() => setIndustry(k)} className="px-3 py-1 bg-black/5 hover:bg-black/10 rounded text-xs font-medium">{k}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`} target="_blank" className="flex flex-col p-4 border border-black/10 hover:border-[#b36f43] rounded-lg transition-colors">
              <b className="text-sm">Google Maps ↗</b>
              <span className="text-xs text-black/50">Bisnis lokal, nomor & ulasan</span>
            </a>
            <a href={`https://www.google.com/search?q=site:instagram.com+${encodeURIComponent(searchQuery)}`} target="_blank" className="flex flex-col p-4 border border-black/10 hover:border-[#b36f43] rounded-lg transition-colors">
              <b className="text-sm">Instagram ↗</b>
              <span className="text-xs text-black/50">Akun aktif, katalog & DM</span>
            </a>
            <a href={`https://www.tiktok.com/search?q=${encodeURIComponent(searchQuery)}`} target="_blank" className="flex flex-col p-4 border border-black/10 hover:border-[#b36f43] rounded-lg transition-colors">
              <b className="text-sm">TikTok ↗</b>
              <span className="text-xs text-black/50">UMKM aktif & konten lokal</span>
            </a>
            <a href={`https://projects.co.id/public/browse_projects/listing?search=${encodeURIComponent(industry)}`} target="_blank" className="flex flex-col p-4 border border-black/10 hover:border-[#b36f43] rounded-lg transition-colors">
              <b className="text-sm">Projects.co.id ↗</b>
              <span className="text-xs text-black/50">Project website freelance</span>
            </a>
          </div>
        </div>

        {/* Message Generator */}
        <div className="bg-white p-8 border border-black/10 rounded-xl shadow-sm">
          <div className="flex items-start gap-4 border-b border-black/10 pb-6 mb-6">
            <span className="bg-[#171717] text-white font-mono text-xs px-2 py-1 rounded">02</span>
            <div>
              <h2 className="text-xl font-bold">Buat Pesan Penawaran</h2>
              <p className="text-xs text-black/60">Pilih penawaran cepat dan personalisasi pesan sebelum dikirim.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-2">Pilih Penawaran (Produk)</label>
                <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="w-full border border-black/15 p-3 text-sm bg-black/5 font-bold">
                  {products.map(p => <option key={p.slug} value={p.slug}>{p.name} - Rp {p.price.toLocaleString('id-ID')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">Nama calon pelanggan / bisnis</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full border border-black/15 p-3 text-sm" placeholder="Kopi Sudut Kota" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">Hasil utama yang mereka butuhkan</label>
                <input type="text" value={clientNeed} onChange={e => setClientNeed(e.target.value)} className="w-full border border-black/15 p-3 text-sm" placeholder="mendapat lebih banyak pelanggan dari WhatsApp" />
              </div>
            </div>
            
            <div className="flex flex-col h-full">
              <label className="block text-xs font-bold mb-2">Draft Pesan WhatsApp</label>
              <textarea readOnly value={generateMessage()} className="w-full flex-1 border border-black/15 p-4 text-xs font-mono bg-amber-50/50 mb-4 rounded" />
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(generateMessage()); alert('Disalin!') }} className="flex-1 bg-white border border-black/20 text-xs font-bold py-3 hover:bg-black/5">
                  Salin Pesan
                </button>
                <a href={waLink} target="_blank" className="flex-1 bg-green-600 text-white text-center text-xs font-bold py-3 hover:bg-green-700">
                  Buka WhatsApp ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Outreach CRM Form */}
        <div className="bg-white p-8 border border-black/10 rounded-xl shadow-sm">
          <div className="flex items-start gap-4 border-b border-black/10 pb-6 mb-6">
            <span className="bg-[#171717] text-white font-mono text-xs px-2 py-1 rounded">03</span>
            <div>
              <h2 className="text-xl font-bold">Pengumpulan Data & Outreach</h2>
              <p className="text-xs text-black/60">Simpan informasi bisnis, masalah, dan jadwal tindak lanjut ke dalam sistem.</p>
            </div>
          </div>
          
          <form onSubmit={saveLead} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-2">Nama Bisnis</label>
              <input required type="text" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className="w-full border border-black/15 p-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2">WhatsApp / Kontak</label>
              <input required type="text" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} className="w-full border border-black/15 p-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2">Sumber Lead</label>
              <select value={leadForm.source} onChange={e => setLeadForm({...leadForm, source: e.target.value})} className="w-full border border-black/15 p-3 text-sm bg-white">
                <option>Google Maps</option><option>Instagram</option><option>TikTok</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2">Masalah yang Terlihat</label>
              <select value={leadForm.problem} onChange={e => setLeadForm({...leadForm, problem: e.target.value})} className="w-full border border-black/15 p-3 text-sm bg-white">
                <option>Belum memiliki website</option>
                <option>Website lama atau rusak</option>
                <option>Konten media sosial kurang aktif</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-[#171717] text-[#f3f0ea] font-bold text-xs py-3 hover:bg-[#b36f43]">
                + Simpan Prospek ke CRM
              </button>
            </div>
          </form>

          {leads.length > 0 && (
            <div className="mt-8 border-t border-black/10 pt-6">
              <h3 className="font-bold text-sm mb-4">Daftar Prospek Sesi Ini ({leads.length})</h3>
              <div className="space-y-3">
                {leads.map(l => (
                  <div key={l.id} className="p-3 border border-black/10 bg-black/5 flex justify-between items-center text-xs">
                    <div>
                      <b className="block">{l.name}</b>
                      <span className="text-black/50">{l.phone} • {l.source}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-[#b36f43]">{l.product}</span>
                      <a href={`https://wa.me/${l.phone.replace(/^0/, '62')}`} target="_blank" className="underline">Follow up ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Sidebar (Plan) */}
      <div className="space-y-8">
        <div className="bg-[#171717] text-[#f3f0ea] p-8 rounded-xl shadow-sm sticky top-8">
          <h2 className="text-xl font-bold mb-2">Rencana 6 Jam</h2>
          <p className="text-xs text-white/50 mb-8 border-b border-white/10 pb-6">Kecepatan datang dari fokus. Ikuti instruksi ini secara berurutan.</p>
          
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="text-[#b36f43] font-mono text-xs font-bold w-12 pt-0.5">30 mnt</div>
              <div>
                <b className="text-sm block">Pilih 1 jasa unggulan</b>
                <p className="text-xs text-white/60 mt-1">Jangan jual semuanya sekaligus. Fokus 1 produk.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="text-[#b36f43] font-mono text-xs font-bold w-12 pt-0.5">60 mnt</div>
              <div>
                <b className="text-sm block">Buat 1 contoh (Mockup)</b>
                <p className="text-xs text-white/60 mt-1">Gunakan calon bisnis nyata sebagai mockup desain.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="text-[#b36f43] font-mono text-xs font-bold w-12 pt-0.5">2 jam</div>
              <div>
                <b className="text-sm block">Hubungi 30 prospek</b>
                <p className="text-xs text-white/60 mt-1">Personal, singkat, dan gunakan fitur Pitch Generator.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="text-[#b36f43] font-mono text-xs font-bold w-12 pt-0.5">90 mnt</div>
              <div>
                <b className="text-sm block">Follow-up</b>
                <p className="text-xs text-white/60 mt-1">Tawarkan contoh gratis dan batas waktu.</p>
              </div>
            </li>
          </ol>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] text-white/40 uppercase tracking-widest text-center">Catatan Realistis</p>
            <p className="text-xs text-center text-white/60 mt-2">Target agresif membutuhkan eksekusi agresif. Jangan berbohong atau menjanjikan hasil palsu.</p>
          </div>
        </div>
      </div>
      
    </div>
  )
}
