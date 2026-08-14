import { FinanceForm } from '../../../components/finance-forms'
import Link from 'next/link'

export default function NewInvoicePage() {
  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <Link href="/admin/finance" className="hover:text-[#b36f43] transition-colors">← Back</Link>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">NEW INVOICE</span>
      </div>
      
      <div className="mt-8 mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight">Create Invoice</h1>
        <p className="mt-2 text-sm text-black/50">Draft a new invoice for an existing project or client.</p>
      </div>

      <div className="max-w-2xl bg-white p-6 rounded-xl border border-black/10 shadow-sm">
        <FinanceForm type="invoice" />
      </div>
    </main>
  )
}
