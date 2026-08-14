import { notFound } from 'next/navigation'
import { PrintButton } from '../../../components/print-button'
import { portalScope, PortalShell } from '../../_lib'
import { QrisPayment } from './qris-payment'

export const metadata = { robots: { index: false, follow: false } }

export default async function InvoiceDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const { supabase } = await portalScope(); const { data: invoice } = await supabase.from('invoices').select('*,clients(name,email),business_projects(name)').eq('id', id).single(); if (!invoice) notFound(); const { data: snapshot } = await supabase.from('invoice_snapshots').select('version,snapshot,created_at').eq('invoice_id', id).order('version', { ascending: false }).limit(1).maybeSingle(); const document = (snapshot?.snapshot as unknown as typeof invoice | null) || invoice
  const { data: setting } = await supabase.from('site_settings').select('value').eq('key', 'payment_qris_payload').single()
  const qrisPayload = setting?.value ? JSON.parse(setting.value) : ''

  return <PortalShell><section className="bg-white px-6 py-6 text-[#171717] md:px-10 print:p-0"><div className="mx-auto max-w-3xl"><a href="/portal/invoices" className="text-xs text-black/50 hover:text-[#b36f43] print:hidden">← Kembali ke invoices</a><div className="mt-5 border border-black/10 p-8 print:border-0"><div className="flex items-start justify-between border-b border-black/10 pb-8"><div><p className="text-2xl font-extrabold tracking-[-1.5px]">LOGIKA<span className="text-[#b36f43]">in</span></p><p className="mt-2 text-xs text-black/50">Think Clearly. Build Logically.</p></div><div className="text-right"><p className="text-xs uppercase tracking-widest text-black/50">Invoice</p><p className="mt-2 text-2xl font-bold">{document.invoice_number}</p><p className="mt-1 text-xs capitalize text-[#b36f43]">{document.status}</p></div></div><div className="grid gap-8 py-8 text-sm sm:grid-cols-2"><div><p className="text-xs uppercase tracking-widest text-black/40">Bill to</p><p className="mt-3 font-bold">{invoice.clients?.name || 'Client'}</p><p className="mt-1 text-black/55">{invoice.clients?.email || ''}</p></div><div className="sm:text-right"><p className="text-xs uppercase tracking-widest text-black/40">Payment due</p><p className="mt-3 font-bold">{document.due_at || 'On request'}</p><p className="mt-1 text-black/55">Project: {invoice.business_projects?.name || 'General services'}</p></div></div><div className="border-y border-black/10 py-6"><div className="flex justify-between text-sm"><span>Professional services</span><b>{document.currency} {Number(document.total_minor).toLocaleString('id-ID')}</b></div></div><div className="flex justify-between py-8 text-lg font-bold"><span>Total</span><span>{document.currency} {Number(document.total_minor).toLocaleString('id-ID')}</span></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-5 text-xs text-black/45"><span>Immutable snapshot: v{snapshot?.version || 'not issued'} · {snapshot?.created_at || 'Draft document'}</span><span className="flex gap-3"><a href={`/api/invoices/${id}/pdf`} className="text-[#b36f43] print:hidden">Download PDF</a><PrintButton /></span></div></div>
  
  {document.status !== 'paid' && qrisPayload && (
    <QrisPayment payload={qrisPayload} amount={Number(document.total_minor)} invoiceId={id} />
  )}
  
  </div></section></PortalShell>
}
