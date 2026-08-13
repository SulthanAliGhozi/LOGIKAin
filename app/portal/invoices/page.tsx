import { portalScope, PortalShell } from '../_lib'

export const metadata = { robots: { index: false, follow: false } }

export default async function PortalInvoicesPage() {
  const { supabase, clientIds } = await portalScope()
  const { data } = clientIds.length ? await supabase.from('invoices').select('id,invoice_number,status,total_minor,currency,due_at').in('client_id', clientIds).order('created_at', { ascending: false }) : { data: [] as never[] }
  return <PortalShell><section className="grid gap-4 p-6 md:grid-cols-2 md:p-10">{data?.length ? data.map((invoice) => <a href={`/portal/invoices/${invoice.id}`} key={invoice.id} className="border border-black/10 bg-white/50 p-5 hover:border-[#b36f43]"><p className="font-bold">{invoice.invoice_number}</p><p className="mt-2 text-xs capitalize text-[#b36f43]">{invoice.status}{invoice.due_at ? ` · due ${invoice.due_at}` : ''}</p><p className="mt-4 text-lg font-bold">{invoice.currency} {Number(invoice.total_minor).toLocaleString('id-ID')}</p></a>) : <p className="border border-black/10 bg-white/50 p-6 text-sm text-black/55">No invoices available.</p>}</section></PortalShell>
}
