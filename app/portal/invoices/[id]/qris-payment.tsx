'use client'

import { QRCodeSVG } from 'qrcode.react'
import { generateDynamicQris } from '../../../../lib/qris'
import { useState } from 'react'

export function QrisPayment({ payload, amount, invoiceId }: { payload: string, amount: number, invoiceId: string }) {
  const [showQr, setShowQr] = useState(false)
  
  if (!payload || amount <= 0) return null
  
  const dynamicString = generateDynamicQris(payload, amount)

  return (
    <div className="mt-8 border border-black/10 bg-white/50 p-6 print:hidden">
      <div className="flex flex-col items-center justify-center text-center">
        <h4 className="text-sm font-bold text-black/70">Bayar Otomatis via QRIS</h4>
        <p className="mt-1 text-xs text-black/50">Buka aplikasi mobile banking (BCA, Mandiri) atau e-wallet (GoPay, OVO, Dana) Anda.</p>
        
        {!showQr ? (
          <button 
            onClick={() => setShowQr(true)}
            className="mt-4 bg-[#171717] px-6 py-3 text-xs font-bold text-[#f3f0ea] hover:bg-black transition-colors"
          >
            Tampilkan Kode QRIS
          </button>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <div className="bg-white p-4 border border-black/10 rounded-xl shadow-sm mb-4">
              <QRCodeSVG value={dynamicString} size={200} level="M" />
            </div>
            <p className="font-mono text-xl font-bold tracking-[-1px]">Rp {amount.toLocaleString('id-ID')}</p>
            <p className="text-[10px] uppercase tracking-widest text-orange mt-2">Nominal sudah terisi otomatis</p>
            
            <div className="mt-6 w-full border-t border-black/5 pt-6">
              <p className="text-xs text-black/60 mb-3">Setelah transfer berhasil, harap konfirmasi pembayaran.</p>
              <button 
                onClick={() => alert('Fitur upload bukti bayar akan segera hadir. Hubungi admin LOGIKAin untuk konfirmasi.')}
                className="w-full bg-[#171717] px-6 py-3 text-xs font-bold text-[#f3f0ea] hover:bg-black"
              >
                Konfirmasi & Upload Struk
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
