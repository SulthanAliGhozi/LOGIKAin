import 'server-only'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '../supabase/admin'
import { getEmailProvider } from '../providers/email'

type Job = { type: string; payload: Record<string, unknown> }

export async function processAutomationJob(job: Job) {
  const supabase = createAdminClient()
  if (job.type === 'content_publish') {
    if (typeof job.payload.path === 'string') revalidatePath(job.payload.path)
    return
  }
  if (job.type === 'lead_acknowledgment') {
    const leadId = String(job.payload.lead_id || '')
    const { data: lead } = await supabase.from('leads').select('name,email').eq('id', leadId).single()
    if (!lead) throw new Error('Lead not found')
    await getEmailProvider().send({ to: lead.email, subject: 'Pesan Anda sudah kami terima — LOGIKAin', text: `Halo ${lead.name}, terima kasih telah menghubungi LOGIKAin. Tim kami akan meninjau kebutuhan Anda dan segera menghubungi Anda.` })
    return
  }
  if (job.type === 'invoice_due_reminder') {
    const invoiceId = String(job.payload.invoice_id || '')
    const { data: invoice } = await supabase.from('invoices').select('invoice_number,due_at,total_minor,currency,client_id').eq('id', invoiceId).single()
    if (!invoice) throw new Error('Invoice not found')
    const { data: contact } = await supabase.from('client_contacts').select('name,email').eq('client_id', invoice.client_id).eq('is_primary', true).maybeSingle()
    if (!contact) throw new Error('Primary client contact not found')
    await getEmailProvider().send({ to: contact.email, subject: `Pengingat invoice ${invoice.invoice_number} — LOGIKAin`, text: `Halo ${contact.name}, invoice ${invoice.invoice_number} jatuh tempo pada ${invoice.due_at || 'segera'}.` })
    return
  }
  if (job.type === 'support_update') {
    const ticketId = String(job.payload.ticket_id || '')
    const { data: ticket } = await supabase.from('support_tickets').select('reference,subject,client_id,status').eq('id', ticketId).single()
    if (!ticket) throw new Error('Support ticket not found')
    const { data: contact } = await supabase.from('client_contacts').select('name,email').eq('client_id', ticket.client_id).eq('is_primary', true).maybeSingle()
    if (!contact) throw new Error('Primary client contact not found')
    await getEmailProvider().send({ to: contact.email, subject: `Update support ${ticket.reference} — LOGIKAin`, text: `Halo ${contact.name}, tiket ${ticket.subject} sekarang berstatus ${ticket.status}.` })
    return
  }
  throw new Error(`Unsupported automation job: ${job.type}`)
}
