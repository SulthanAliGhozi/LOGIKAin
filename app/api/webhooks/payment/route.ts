import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../lib/supabase/admin'

export async function POST(request: Request) {
  const raw = await request.text(); const signature = request.headers.get('x-logikain-signature'); const secret = process.env.PAYMENT_WEBHOOK_SECRET
  if (!signature || !secret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  const payload = JSON.parse(raw) as { invoice_id: string; amount_minor: number; currency?: string; provider?: string; provider_reference: string; status?: string }
  const supabase = createAdminClient()
  const { data: existing } = await supabase.from('payments').select('id').eq('provider_reference', payload.provider_reference).maybeSingle()
  if (existing) return NextResponse.json({ ok: true, duplicate: true })
  const paymentStatus = payload.status === 'failed' ? 'failed' : 'succeeded'; const { error } = await supabase.from('payments').insert({ invoice_id: payload.invoice_id, amount_minor: payload.amount_minor, currency: payload.currency || 'IDR', provider: payload.provider || 'adapter', provider_reference: payload.provider_reference, status: paymentStatus, paid_at: paymentStatus === 'failed' ? null : new Date().toISOString() })
  if (error) return NextResponse.json({ error: 'Could not record payment' }, { status: 500 })
  if (paymentStatus === 'succeeded') { const { data: invoice } = await supabase.from('invoices').select('total_minor').eq('id', payload.invoice_id).single(); const { data: payments } = await supabase.from('payments').select('amount_minor').eq('invoice_id', payload.invoice_id).eq('status', 'succeeded'); const paid = (payments || []).reduce((sum, item) => sum + Number(item.amount_minor), 0); if (invoice) await supabase.from('invoices').update({ status: paid >= Number(invoice.total_minor) ? 'paid' : 'partially_paid' }).eq('id', payload.invoice_id) }
  return NextResponse.json({ ok: true })
}
