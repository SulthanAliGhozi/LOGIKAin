'use client'

import { useState } from 'react'
import { SprintCalculator } from './sprint-calculator'

type Tab = 'calculator' | 'pitch' | 'market' | 'outreach'

export function SalesToolkit({ products }: { products: any[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('calculator')
  
  // Pitch Generator State
  const [clientName, setClientName] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.slug || '')
  
  const generatePitch = () => {
    const p = products.find(x => x.slug === selectedProduct)
    if (!p) return ''
    return `Halo admin ${clientName ? '*' + clientName + '*' : 'bisnis'}, salam kenal!\n\nSaya melihat bisnis Anda punya potensi besar untuk berkembang lebih jauh.\nDi LOGIKAin, kami memiliki paket *${p.name}* yang dirancang khusus untuk meningkatkan omset bisnis seperti milik Anda.\n\nHanya dengan *Rp ${p.price.toLocaleString('id-ID')}*, Anda sudah mendapatkan:\n${p.desc}\n\nApakah Anda ada waktu 5 menit besok untuk ngobrol santai mengenai hal ini?`
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-black/10 mb-8">
        {[
          { id: 'calculator', label: '🎯 Target Calculator' },
          { id: 'pitch', label: '📝 Pitch Generator' },
          { id: 'market', label: '🔍 Market Finder' },
          { id: 'outreach', label: '🚀 Outreach Tracker' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-4 transition-colors ${activeTab === tab.id ? 'border-[#b36f43] text-[#b36f43]' : 'border-transparent text-black/50 hover:text-black/80 hover:border-black/10'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'calculator' && (
        <SprintCalculator products={products} />
      )}

      {activeTab === 'pitch' && (
        <div className="grid md:grid-cols-2 gap-8 bg-white p-8 border border-black/10 rounded-xl">
          <div>
            <h2 className="text-xl font-bold mb-4">Penawaran Cepat (WhatsApp)</h2>
            <p className="text-xs text-black/60 mb-6">Pilih produk dan masukkan nama bisnis klien untuk membuat draf pesan penawaran profesional secara otomatis.</p>
            
            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-bold mb-2">Nama Bisnis Klien</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Klinik Sejahtera" className="w-full border border-black/15 p-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2">Pilih Produk</label>
                <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="w-full border border-black/15 p-3 text-sm bg-transparent">
                  {products.map(p => <option key={p.slug} value={p.slug}>{p.name} - Rp {p.price.toLocaleString('id-ID')}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-2">Hasil Draf Pesan</label>
            <textarea readOnly value={generatePitch()} rows={10} className="w-full border border-black/15 p-4 text-sm bg-black/5 font-mono" />
            <button onClick={() => { navigator.clipboard.writeText(generatePitch()); alert('Draf disalin!') }} className="w-full mt-4 bg-[#171717] text-[#f3f0ea] font-bold text-xs py-3 hover:bg-[#b36f43]">
              Copy Pesan
            </button>
          </div>
        </div>
      )}

      {activeTab === 'market' && (
        <div className="bg-white p-8 border border-black/10 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Market Finder Strategy</h2>
          <p className="text-xs text-black/60 mb-6">Cara menemukan ratusan prospek tertarget dalam 10 menit menggunakan teknik pencarian rahasia.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 border border-black/10 bg-[#f3f0ea]">
              <h3 className="font-bold text-sm mb-2">📍 Google Maps Scrape</h3>
              <p className="text-xs text-black/60">Ketik <b>"Klinik Gigi terdekat di Jakarta Selatan"</b>. Filter yang ratingnya di bawah 4.0 atau yang belum punya link website. Tawarkan produk Website UMKM ke nomor telepon yang tertera.</p>
            </div>
            <div className="p-5 border border-black/10 bg-[#f3f0ea]">
              <h3 className="font-bold text-sm mb-2">📸 Instagram Hashtag</h3>
              <p className="text-xs text-black/60">Cari <b>#BisnisKulinerSurabaya</b>. Cari akun restoran yang desain feed-nya masih berantakan. DM mereka dan tawarkan Paket Desain Sosmed kita.</p>
            </div>
            <div className="p-5 border border-black/10 bg-[#f3f0ea]">
              <h3 className="font-bold text-sm mb-2">🏢 LinkedIn Outreach</h3>
              <p className="text-xs text-black/60">Cari posisi <b>"Marketing Manager"</b> atau <b>"Founder"</b> di perusahaan menengah. Tawarkan solusi Custom B2B Project atau Retainer SEO LOGIKAin.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'outreach' && (
        <div className="bg-white p-8 border border-black/10 rounded-xl flex flex-col items-center justify-center text-center py-20">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-xl font-bold mb-2">Pengumpulan Data & Outreach</h2>
          <p className="text-xs text-black/60 max-w-md mb-6">Database prospek dan *leads* Anda kini sudah terintegrasi secara otomatis dengan CRM utama LOGIKAin.</p>
          <a href="/admin/leads" className="bg-[#171717] text-[#f3f0ea] px-6 py-3 text-xs font-bold hover:bg-[#b36f43]">
            Buka CRM Leads Master →
          </a>
        </div>
      )}
    </div>
  )
}
