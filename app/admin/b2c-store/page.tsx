import { createClient } from '../../../lib/supabase/server'
import { StoreCatalogManager } from './store-catalog-manager'

export default async function B2CStoreAdminPage() {
  const supabase = await createClient()
  
  const { data: setting } = await supabase.from('site_settings').select('value').eq('key', 'b2c_store_catalog').single()
  const initialProducts = setting?.value ? (typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value) : []

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">COMMERCE</span>
      </div>
      
      <div className="mt-8 mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">B2C Products</h1>
        <p className="mt-2 text-sm text-black/50 max-w-2xl">
          Kelola katalog produk eceran Anda (seperti E-book, Template, atau Paket Instan). Produk di sini akan langsung tampil di halaman /store publik dan terhubung dengan sistem Checkout otomatis QRIS.
        </p>
      </div>

      <StoreCatalogManager initialProducts={initialProducts} />

    </main>
  )
}
