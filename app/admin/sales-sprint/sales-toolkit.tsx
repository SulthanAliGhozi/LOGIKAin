'use client'

import { useState, useEffect } from 'react'
import { SprintCalculator } from './sprint-calculator'
import { Responsive, WidthProvider } from 'react-grid-layout'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

type Product = { name: string, price: number, slug: string, desc: string }

export function SalesToolkit({ products }: { products: Product[] }) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  // 3. Lead Collection
  const [leads, setLeads] = useState<any[]>([])
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', source: 'Google Maps', problem: 'Belum memiliki website', followUp: '' })
  const saveLead = (e: React.FormEvent) => {
    e.preventDefault()
    setLeads([...leads, { ...leadForm, product: selectedP?.name, price: selectedP?.price, id: Date.now() }])
    setLeadForm({ ...leadForm, name: '', phone: '' })
    alert('Prospek berhasil ditambahkan ke CRM lokal!')
  }

  // Layout Configuration
  const defaultLayouts = {
    lg: [
      { i: 'calculator', x: 0, y: 0, w: 8, h: 5 },
      { i: 'plan', x: 8, y: 0, w: 4, h: 10 },
      { i: 'market', x: 0, y: 5, w: 4, h: 5 },
      { i: 'crm', x: 4, y: 5, w: 4, h: 5 },
      { i: 'pitch', x: 0, y: 10, w: 8, h: 6 },
    ]
  }

  if (!isMounted) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-64 bg-black/10 rounded"></div></div></div>

  return (
    <div className="-mx-4 sm:mx-0">
      <div className="mb-4 flex justify-between items-center text-xs text-black/50">
        <p>💡 Tip: Anda bisa menarik ujung kanan bawah panel untuk mengubah ukuran (resize), atau menahan *header* panel untuk menggeser letaknya (drag & drop).</p>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={defaultLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80}
        draggableHandle=".drag-handle"
        margin={[20, 20]}
      >
        
        {/* 1. Target Calculator */}
        <div key="calculator" className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="drag-handle bg-[#171717] text-white px-4 py-2 cursor-move flex items-center gap-2 select-none">
            <span className="font-mono text-xs opacity-50">01</span> <b className="text-xs tracking-widest uppercase">Target Calculator</b>
          </div>
          <div className="p-4 flex-1 overflow-auto">
            <SprintCalculator products={products} />
          </div>
        </div>

        {/* 2. Market Finder */}
        <div key="market" className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="drag-handle bg-[#171717] text-white px-4 py-2 cursor-move flex items-center gap-2 select-none">
            <span className="font-mono text-xs opacity-50">02</span> <b className="text-xs tracking-widest uppercase">Market Finder</b>
          </div>
          <div className="p-4 flex-1 overflow-auto">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} className="border border-black/15 p-2 text-xs" placeholder="Jenis Usaha" />
              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="border border-black/15 p-2 text-xs" placeholder="Kota" />
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {['kafe', 'salon', 'barbershop', 'laundry', 'bengkel'].map(k => (
                <button key={k} onClick={() => setIndustry(k)} className="px-2 py-0.5 bg-black/5 hover:bg-black/10 rounded text-[10px] font-medium">{k}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`} target="_blank" className="p-2 border border-black/10 hover:border-[#b36f43] rounded bg-[#f3f0ea]"><b className="text-xs block">Google Maps ↗</b></a>
              <a href={`https://www.google.com/search?q=site:instagram.com+${encodeURIComponent(searchQuery)}`} target="_blank" className="p-2 border border-black/10 hover:border-[#b36f43] rounded bg-[#f3f0ea]"><b className="text-xs block">Instagram ↗</b></a>
              <a href={`https://www.tiktok.com/search?q=${encodeURIComponent(searchQuery)}`} target="_blank" className="p-2 border border-black/10 hover:border-[#b36f43] rounded bg-[#f3f0ea]"><b className="text-xs block">TikTok ↗</b></a>
              <a href={`https://projects.co.id/public/browse_projects/listing?search=${encodeURIComponent(industry)}`} target="_blank" className="p-2 border border-black/10 hover:border-[#b36f43] rounded bg-[#f3f0ea]"><b className="text-xs block">Projects.co.id ↗</b></a>
            </div>
          </div>
        </div>

        {/* 3. CRM Lead Collector */}
        <div key="crm" className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="drag-handle bg-[#171717] text-white px-4 py-2 cursor-move flex items-center gap-2 select-none">
            <span className="font-mono text-xs opacity-50">03</span> <b className="text-xs tracking-widest uppercase">Outreach CRM</b>
          </div>
          <div className="p-4 flex-1 overflow-auto">
            <form onSubmit={saveLead} className="grid gap-2">
              <input required type="text" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} className="border border-black/15 p-2 text-xs" placeholder="Nama Bisnis" />
              <input required type="text" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} className="border border-black/15 p-2 text-xs" placeholder="WhatsApp" />
              <select value={leadForm.source} onChange={e => setLeadForm({...leadForm, source: e.target.value})} className="border border-black/15 p-2 text-xs bg-white">
                <option>Google Maps</option><option>Instagram</option>
              </select>
              <button type="submit" className="bg-[#171717] text-[#f3f0ea] font-bold text-xs py-2 mt-2 hover:bg-[#b36f43]">+ Simpan</button>
            </form>
            {leads.length > 0 && (
              <div className="mt-4 pt-4 border-t border-black/10 space-y-2">
                {leads.map(l => (
                  <div key={l.id} className="p-2 border border-black/10 bg-black/5 text-[10px] flex justify-between">
                    <b>{l.name}</b> <a href={`https://wa.me/${l.phone.replace(/^0/, '62')}`} target="_blank" className="text-[#b36f43] underline">WA ↗</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Pitch Generator */}
        <div key="pitch" className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="drag-handle bg-[#171717] text-white px-4 py-2 cursor-move flex items-center gap-2 select-none">
            <span className="font-mono text-xs opacity-50">04</span> <b className="text-xs tracking-widest uppercase">Pitch Generator</b>
          </div>
          <div className="p-4 flex-1 overflow-auto flex flex-col lg:flex-row gap-6">
            <div className="space-y-3 flex-1">
              <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="w-full border border-black/15 p-2 text-xs bg-black/5 font-bold">
                {products.map(p => <option key={p.slug} value={p.slug}>{p.name} - Rp {p.price.toLocaleString('id-ID')}</option>)}
              </select>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full border border-black/15 p-2 text-xs" placeholder="Kopi Sudut Kota" />
              <input type="text" value={clientNeed} onChange={e => setClientNeed(e.target.value)} className="w-full border border-black/15 p-2 text-xs" placeholder="mendapat lebih banyak pelanggan" />
            </div>
            <div className="flex-1 flex flex-col h-full">
              <textarea readOnly value={generateMessage()} className="w-full flex-1 border border-black/15 p-3 text-[10px] font-mono bg-amber-50/50 rounded resize-none" />
              <div className="flex gap-2 mt-2">
                <button onClick={() => { navigator.clipboard.writeText(generateMessage()); alert('Disalin!') }} className="flex-1 bg-white border border-black/20 text-[10px] font-bold py-2 hover:bg-black/5">Salin</button>
                <a href={waLink} target="_blank" className="flex-1 bg-green-600 text-white text-center text-[10px] font-bold py-2 hover:bg-green-700">Buka WA ↗</a>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 6-Hour Plan Sidebar */}
        <div key="plan" className="bg-[#171717] text-[#f3f0ea] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="drag-handle bg-black/40 text-white px-4 py-2 cursor-move flex items-center gap-2 select-none">
            <span className="font-mono text-xs opacity-50">05</span> <b className="text-xs tracking-widest uppercase">Action Plan</b>
          </div>
          <div className="p-4 lg:p-6 flex-1 overflow-auto">
            <ol className="space-y-4">
              <li className="flex gap-3"><div className="text-[#b36f43] font-mono text-[10px] font-bold w-10">30m</div><div><b className="text-xs block">Pilih 1 jasa unggulan</b><p className="text-[10px] text-white/50">Fokus 1 produk.</p></div></li>
              <li className="flex gap-3"><div className="text-[#b36f43] font-mono text-[10px] font-bold w-10">1h</div><div><b className="text-xs block">Buat Mockup</b><p className="text-[10px] text-white/50">Buat contoh nyata.</p></div></li>
              <li className="flex gap-3"><div className="text-[#b36f43] font-mono text-[10px] font-bold w-10">2h</div><div><b className="text-xs block">Hubungi 30 prospek</b><p className="text-[10px] text-white/50">Personal outreach.</p></div></li>
              <li className="flex gap-3"><div className="text-[#b36f43] font-mono text-[10px] font-bold w-10">1.5h</div><div><b className="text-xs block">Follow-up</b><p className="text-[10px] text-white/50">Beri batas waktu.</p></div></li>
            </ol>
            <div className="mt-6 pt-4 border-t border-white/10 text-center"><p className="text-[9px] text-white/60">Eksekusi agresif, tanpa alasan.</p></div>
          </div>
        </div>

      </ResponsiveGridLayout>
    </div>
  )
}
