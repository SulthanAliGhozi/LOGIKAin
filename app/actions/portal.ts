'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '../../lib/supabase/server'

async function memberContext() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error('Unauthenticated')
  const { data: memberships } = await supabase.from('client_memberships').select('client_id,portal_role').eq('user_id', user.id).eq('status', 'active'); if (!memberships?.length) throw new Error('Client membership required')
  return { supabase, user, memberships }
}

export async function createPortalTicket(input: unknown) {
  const data = z.object({ subject: z.string().min(3), description: z.string().min(10), client_id: z.string().uuid(), project_id: z.string().uuid().optional() }).parse(input); const { supabase, user, memberships } = await memberContext()
  if (!memberships.some((membership) => membership.client_id === data.client_id)) throw new Error('Forbidden')
  const reference = `SUP-${Date.now().toString(36).toUpperCase()}`; const { data: ticket, error } = await supabase.from('support_tickets').insert({ ...data, reference }).select('id').single(); if (error) throw new Error(error.message)
  await supabase.from('support_messages').insert({ ticket_id: ticket.id, author_user_id: user.id, body: data.description, visibility: 'client' }); revalidatePath('/portal'); return ticket
}

export async function decidePortalApproval(approvalId: string, decision: 'approved' | 'changes_requested', note: string) {
  const { supabase, user, memberships } = await memberContext(); const { data: approval } = await supabase.from('project_approvals').select('id,project_id,business_projects!inner(client_id)').eq('id', approvalId).single(); if (!approval) throw new Error('Approval not found')
  const project = approval.business_projects as unknown as { client_id: string }; if (!memberships.some((membership) => membership.client_id === project.client_id)) throw new Error('Forbidden')
  const { error } = await supabase.from('project_approvals').update({ status: decision, decision_note: note, decided_at: new Date().toISOString(), decided_by: user.id }).eq('id', approvalId); if (error) throw new Error(error.message); revalidatePath('/portal'); return { ok: true }
}

export async function addPortalMessage(input: unknown) {
  const data = z.object({ ticket_id: z.string().uuid(), body: z.string().min(1).max(5000) }).parse(input)
  const { supabase, user, memberships } = await memberContext()
  const { data: ticket } = await supabase.from('support_tickets').select('id,client_id').eq('id', data.ticket_id).single()
  if (!ticket || !memberships.some((membership) => membership.client_id === ticket.client_id)) throw new Error('Forbidden')
  const { data: message, error } = await supabase.from('support_messages').insert({ ticket_id: data.ticket_id, author_user_id: user.id, body: data.body, visibility: 'client' }).select('id').single()
  if (error) throw new Error(error.message)
  revalidatePath(`/portal/support/${data.ticket_id}`); revalidatePath('/portal'); return message
}

export async function decidePortalQuotation(quoteId: string, decision: 'accepted' | 'rejected' | 'revision_requested') {
  const { supabase, user, memberships } = await memberContext()
  const { data: quote } = await supabase.from('quotes').select('id,client_id,status').eq('id', quoteId).maybeSingle()
  if (!quote || !quote.client_id || !memberships.some((membership) => membership.client_id === quote.client_id)) throw new Error('Forbidden')
  if (!['sent', 'viewed', 'revision_requested'].includes(quote.status)) throw new Error('Quotation is not awaiting a decision')
  const { error } = await supabase.from('quotes').update({ status: decision }).eq('id', quoteId)
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'quote', entity_id: quoteId, action: `client_${decision}` })
  revalidatePath('/portal/quotations'); revalidatePath('/admin/quotations')
  return { ok: true }
}

export async function addProjectFeedback(input: unknown) {
  const data = z.object({ project_id: z.string().uuid(), body: z.string().min(1).max(10000), rating: z.number().int().min(1).max(5).optional() }).parse(input)
  const { supabase, user, memberships } = await memberContext()
  const { data: project } = await supabase.from('business_projects').select('id,client_id').eq('id', data.project_id).maybeSingle()
  if (!project || !memberships.some((membership) => membership.client_id === project.client_id)) throw new Error('Forbidden')
  const { data: feedback, error } = await supabase.from('project_feedback').insert({ ...data, author_user_id: user.id, visibility: 'client' }).select('id').single()
  if (error) throw new Error(error.message)
  revalidatePath(`/portal/projects/${data.project_id}`); return feedback
}
