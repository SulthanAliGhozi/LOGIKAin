import { z } from 'zod'
import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { getAiProvider } from '../../../../lib/providers/ai'

const requestSchema = z.object({ task: z.enum(['lead_qualification', 'seo_metadata', 'project_summary', 'support_draft']), context: z.string().min(1).max(20000) })

export async function POST(request: Request) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role,status').eq('id', user.id).maybeSingle(); if (!profile || profile.status !== 'active' || !['editor', 'project_member', 'support', 'admin', 'owner'].includes(profile.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const parsed = requestSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  try { const result = await getAiProvider().complete(parsed.data); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'ai_assist', action: 'completed', metadata: { task: parsed.data.task, provider: result.provider, model: result.model || null } }); return NextResponse.json(result) } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'AI provider unavailable' }, { status: 503 }) }
}
