import { NextResponse } from 'next/server'
import { createAdminClient } from '../../../../lib/supabase/admin'
import { processAutomationJob } from '../../../../lib/automation/processor'

export async function POST(request: Request) {
  const expected = process.env.AUTOMATION_CRON_SECRET; const authorization = request.headers.get('authorization')
  if (!expected || authorization !== `Bearer ${expected}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient(); const { data: jobs, error } = await supabase.from('automation_jobs').select('*').eq('status', 'queued').lte('run_at', new Date().toISOString()).order('run_at').limit(10)
  if (error) return NextResponse.json({ error: 'Could not read jobs' }, { status: 500 })
  const results: { id: string; status: string }[] = []
  for (const job of jobs || []) {
    const claim = await supabase.from('automation_jobs').update({ status: 'running', attempts: job.attempts + 1 }).eq('id', job.id).eq('status', 'queued').select('id').maybeSingle(); if (!claim.data) continue
    try { await processAutomationJob({ type: job.type, payload: (job.payload || {}) as Record<string, unknown> }); await supabase.from('automation_jobs').update({ status: 'succeeded', finished_at: new Date().toISOString() }).eq('id', job.id); results.push({ id: job.id, status: 'succeeded' }) } catch (jobError) { await supabase.from('automation_jobs').update({ status: 'failed', last_error: jobError instanceof Error ? jobError.message : 'Unknown error', finished_at: new Date().toISOString() }).eq('id', job.id); results.push({ id: job.id, status: 'failed' }) }
  }
  return NextResponse.json({ processed: results.length, results })
}
