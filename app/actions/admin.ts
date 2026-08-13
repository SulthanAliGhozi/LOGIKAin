'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '../../lib/supabase/server'
import { enqueueAutomationJobAdmin } from '../../lib/automation/admin-jobs'
import { createAdminClient } from '../../lib/supabase/admin'

const leadSchema = z.object({ name: z.string().min(2), email: z.string().email(), brief: z.string().min(10), source: z.string().default('admin') })
const projectSchema = z.object({ name: z.string().min(2), description: z.string().default(''), client_id: z.string().uuid().optional() })
const contentTypeSchema = z.enum(['content_services', 'content_industries', 'content_projects', 'content_insights'])
const serviceSchema = z.object({ id: z.string().uuid().optional(), name: z.string().min(2), slug: z.string().regex(/^[a-z0-9-]+$/), summary: z.string().min(10), body: z.string().min(10), status: z.enum(['draft','review','published','archived']).default('draft'), seo_title: z.string().optional(), seo_description: z.string().optional() })
const contentBaseSchema = z.object({ id: z.string().uuid().optional(), table: contentTypeSchema, slug: z.string().regex(/^[a-z0-9-]+$/), status: z.enum(['draft','review','published','archived']).default('draft'), seo_title: z.string().optional(), seo_description: z.string().optional() })
const contentServiceSchema = contentBaseSchema.extend({ table: z.literal('content_services'), name: z.string().min(2), summary: z.string().min(10), body: z.string().min(10) })
const contentIndustrySchema = contentBaseSchema.extend({ table: z.literal('content_industries'), name: z.string().min(2), summary: z.string().min(10), body: z.string().min(10) })
const contentProjectSchema = contentBaseSchema.extend({ table: z.literal('content_projects'), title: z.string().min(2), short_description: z.string().min(10), overview: z.string().min(10), problem: z.string().default(''), analysis: z.string().default(''), solution: z.string().default(''), implementation: z.string().default(''), results: z.string().default(''), client_display_name: z.string().optional(), project_year: z.coerce.number().int().min(1900).max(2200).optional() })
const contentInsightSchema = contentBaseSchema.extend({ table: z.literal('content_insights'), title: z.string().min(2), excerpt: z.string().min(10), content: z.string().min(10) })

async function staffClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')
  const { data: profile } = await supabase.from('profiles').select('role,status').eq('id', user.id).maybeSingle()
  if (!profile || profile.status !== 'active' || !['editor','sales','project_member','finance','support','admin','owner'].includes(profile.role)) throw new Error('Forbidden')
  return { supabase, user }
}

async function privilegedClient() {
  const context = await staffClient(); const { data: profile } = await context.supabase.from('profiles').select('role').eq('id', context.user.id).single(); if (!profile || !['admin','owner'].includes(profile.role)) throw new Error('Owner or admin permission required'); return context
}

export async function createAdminLead(input: unknown) {
  const data = leadSchema.parse(input); const { supabase, user } = await staffClient()
  const { data: lead, error } = await supabase.from('leads').insert({ ...data, assigned_to: user.id }).select('id').single()
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'lead', entity_id: lead.id, action: 'created' })
  revalidatePath('/admin'); revalidatePath('/admin/leads'); return lead
}

export async function updateLeadStatus(id: string, status: string) {
  const validStatus = z.enum(['new','contacted','qualified','proposal','won','lost','archived']).parse(status); const { supabase, user } = await staffClient()
  const { error } = await supabase.from('leads').update({ status: validStatus, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'lead', entity_id: id, action: 'status_changed', metadata: { status: validStatus } })
  revalidatePath('/admin'); revalidatePath('/admin/leads')
}

export async function addLeadNote(input: unknown) {
  const data = z.object({ lead_id: z.string().uuid(), body: z.string().min(1).max(10000) }).parse(input)
  const { supabase, user } = await staffClient()
  const { data: note, error } = await supabase.from('lead_notes').insert({ ...data, author_id: user.id }).select('id').single()
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'lead', entity_id: data.lead_id, action: 'note_added' }); revalidatePath('/admin/leads'); return note
}

export async function addClientNote(input: unknown) {
  const data = z.object({ client_id: z.string().uuid(), body: z.string().min(1).max(10000) }).parse(input)
  const { supabase, user } = await staffClient()
  const { data: note, error } = await supabase.from('client_notes').insert({ ...data, author_id: user.id }).select('id').single()
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'client', entity_id: data.client_id, action: 'note_added' }); revalidatePath('/admin/clients'); return note
}

export async function createAdminProject(input: unknown) {
  const data = projectSchema.parse(input); const { supabase, user } = await staffClient()
  const { data: project, error } = await supabase.from('business_projects').insert(data).select('id').single()
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'business_project', entity_id: project.id, action: 'created' })
  revalidatePath('/admin'); revalidatePath('/admin/projects'); return project
}

export async function publishContent(tableInput: string, id: string) {
  const table = contentTypeSchema.parse(tableInput); const { supabase, user } = await staffClient()
  const { data: current, error: readError } = await supabase.from(table).select('*').eq('id', id).single()
  if (readError || !current) throw new Error(readError?.message || 'Content not found')
  const { error } = await supabase.from(table).update({ status: 'published', published_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  await supabase.from('content_revisions').insert({ content_type: table, content_id: id, version: Date.now(), snapshot: current, created_by: user.id })
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: table, entity_id: id, action: 'published' })
  revalidatePath('/'); revalidatePath('/services'); revalidatePath('/industries'); revalidatePath('/projects'); revalidatePath('/insights'); revalidatePath('/admin/content')
}

export async function deleteContent(tableInput: string, id: string) {
  const table = contentTypeSchema.parse(tableInput); const contentId = z.string().uuid().parse(id); const { supabase, user } = await staffClient()
  const { error } = await supabase.from(table).delete().eq('id', contentId)
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: table, entity_id: contentId, action: 'deleted' })
  revalidatePath('/'); revalidatePath('/services'); revalidatePath('/industries'); revalidatePath('/projects'); revalidatePath('/insights'); revalidatePath('/admin/content')
}

export async function saveService(input: unknown) {
  const data = serviceSchema.parse(input); const { supabase, user } = await staffClient(); const { id, ...fields } = data
  const query = id ? supabase.from('content_services').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id).select('id').single() : supabase.from('content_services').insert({ ...fields, created_by: user.id }).select('id').single()
  const { data: saved, error } = await query
  if (error) throw new Error(error.message)
  await supabase.from('content_revisions').insert({ content_type: 'content_services', content_id: saved.id, version: Date.now(), snapshot: data, created_by: user.id })
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'content_services', entity_id: saved.id, action: id ? 'updated' : 'created' })
  revalidatePath('/'); revalidatePath('/services'); revalidatePath(`/services/${data.slug}`); revalidatePath('/admin/content'); return saved
}

export async function saveContent(input: unknown) {
  const raw = z.discriminatedUnion('table', [contentServiceSchema, contentIndustrySchema, contentProjectSchema, contentInsightSchema]).parse(input)
  const { supabase, user } = await staffClient()
  const { id, table, ...fields } = raw
  const values = { ...fields, updated_at: new Date().toISOString(), ...(id ? {} : { created_by: user.id }) }
  const query = id
    ? supabase.from(table).update(values as never).eq('id', id).select('id').single()
    : supabase.from(table).insert(values as never).select('id').single()
  const { data: saved, error } = await query
  if (error) throw new Error(error.message)
  await supabase.from('content_revisions').insert({ content_type: table, content_id: saved.id, version: Date.now(), snapshot: raw, created_by: user.id })
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: table, entity_id: saved.id, action: id ? 'updated' : 'created' })
  const paths = table === 'content_services' ? ['/services', `/services/${raw.slug}`] : table === 'content_industries' ? ['/industries', `/industries/${raw.slug}`] : table === 'content_projects' ? ['/projects', `/projects/${raw.slug}`] : ['/insights', `/insights/${raw.slug}`]
  for (const path of ['/', '/admin/content', ...paths]) revalidatePath(path)
  return saved
}

export async function registerMediaAsset(input: unknown) {
  const data = z.object({ storage_path: z.string().min(1), filename: z.string().min(1), mime_type: z.string().optional(), size_bytes: z.number().int().nonnegative().optional(), width: z.number().int().positive().optional(), height: z.number().int().positive().optional(), alt_text: z.string().default(''), is_decorative: z.boolean().default(false) }).parse(input); const { supabase, user } = await staffClient()
  const { data: asset, error } = await supabase.from('media_assets').insert({ ...data, created_by: user.id }).select('id').single()
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'media_asset', entity_id: asset.id, action: 'uploaded' }); revalidatePath('/admin/media'); return asset
}

export async function updateMediaAsset(input: unknown) {
  const data = z.object({ id: z.string().uuid(), alt_text: z.string().max(500), is_decorative: z.boolean().default(false) }).parse(input)
  const { supabase, user } = await staffClient(); const { error } = await supabase.from('media_assets').update({ alt_text: data.alt_text, is_decorative: data.is_decorative }).eq('id', data.id)
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'media_asset', entity_id: data.id, action: 'metadata_updated' }); revalidatePath('/admin/media')
}

export async function updateInvoiceStatus(id: string, status: string) {
  const validStatus = z.enum(['draft','issued','partially_paid','paid','overdue','void']).parse(status); const { supabase, user } = await staffClient()
  const { data: current } = await supabase.from('invoices').select('status').eq('id', id).maybeSingle()
  if (!current) throw new Error('Invoice not found')
  if (['issued','partially_paid','paid','overdue'].includes(current.status) && validStatus === 'draft') throw new Error('Issued invoices cannot return to draft')
  const { error } = await supabase.from('invoices').update({ status: validStatus }).eq('id', id)
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'invoice', entity_id: id, action: 'status_changed', metadata: { status: validStatus } })
  revalidatePath('/admin/finance'); revalidatePath('/portal')
}

export async function recordPayment(input: unknown) {
  const data = z.object({ invoice_id: z.string().uuid(), amount_minor: z.number().int().positive(), currency: z.string().length(3).default('IDR'), provider: z.string().optional(), provider_reference: z.string().optional() }).parse(input); const { supabase, user } = await staffClient()
  const { data: payment, error } = await supabase.from('payments').insert({ ...data, status: 'succeeded', paid_at: new Date().toISOString() }).select('id').single()
  if (error) throw new Error(error.message)
  const { data: invoice } = await supabase.from('invoices').select('total_minor').eq('id', data.invoice_id).single(); const { data: payments } = await supabase.from('payments').select('amount_minor').eq('invoice_id', data.invoice_id).eq('status', 'succeeded'); const paid = (payments || []).reduce((sum, item) => sum + Number(item.amount_minor), 0); if (invoice) await supabase.from('invoices').update({ status: paid >= Number(invoice.total_minor) ? 'paid' : 'partially_paid' }).eq('id', data.invoice_id)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'payment', entity_id: payment.id, action: 'recorded', metadata: { paid_total: paid } }); revalidatePath('/admin/finance'); revalidatePath('/portal'); return payment
}

export async function updateTicketStatus(id: string, status: string) {
  const validStatus = z.enum(['open','in_progress','waiting_client','resolved','closed']).parse(status); const { supabase, user } = await staffClient()
  const { error } = await supabase.from('support_tickets').update({ status, ...(status === 'resolved' ? { resolved_at: new Date().toISOString() } : {}) }).eq('id', id)
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'support_ticket', entity_id: id, action: 'status_changed', metadata: { status: validStatus } }); if (process.env.SUPABASE_SERVICE_ROLE_KEY) { try { await enqueueAutomationJobAdmin({ type: 'support_update', payload: { ticket_id: id }, idempotency_key: `support-update:${id}:${validStatus}:${Date.now()}` }) } catch { /* Support status remains saved if email queue is unavailable. */ } } revalidatePath('/admin/support'); revalidatePath('/portal')
}

export async function addSupportMessage(input: unknown) {
  const data = z.object({ ticket_id: z.string().uuid(), body: z.string().min(1), visibility: z.enum(['internal','client']).default('client') }).parse(input); const { supabase, user } = await staffClient()
  const { data: message, error } = await supabase.from('support_messages').insert({ ...data, author_user_id: user.id }).select('id').single()
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'support_ticket', entity_id: data.ticket_id, action: 'message_added' }); revalidatePath('/admin/support'); revalidatePath('/portal'); return message
}

export async function createMilestone(input: unknown) {
  const data = z.object({ project_id: z.string().uuid(), title: z.string().min(2), description: z.string().default(''), target_date: z.string().optional(), client_visible: z.boolean().default(true) }).parse(input); const { supabase, user } = await staffClient()
  const { data: milestone, error } = await supabase.from('project_milestones').insert(data).select('id').single(); if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'project_milestone', entity_id: milestone.id, action: 'created' }); revalidatePath(`/admin/projects/${data.project_id}`); revalidatePath('/portal'); return milestone
}

export async function createProjectTask(input: unknown) {
  const data = z.object({ project_id: z.string().uuid(), milestone_id: z.string().uuid().optional(), title: z.string().min(2), description: z.string().default(''), due_date: z.string().optional(), client_visible: z.boolean().default(false) }).parse(input); const { supabase, user } = await staffClient()
  const { data: task, error } = await supabase.from('project_tasks').insert(data).select('id').single(); if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'project_task', entity_id: task.id, action: 'created' }); revalidatePath(`/admin/projects/${data.project_id}`); revalidatePath('/portal'); return task
}

export async function requestProjectApproval(input: unknown) {
  const data = z.object({ project_id: z.string().uuid(), milestone_id: z.string().uuid().optional(), title: z.string().min(2), request_note: z.string().min(2) }).parse(input); const { supabase, user } = await staffClient()
  const { data: approval, error } = await supabase.from('project_approvals').insert(data).select('id').single(); if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'project_approval', entity_id: approval.id, action: 'requested' }); revalidatePath(`/admin/projects/${data.project_id}`); revalidatePath('/portal'); return approval
}

export async function convertLeadToClient(leadId: string) {
  const { supabase, user } = await staffClient(); const { data: lead, error: leadError } = await supabase.from('leads').select('*').eq('id', leadId).single(); if (leadError || !lead) throw new Error('Lead not found')
  const { data: existing } = await supabase.from('clients').select('id').eq('originating_lead_id', lead.id).maybeSingle()
  if (existing) return existing
  const { data: client, error } = await supabase.from('clients').insert({ name: lead.company || lead.name, email: lead.email, phone: lead.phone, originating_lead_id: lead.id, status: 'active' }).select('id').single(); if (error) throw new Error(error.message)
  await supabase.from('client_contacts').insert({ client_id: client.id, name: lead.name, email: lead.email, phone: lead.phone, is_primary: true }); await supabase.from('leads').update({ status: 'won', updated_at: new Date().toISOString() }).eq('id', leadId)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'lead', entity_id: leadId, action: 'converted_to_client', metadata: { client_id: client.id } }); revalidatePath('/admin/leads'); revalidatePath('/admin/clients'); return client
}

export async function createQuote(input: unknown) {
  const data = z.object({ quote_number: z.string().min(3), lead_id: z.string().uuid().optional(), client_id: z.string().uuid().optional(), currency: z.string().length(3).default('IDR'), total_minor: z.number().int().nonnegative(), valid_until: z.string().optional() }).parse(input); const { supabase, user } = await staffClient()
  const { data: quote, error } = await supabase.from('quotes').insert(data).select('id').single(); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'quote', entity_id: quote.id, action: 'created' }); revalidatePath('/admin/finance'); return quote
}

export async function updateQuoteStatus(id: string, status: string) {
  const validStatus = z.enum(['draft','sent','viewed','accepted','rejected','expired','revision_requested','cancelled']).parse(status); const { supabase, user } = await staffClient(); const { data: current } = await supabase.from('quotes').select('status').eq('id', id).maybeSingle(); if (!current) throw new Error('Quotation not found'); if (current.status === 'accepted' && validStatus !== 'accepted') throw new Error('Accepted quotations require a new revision'); const { error } = await supabase.from('quotes').update({ status: validStatus }).eq('id', id); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'quote', entity_id: id, action: 'status_changed', metadata: { status: validStatus } }); revalidatePath('/admin/finance'); revalidatePath('/admin/quotations'); revalidatePath('/portal/quotations');
}

export async function createInvoice(input: unknown) {
  const data = z.object({ invoice_number: z.string().min(3), client_id: z.string().uuid(), project_id: z.string().uuid().optional(), currency: z.string().length(3).default('IDR'), total_minor: z.number().int().positive(), issued_at: z.string().optional(), due_at: z.string().optional() }).parse(input); const { supabase, user } = await staffClient(); const { data: invoice, error } = await supabase.from('invoices').insert({ ...data, status: data.issued_at ? 'issued' : 'draft' }).select('id').single(); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'invoice', entity_id: invoice.id, action: 'created' }); if (data.due_at && process.env.SUPABASE_SERVICE_ROLE_KEY) { try { await enqueueAutomationJobAdmin({ type: 'invoice_due_reminder', payload: { invoice_id: invoice.id }, run_at: `${data.due_at}T09:00:00.000Z`, idempotency_key: `invoice-due:${invoice.id}` }) } catch { /* Invoice remains created if reminder scheduling is unavailable. */ } } revalidatePath('/admin/finance'); revalidatePath('/portal'); return invoice
}

export async function updateUserRole(userId: string, role: string) {
  const validRole = z.enum(['editor','sales','project_member','finance','support','admin','owner']).parse(role); const { supabase, user } = await privilegedClient(); if (user.id === userId && validRole !== 'owner') throw new Error('You cannot remove your own owner access')
  const { data: target } = await supabase.from('profiles').select('role').eq('id', userId).single(); if (target?.role === 'owner' && validRole !== 'owner') { const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'owner').eq('status', 'active'); if ((count || 0) <= 1) throw new Error('At least one active owner is required') }
  const { error } = await supabase.from('profiles').update({ role: validRole, updated_at: new Date().toISOString() }).eq('id', userId); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'profile', entity_id: userId, action: 'role_changed', metadata: { role: validRole } }); revalidatePath('/admin/users')
}

export async function inviteStaffUser(input: unknown) {
  const data = z.object({ full_name: z.string().min(2).max(120), email: z.string().email(), role: z.enum(['editor','sales','project_member','finance','support','admin','owner']).default('editor') }).parse(input)
  const { user } = await privilegedClient()
  const admin = createAdminClient()
  const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(data.email, { data: { full_name: data.full_name }, redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login` })
  if (error || !invited.user) throw new Error(error?.message || 'User invitation failed')
  const { error: profileError } = await admin.from('profiles').upsert({ id: invited.user.id, full_name: data.full_name, role: data.role, status: 'invited', updated_at: new Date().toISOString() })
  if (profileError) throw new Error(profileError.message)
  await admin.from('activity_logs').insert({ actor_id: user.id, entity_type: 'profile', entity_id: invited.user.id, action: 'invited', metadata: { email: data.email, role: data.role } })
  revalidatePath('/admin/users')
}

export async function createAdminUser(input: unknown) {
  const data = z.object({ username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/), full_name: z.string().min(2).max(120), email: z.string().email(), password: z.string().min(8).max(128), role: z.enum(['editor','sales','project_member','finance','support','admin','owner']).default('editor'), status: z.enum(['active','invited','suspended']).default('active') }).parse(input)
  const { user } = await privilegedClient(); const admin = createAdminClient()
  const { data: created, error } = await admin.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true, user_metadata: { username: data.username, full_name: data.full_name } })
  if (error || !created.user) throw new Error(error?.message || 'User creation failed')
  const { error: profileError } = await admin.from('profiles').upsert({ id: created.user.id, username: data.username, full_name: data.full_name, role: data.role, status: data.status, updated_at: new Date().toISOString() })
  if (profileError) { await admin.auth.admin.deleteUser(created.user.id); throw new Error(profileError.message) }
  await admin.from('activity_logs').insert({ actor_id: user.id, entity_type: 'profile', entity_id: created.user.id, action: 'created', metadata: { username: data.username, email: data.email, role: data.role } }); revalidatePath('/admin/users')
}

export async function updateAdminUser(input: unknown) {
  const data = z.object({ id: z.string().uuid(), username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/), full_name: z.string().min(2).max(120), email: z.string().email(), password: z.string().max(128).optional(), role: z.enum(['editor','sales','project_member','finance','support','admin','owner']), status: z.enum(['active','invited','suspended']) }).parse(input)
  const { user } = await privilegedClient(); if (user.id === data.id && data.status !== 'active') throw new Error('You cannot suspend your own account')
  const admin = createAdminClient()
  const { password } = data
  const { error: authError } = await admin.auth.admin.updateUserById(data.id, { email: data.email, ...(password ? { password } : {}), user_metadata: { username: data.username, full_name: data.full_name } })
  if (authError) throw new Error(authError.message)
  const { error: profileError } = await admin.from('profiles').update({ username: data.username, full_name: data.full_name, role: data.role, status: data.status, updated_at: new Date().toISOString() }).eq('id', data.id)
  if (profileError) throw new Error(profileError.message)
  await admin.from('activity_logs').insert({ actor_id: user.id, entity_type: 'profile', entity_id: data.id, action: 'updated', metadata: { email: data.email, role: data.role, status: data.status } })
  revalidatePath('/admin/users')
}

export async function deleteAdminUser(userId: string) {
  const id = z.string().uuid().parse(userId); const { user, supabase } = await privilegedClient(); if (user.id === id) throw new Error('You cannot delete your own account')
  const { data: target } = await supabase.from('profiles').select('role').eq('id', id).single()
  if (target?.role === 'owner') { const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'owner').eq('status', 'active'); if ((count || 0) <= 1) throw new Error('At least one active owner is required') }
  const admin = createAdminClient(); const { error } = await admin.auth.admin.deleteUser(id); if (error) throw new Error(error.message)
  await admin.from('activity_logs').insert({ actor_id: user.id, entity_type: 'profile', entity_id: id, action: 'deleted' }); revalidatePath('/admin/users')
}

export async function assignClientMembership(input: unknown) {
  const data = z.object({ client_id: z.string().uuid(), user_id: z.string().uuid(), portal_role: z.enum(['client_owner','client_admin','client_member','viewer']).default('client_member') }).parse(input)
  const { supabase, user } = await staffClient()
  const { data: membership, error } = await supabase.from('client_memberships').upsert({ ...data, status: 'active' }, { onConflict: 'client_id,user_id' }).select('id').single()
  if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'client_membership', entity_id: membership.id, action: 'assigned', metadata: { client_id: data.client_id, user_id: data.user_id, portal_role: data.portal_role } })
  revalidatePath('/admin/clients'); revalidatePath('/portal'); return membership
}

export async function snapshotInvoice(invoiceId: string) {
  const { supabase, user } = await staffClient(); const { data: invoice, error: readError } = await supabase.from('invoices').select('*').eq('id', invoiceId).single(); if (readError || !invoice) throw new Error('Invoice not found')
  const { count } = await supabase.from('invoice_snapshots').select('*', { count: 'exact', head: true }).eq('invoice_id', invoiceId); const version = (count || 0) + 1; const { data: snapshot, error } = await supabase.from('invoice_snapshots').insert({ invoice_id: invoiceId, version, snapshot: invoice, created_by: user.id }).select('id,version').single(); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'invoice', entity_id: invoiceId, action: 'snapshot_created', metadata: { version } }); revalidatePath(`/portal/invoices/${invoiceId}`); return snapshot
}

export async function uploadProjectFile(formData: FormData) {
  const projectId = z.string().uuid().parse(formData.get('project_id'))
  const clientVisible = formData.get('client_visible') === 'on'
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) throw new Error('A file is required')
  if (file.size > 25 * 1024 * 1024) throw new Error('Maximum file size is 25 MB')
  const { supabase, user } = await staffClient()
  const { data: project } = await supabase.from('business_projects').select('id').eq('id', projectId).single()
  if (!project) throw new Error('Project not found')
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-160)
  const storagePath = `${projectId}/${crypto.randomUUID()}-${safeName}`
  const upload = await supabase.storage.from('private-project-files').upload(storagePath, file, { contentType: file.type || 'application/octet-stream', upsert: false })
  if (upload.error) throw new Error(upload.error.message)
  const { data: saved, error } = await supabase.from('project_files').insert({ project_id: projectId, storage_path: storagePath, filename: file.name, mime_type: file.type || null, size_bytes: file.size, client_visible: clientVisible, uploaded_by: user.id }).select('id').single()
  if (error) { await supabase.storage.from('private-project-files').remove([storagePath]); throw new Error(error.message) }
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'project_file', entity_id: saved.id, action: 'uploaded' })
  revalidatePath(`/admin/projects/${projectId}`); revalidatePath('/portal'); return saved
}

export async function updateProjectFileVisibility(fileId: string, clientVisible: boolean) {
  const id = z.string().uuid().parse(fileId); const { supabase, user } = await staffClient()
  const { data: file, error } = await supabase.from('project_files').update({ client_visible: clientVisible }).eq('id', id).select('project_id').single()
  if (error || !file) throw new Error(error?.message || 'File not found')
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'project_file', entity_id: id, action: 'visibility_changed', metadata: { client_visible: clientVisible } })
  revalidatePath(`/admin/projects/${file.project_id}`); revalidatePath('/portal')
}

export async function createTestimonial(input: unknown) {
  const data = z.object({ quote: z.string().min(10), author_name: z.string().min(2), author_role: z.string().optional(), company_name: z.string().optional(), status: z.enum(['draft','review','published','archived']).default('draft'), featured: z.boolean().default(false) }).parse(input)
  const { supabase, user } = await staffClient(); const { data: item, error } = await supabase.from('testimonials').insert({ ...data, created_by: user.id }).select('id').single()
  if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'testimonial', entity_id: item.id, action: 'created' }); revalidatePath('/'); revalidatePath('/admin/testimonials'); return item
}

export async function addQuoteItem(input: unknown) {
  const data = z.object({ quote_id: z.string().uuid(), description: z.string().min(2), quantity: z.number().int().positive(), unit_amount_minor: z.number().int().nonnegative(), sort_order: z.number().int().nonnegative().default(0) }).parse(input); const { supabase, user } = await staffClient()
  const { data: quote } = await supabase.from('quotes').select('status').eq('id', data.quote_id).maybeSingle(); if (!quote) throw new Error('Quotation not found'); if (quote.status === 'accepted') throw new Error('Accepted quotations are immutable')
  const { data: item, error } = await supabase.from('quote_items').insert(data).select('id').single(); if (error) throw new Error(error.message)
  const { data: items } = await supabase.from('quote_items').select('quantity,unit_amount_minor').eq('quote_id', data.quote_id); const total = (items || []).reduce((sum, row) => sum + Number(row.quantity) * Number(row.unit_amount_minor), 0)
  await supabase.from('quotes').update({ total_minor: total }).eq('id', data.quote_id); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'quote', entity_id: data.quote_id, action: 'item_added' }); revalidatePath('/admin/finance'); return item
}

export async function addInvoiceItem(input: unknown) {
  const data = z.object({ invoice_id: z.string().uuid(), description: z.string().min(2), quantity: z.number().int().positive(), unit_amount_minor: z.number().int().nonnegative(), sort_order: z.number().int().nonnegative().default(0) }).parse(input); const { supabase, user } = await staffClient()
  const { data: item, error } = await supabase.from('invoice_items').insert(data).select('id').single(); if (error) throw new Error(error.message)
  const { data: items } = await supabase.from('invoice_items').select('quantity,unit_amount_minor').eq('invoice_id', data.invoice_id); const total = (items || []).reduce((sum, row) => sum + Number(row.quantity) * Number(row.unit_amount_minor), 0)
  const { data: invoice } = await supabase.from('invoices').select('status').eq('id', data.invoice_id).single(); if (invoice?.status === 'draft') await supabase.from('invoices').update({ total_minor: total }).eq('id', data.invoice_id)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'invoice', entity_id: data.invoice_id, action: 'item_added' }); revalidatePath('/admin/finance'); return item
}

export async function restoreContentRevision(input: unknown) {
  const data = z.object({ table: contentTypeSchema, content_id: z.string().uuid(), revision_id: z.string().uuid() }).parse(input); const { supabase, user } = await privilegedClient()
  const { data: revision, error: revisionError } = await supabase.from('content_revisions').select('snapshot').eq('id', data.revision_id).eq('content_type', data.table).eq('content_id', data.content_id).single(); if (revisionError || !revision) throw new Error('Revision not found')
  const snapshot = revision.snapshot as Record<string, unknown>; const safe = { ...snapshot }; delete safe.id; delete safe.created_at; delete safe.updated_at; delete safe.created_by; delete safe.table
  const { error } = await supabase.from(data.table).update({ ...safe, updated_at: new Date().toISOString() }).eq('id', data.content_id); if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: data.table, entity_id: data.content_id, action: 'revision_restored', metadata: { revision_id: data.revision_id } }); revalidatePath('/admin/content'); revalidatePath('/'); return { ok: true }
}

export async function createRedirect(input: unknown) {
  const data = z.object({ source_path: z.string().startsWith('/'), target_path: z.string().startsWith('/'), status_code: z.enum(['301','302']).transform(Number), reason: z.string().optional() }).parse(input); const { supabase, user } = await staffClient()
  const { data: redirectRow, error } = await supabase.from('redirects').insert({ ...data, created_by: user.id }).select('id').single(); if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'redirect', entity_id: redirectRow.id, action: 'created' }); revalidatePath('/admin/seo'); return redirectRow
}

export async function updateSiteSetting(key: string, value: unknown) {
  const safeKey = z.string().min(1).max(100).parse(key); const { supabase, user } = await privilegedClient(); const { error } = await supabase.from('site_settings').upsert({ key: safeKey, value, updated_by: user.id, updated_at: new Date().toISOString() }); if (error) throw new Error(error.message)
  await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'site_setting', action: 'updated', metadata: { key: safeKey } }); revalidatePath('/admin/settings'); revalidatePath('/');
}

export async function deleteTestimonial(id: string) {
  const itemId = z.string().uuid().parse(id); const { supabase, user } = await staffClient(); const { error } = await supabase.from('testimonials').delete().eq('id', itemId); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'testimonial', entity_id: itemId, action: 'deleted' }); revalidatePath('/'); revalidatePath('/admin/testimonials')
}

export async function deleteMediaAsset(id: string) {
  const itemId = z.string().uuid().parse(id); const { supabase, user } = await staffClient(); const { data: asset } = await supabase.from('media_assets').select('storage_path').eq('id', itemId).single(); if (!asset) throw new Error('Media asset not found'); const { error } = await supabase.from('media_assets').delete().eq('id', itemId); if (error) throw new Error(error.message); await supabase.storage.from('public-media').remove([asset.storage_path]); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'media_asset', entity_id: itemId, action: 'deleted' }); revalidatePath('/admin/media')
}

export async function deleteRedirect(id: string) {
  const itemId = z.string().uuid().parse(id); const { supabase, user } = await staffClient(); const { error } = await supabase.from('redirects').delete().eq('id', itemId); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'redirect', entity_id: itemId, action: 'deleted' }); revalidatePath('/admin/seo')
}

export async function createClientRecord(input: unknown) {
  const data = z.object({ name: z.string().min(2), legal_name: z.string().optional(), email: z.string().email().optional().or(z.literal('')), phone: z.string().optional(), status: z.enum(['prospect','active','inactive','archived']).default('prospect') }).parse(input); const { supabase, user } = await staffClient(); const { data: client, error } = await supabase.from('clients').insert({ ...data, email: data.email || null }).select('id').single(); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'client', entity_id: client.id, action: 'created' }); revalidatePath('/admin/clients'); return client
}

export async function updateClientRecord(input: unknown) {
  const data = z.object({ id: z.string().uuid(), name: z.string().min(2), legal_name: z.string().optional(), email: z.string().email().optional().or(z.literal('')), phone: z.string().optional(), status: z.enum(['prospect','active','inactive','archived']) }).parse(input); const { supabase, user } = await staffClient(); const { id, ...fields } = data; const { error } = await supabase.from('clients').update({ ...fields, email: fields.email || null, updated_at: new Date().toISOString() }).eq('id', id); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'client', entity_id: id, action: 'updated' }); revalidatePath('/admin/clients')
}

export async function deleteClientRecord(id: string) {
  const clientId = z.string().uuid().parse(id); const { supabase, user } = await staffClient(); const { error } = await supabase.from('clients').delete().eq('id', clientId); if (error) throw new Error(error.message); await supabase.from('activity_logs').insert({ actor_id: user.id, entity_type: 'client', entity_id: clientId, action: 'deleted' }); revalidatePath('/admin/clients')
}
