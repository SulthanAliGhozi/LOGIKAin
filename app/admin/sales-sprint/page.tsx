import { createClient } from '../../../lib/supabase/server'
import { SprintCalculator } from './sprint-calculator'

export default async function SalesSprintPage() {
  const supabase = await createClient()
  
  // Fetch B2C Catalog to be used in calculations
  const { data: setting } = await supabase.from('site_settings').select('value').eq('key', 'b2c_store_catalog').single()
  const products = setting?.value ? (typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value) : []

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">SALES SPRINT</span>
      </div>
      
      <div className="mt-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Sales Sprint Target</h1>
        <p className="mt-2 text-sm text-black/50 max-w-2xl">
          Alat hitung target (KPI) khusus tim Sales. Masukkan target omset bulanan atau mingguan, dan sistem akan memecahnya menjadi target harian per produk (B2B dan B2C).
        </p>
      </div>

      <SprintCalculator products={products} />

    </main>
  )
}
