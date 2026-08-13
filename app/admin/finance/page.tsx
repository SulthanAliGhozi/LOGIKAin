import { AdminTableModule } from '../../components/admin-module'
import { FinanceForm } from '../../components/finance-forms'
export default function FinanceAdminPage() { return <><AdminTableModule title="Invoices" eyebrow="FINANCE" table="invoices" columns={['invoice_number','client_id','status','total_minor','due_at']} /><div className="grid gap-3 px-6 pb-10 md:grid-cols-3 md:px-10"><FinanceForm type="quote" /><FinanceForm type="invoice" /><FinanceForm type="payment" /></div></> }
