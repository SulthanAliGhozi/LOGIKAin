import { createClient } from '../../../lib/supabase/server'
import { QrisUploader } from '../settings/qris-uploader'

export default async function PaymentQrisPage() { 
  const supabase = await createClient(); 
  const { data, error } = await supabase.from('site_settings').select('key,value').eq('key', 'payment_qris_payload').single(); 

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">COMMERCE</span>
      </div>
      
      <div className="mt-8 mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Payment Configuration</h1>
          <p className="mt-2 text-sm text-black/50">Konfigurasi mesin pembayaran otomatis (QRIS).</p>
        </div>
      </div>

      <div className="max-w-md">
        <QrisUploader initialPayload={data?.value || ''} />
      </div>
    </main>
  )
}
