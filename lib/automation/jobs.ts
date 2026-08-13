import { z } from 'zod'
import { createClient } from '../supabase/server'

export const automationJobSchema = z.object({ type: z.enum(['lead_acknowledgment','lead_assignment','content_publish','invoice_due_reminder','support_update','ai_assist']), payload: z.record(z.string(), z.unknown()).default({}), run_at: z.string().datetime().optional(), idempotency_key: z.string().min(3).optional() })

export async function enqueueAutomationJob(input: unknown) {
  const job = automationJobSchema.parse(input); const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error('Unauthenticated')
  const { data, error } = await supabase.from('automation_jobs').insert({ ...job, run_at: job.run_at || new Date().toISOString() }).select('id,type,status').single(); if (error) throw new Error(error.message); return data
}
