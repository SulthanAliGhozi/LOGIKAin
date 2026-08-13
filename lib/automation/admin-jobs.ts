import { z } from 'zod'
import { createAdminClient } from '../supabase/admin'

const jobSchema = z.object({ type: z.string(), payload: z.record(z.string(), z.unknown()).default({}), run_at: z.string().datetime().optional(), idempotency_key: z.string().min(3).optional() })

export async function enqueueAutomationJobAdmin(input: unknown) {
  const job = jobSchema.parse(input)
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('automation_jobs').insert({ ...job, run_at: job.run_at || new Date().toISOString() }).select('id,type,status').single()
  if (error) throw new Error(error.message)
  return data
}
