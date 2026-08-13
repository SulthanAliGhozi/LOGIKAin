import { portalScope, PortalShell } from '../_lib'
import { PortalQuotationActions } from '../../components/portal-quotation-actions'

export const metadata = { robots: { index: false, follow: false } }

export default async function PortalQuotationsPage() {
  const { supabase, clientIds } = await portalScope()
  const { data } = clientIds.length ? await supabase.from('quotes').select('id,quote_number,status,total_minor,currency,valid_until').in('client_id', clientIds).order('created_at', { ascending: false }) : { data: [] as never[] }
  return <PortalShell><section className="grid gap-4 p-6 md:grid-cols-2 md:p-10">{data?.length ? data.map((quote) => <article key={quote.id} className="border border-black/10 bg-white/50 p-5"><h2 className="font-bold">{quote.quote_number}</h2><p className="mt-2 text-sm capitalize text-[#b36f43]">{quote.status}</p><p className="mt-4 text-lg font-bold">{quote.currency} {Number(quote.total_minor).toLocaleString('id-ID')}</p>{quote.valid_until && <p className="mt-2 text-xs text-black/50">Valid until {quote.valid_until}</p>}<PortalQuotationActions quoteId={quote.id} status={quote.status} /></article>) : <p className="border border-black/10 bg-white/50 p-6 text-sm text-black/55">No quotations available.</p>}</section></PortalShell>
}
