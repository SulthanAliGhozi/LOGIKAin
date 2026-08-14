'use client'

import { useState, useTransition, useRef } from 'react'
import jsQR from 'jsqr'
import { updateSiteSetting } from '../../actions/admin'

export function QrisUploader({ initialPayload }: { initialPayload: string }) {
  const [payload, setPayload] = useState(initialPayload)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        
        if (code) {
          setPayload(code.data)
          setMessage('QRIS Payload berhasil diekstrak! Silakan Save.')
        } else {
          setMessage('Gagal membaca gambar QR. Pastikan gambar jelas dan berisi QR Code valid.')
        }
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const save = () => {
    startTransition(async () => {
      try {
        await updateSiteSetting('payment_qris_payload', `"${payload}"`)
        setMessage('QRIS Payload berhasil disimpan!')
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Save failed.')
      }
    })
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm col-span-full">
      <div className="mb-4">
        <h3 className="font-mono text-sm font-bold text-black/70">Payment: Dynamic QRIS Generator</h3>
        <p className="text-xs text-black/50 mt-1">Upload gambar QRIS statis toko Anda. Sistem otomatis mengekstrak payload-nya menjadi dinamis untuk kustomer.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold mb-2">1. Upload Gambar QRIS</label>
          <input 
            type="file" 
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="block w-full text-sm text-black/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange file:text-white hover:file:bg-[#b36f43] cursor-pointer"
          />
          {message && <p className="mt-3 text-xs font-bold text-[#b36f43]">{message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold mb-2">2. Extracted Payload String</label>
          <textarea 
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            rows={4}
            placeholder="000201010211..."
            className="w-full border border-black/15 bg-transparent p-3 text-xs font-mono"
          />
          <button 
            onClick={save}
            disabled={pending || !payload}
            className="mt-3 bg-[#171717] px-5 py-3 text-xs font-bold text-[#f3f0ea] hover:bg-black disabled:opacity-50"
          >
            {pending ? 'Menyimpan...' : 'Save QRIS Payload'}
          </button>
        </div>
      </div>
    </div>
  )
}
