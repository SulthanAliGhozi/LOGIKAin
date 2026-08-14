'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { generateDynamicQris } from '../../../lib/qris'

export function CheckoutFlow({ product, qrisPayload }: { product: any, qrisPayload: string }) {
  const [step, setStep] = useState(1) // 1: Form, 2: Pay, 3: Success
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)

  const dynamicString = qrisPayload ? generateDynamicQris(qrisPayload, product.price) : ''

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate saving order to database
    setTimeout(() => {
      setLoading(false)
      setStep(2)
    }, 1000)
  }

  const confirmPayment = () => {
    setLoading(true)
    // Simulate notifying admin
    setTimeout(() => {
      setLoading(false)
      setStep(3)
    }, 1500)
  }

  if (step === 3) {
    return (
      <div className="bg-white p-8 border border-black/10 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-700 flex items-center justify-center rounded-full mx-auto mb-6 text-2xl">✓</div>
        <h2 className="text-2xl font-bold mb-2">Terima Kasih, {form.name}!</h2>
        <p className="text-sm text-black/60 mb-6">Pesanan Anda sedang diverifikasi oleh sistem kami. Akses produk akan dikirimkan ke email <b>{form.email}</b> dalam waktu maksimal 5 menit.</p>
        <a href="/store" className="text-[#b36f43] font-bold text-xs underline">← Kembali ke Store</a>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="bg-white p-8 border border-black/10">
        <h2 className="text-xl font-bold mb-2">Selesaikan Pembayaran</h2>
        <p className="text-xs text-black/60 mb-6">Scan kode QRIS di bawah ini menggunakan aplikasi M-Banking atau E-Wallet Anda.</p>
        
        <div className="flex flex-col items-center p-6 border border-black/5 bg-black/5 rounded-xl mb-6">
          {dynamicString ? (
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <QRCodeSVG value={dynamicString} size={220} level="M" />
            </div>
          ) : (
            <div className="w-[220px] h-[220px] bg-white flex items-center justify-center text-xs text-center p-4 border border-red-200 text-red-500">
              Admin belum mengatur QRIS Payload. Harap hubungi admin.
            </div>
          )}
          <p className="mt-6 font-mono text-3xl font-extrabold tracking-[-1px]">Rp {product.price.toLocaleString('id-ID')}</p>
          <p className="text-[10px] uppercase tracking-widest text-orange mt-2">Nominal sudah terisi otomatis</p>
        </div>

        <button 
          onClick={confirmPayment}
          disabled={loading || !dynamicString}
          className="w-full bg-[#171717] text-[#f3f0ea] font-bold text-xs py-4 hover:bg-[#b36f43] transition-colors disabled:opacity-50"
        >
          {loading ? 'Memverifikasi...' : 'Saya Sudah Transfer'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submitForm} className="bg-white p-8 border border-black/10 grid gap-5">
      <div>
        <label className="block text-xs font-bold mb-2">Nama Lengkap</label>
        <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-black/15 p-3 text-sm" placeholder="Budi Santoso" />
      </div>
      <div>
        <label className="block text-xs font-bold mb-2">Alamat Email</label>
        <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-black/15 p-3 text-sm" placeholder="budi@email.com" />
      </div>
      <div>
        <label className="block text-xs font-bold mb-2">Nomor WhatsApp</label>
        <input required type="text" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="w-full border border-black/15 p-3 text-sm" placeholder="08123456789" />
      </div>
      <div className="border-t border-black/10 pt-5 mt-2">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold">Total Pembayaran</span>
          <span className="font-mono text-xl font-extrabold">Rp {product.price.toLocaleString('id-ID')}</span>
        </div>
        <button disabled={loading} className="w-full bg-[#171717] text-[#f3f0ea] font-bold text-xs py-4 hover:bg-[#b36f43] transition-colors disabled:opacity-50">
          {loading ? 'Memproses...' : 'Lanjutkan Pembayaran ↗'}
        </button>
      </div>
    </form>
  )
}
