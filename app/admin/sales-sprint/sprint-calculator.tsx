'use client'

import { useState } from 'react'

export function SprintCalculator({ products }: { products: any[] }) {
  const [target, setTarget] = useState<number>(3000000)

  // Append a dummy B2B high-ticket product just for perspective
  const allProducts = [
    ...products,
    { name: 'Custom B2B Project', price: 15000000, slug: 'b2b' }
  ].sort((a, b) => b.price - a.price)

  return (
    <div className="bg-white border border-black/10 rounded-xl p-6 md:p-10 shadow-sm mt-6">
      
      <div className="mb-10 text-center">
        <h2 className="text-sm font-bold text-black/50 tracking-widest uppercase mb-4">Set Your Target</h2>
        <div className="flex justify-center items-center gap-4 text-4xl md:text-6xl font-extrabold tracking-[-2px] text-[#b36f43]">
          <span>Rp</span>
          <input 
            type="number" 
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="bg-transparent border-b-4 border-[#b36f43]/30 w-[200px] md:w-[350px] text-center focus:outline-none focus:border-[#b36f43]"
            step="1000000"
            min="100000"
          />
        </div>
        <p className="mt-4 text-xs text-black/60">Ubah angka di atas untuk melihat berapa closing yang dibutuhkan tim Sales.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProducts.map(p => {
          const qty = Math.ceil(target / p.price)
          const actualRevenue = qty * p.price
          
          return (
            <div key={p.slug} className="p-6 border border-black/10 bg-black/5 rounded-xl hover:bg-white transition-colors relative overflow-hidden">
              <div className="text-xs font-bold text-black/40 mb-1">{p.name}</div>
              <div className="font-mono text-sm font-bold mb-4">Rp {p.price.toLocaleString('id-ID')}</div>
              
              <div className="mt-6 border-t border-black/10 pt-4 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-1">Target Closing</div>
                  <div className="text-3xl font-extrabold text-[#171717]">{qty} <span className="text-sm font-medium">Sales</span></div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                Estimasi: Rp {actualRevenue.toLocaleString('id-ID')}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-10 p-6 bg-[#171717] text-[#f3f0ea] rounded-xl text-center">
        <h3 className="font-bold mb-2">🔥 The Sprint Challenge</h3>
        <p className="text-sm text-white/60 mb-6">Pilih salah satu produk di atas sebagai fokus utama Anda dalam sprint 7 hari ke depan.</p>
        <button onClick={() => alert('Sprint dimulai! Waktunya menghubungi Leads.')} className="bg-[#b36f43] px-6 py-3 text-xs font-bold text-white hover:bg-orange-600 transition-colors rounded-full">
          Mulai Sprint Sekarang
        </button>
      </div>

    </div>
  )
}
