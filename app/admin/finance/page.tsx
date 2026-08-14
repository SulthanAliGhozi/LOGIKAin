import { createClient } from '../../../lib/supabase/server'
import { FinanceList } from '../../components/finance-forms'
import Link from 'next/link'

export default async function FinanceAdminPage() {
  const supabase = await createClient()
  const { data: invoicesData } = await supabase.from('invoices').select('*').order('created_at', { ascending: false }).limit(50)
  const { data: quotesData } = await supabase.from('quotes').select('*').order('created_at', { ascending: false }).limit(50)
  
  const invoices = invoicesData || []
  const quotes = quotesData || []

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <Link href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</Link>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">FINANCE</span>
      </div>
      
      <div className="mt-8 mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Financial Hub</h1>
          <p className="mt-2 text-sm text-black/50">Manage quotes, invoices, and payment tracking all in one place.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <Link href="/admin/quotations/new" className="inline-flex items-center justify-center bg-[#171717] px-6 py-3 text-sm font-bold text-[#f3f0ea] hover:bg-black/80 transition-colors rounded-lg shadow-sm">
          + New Quotation
        </Link>
        <Link href="/admin/invoices/new" className="inline-flex items-center justify-center bg-[#171717] px-6 py-3 text-sm font-bold text-[#f3f0ea] hover:bg-black/80 transition-colors rounded-lg shadow-sm">
          + New Invoice
        </Link>
        <Link href="/admin/finance/payments/new" className="inline-flex items-center justify-center bg-white border border-black/10 px-6 py-3 text-sm font-bold text-black/70 hover:text-black transition-colors rounded-lg shadow-sm">
          Record Payment
        </Link>
      </div>
      <div className="space-y-10">
        <div>
          <h2 className="mb-4 text-xl font-bold tracking-tight">Invoices</h2>
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="p-2">
              <FinanceList type="invoice" data={invoices} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold tracking-tight">Quotations</h2>
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="p-2">
              <FinanceList type="quote" data={quotes} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
