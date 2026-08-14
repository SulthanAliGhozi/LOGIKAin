import { AdminTableModule } from '../../components/admin-module'
import { FinanceForm } from '../../components/finance-forms'

export default function FinanceAdminPage() {
  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
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

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-black/50">New Quote</h3>
          <FinanceForm type="quote" />
        </div>
        <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-black/50">New Invoice</h3>
          <FinanceForm type="invoice" />
        </div>
        <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-black/50">Record Payment</h3>
          <FinanceForm type="payment" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="p-2">
          <AdminTableModule 
            title="Invoices" 
            eyebrow="FINANCE" 
            table="invoices" 
            columns={['invoice_number','client_id','status','total_minor','due_at']} 
          />
        </div>
      </div>
    </main>
  )
}
