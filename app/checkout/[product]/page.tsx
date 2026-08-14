import { notFound } from 'next/navigation'
import { Nav, Wordmark } from '../../components/nav'
import { Footer } from '../../components/footer'
import { createClient } from '../../../lib/supabase/server'
import { CheckoutFlow } from './checkout-flow'

export default async function CheckoutPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: slug } = await params
  const supabase = await createClient()

  const { data: catalogSetting } = await supabase.from('site_settings').select('value').eq('key', 'b2c_store_catalog').single()
  const b2cProducts = catalogSetting?.value ? (typeof catalogSetting.value === 'string' ? JSON.parse(catalogSetting.value) : catalogSetting.value) : []
  
  const product = b2cProducts.find((p: any) => p.slug === slug)
  if (!product) notFound()

  const { data: setting } = await supabase.from('site_settings').select('value').eq('key', 'payment_qris_payload').single()
  const qrisPayload = setting?.value ? JSON.parse(setting.value) : ''

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#f3f0ea] p-6 md:p-20 text-[#171717] flex justify-center">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10">
          
          {/* Order Summary */}
          <div>
            <p className="mono text-[10px] tracking-widest text-[#b36f43] mb-4">CHECKOUT</p>
            <h1 className="text-3xl font-extrabold tracking-[-1px] mb-6">Ringkasan Pesanan</h1>
            
            <div className="border border-black/10 bg-white/30 p-6">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-xs text-black/60 mt-2">{product.desc}</p>
              
              <div className="mt-8 pt-4 border-t border-black/10 flex justify-between items-center">
                <span className="text-xs font-bold text-black/50">Subtotal</span>
                <span className="font-mono font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs font-bold text-black/50">Biaya Admin (QRIS)</span>
                <span className="font-mono font-bold">Rp 0</span>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4 text-xs text-black/50">
              <span className="text-2xl">🔒</span>
              <p>Pembayaran diproses secara aman menggunakan sistem Dynamic QRIS standar nasional (EMVCo).</p>
            </div>
          </div>

          {/* Checkout Form & Payment */}
          <div>
            <CheckoutFlow product={product} qrisPayload={qrisPayload} />
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
