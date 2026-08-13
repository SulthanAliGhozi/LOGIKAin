'use server'

import { z } from 'zod'
import { createClient } from '../../lib/supabase/server'
import { createAdminClient } from '../../lib/supabase/admin'
import { enqueueAutomationJobAdmin } from '../../lib/automation/admin-jobs'

const contactSchema = z.object({ name: z.string().min(2, 'Nama minimal 2 karakter.'), email: z.string().email('Masukkan email yang valid.'), company: z.string().max(160).optional(), phone: z.string().max(40).optional(), service: z.string().max(100).optional(), budget: z.string().max(100).optional(), timeline: z.string().max(100).optional(), message: z.string().min(10, 'Ceritakan kebutuhan Anda minimal 10 karakter.'), website: z.string().max(0).optional() })

export type ContactState = { ok: boolean; message: string }

export async function sendContact(_: ContactState, formData: FormData): Promise<ContactState> {
  const result = contactSchema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { ok: false, message: result.error.issues[0]?.message || 'Periksa kembali data Anda.' }
  if (result.data.website) return { ok: true, message: 'Terima kasih. Kami akan menghubungi Anda segera.' }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return { ok: false, message: 'Konfigurasi database belum tersedia.' }
  const supabase = await createClient()
  const brief = [result.data.service && `Service: ${result.data.service}`, result.data.budget && `Budget: ${result.data.budget}`, result.data.timeline && `Timeline: ${result.data.timeline}`, result.data.message].filter(Boolean).join('\n\n')
  const { error } = await supabase.from('leads').insert({ name: result.data.name, email: result.data.email, company: result.data.company || null, phone: result.data.phone || null, brief, source: result.data.service || 'website' })
  if (error) return { ok: false, message: 'Pesan belum tersimpan. Silakan coba lagi.' }
  try { if (process.env.SUPABASE_SERVICE_ROLE_KEY) { const { data: lead } = await createAdminClient().from('leads').select('id').eq('email', result.data.email).eq('name', result.data.name).order('created_at', { ascending: false }).limit(1).maybeSingle(); if (lead) await enqueueAutomationJobAdmin({ type: 'lead_acknowledgment', payload: { lead_id: lead.id }, idempotency_key: `lead-ack:${lead.id}` }) } } catch { /* Lead storage should not fail because automation is unavailable. */ }
  return { ok: true, message: 'Terima kasih. Kami akan menghubungi Anda segera.' }
}
