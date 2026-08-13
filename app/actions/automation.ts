'use server'

import { revalidatePath } from 'next/cache'
import { enqueueAutomationJob } from '../../lib/automation/jobs'

export async function queueLeadAcknowledgment(leadId: string) { const result = await enqueueAutomationJob({ type: 'lead_acknowledgment', payload: { lead_id: leadId }, idempotency_key: `lead-ack:${leadId}` }); revalidatePath('/admin/leads'); return result }
export async function queueContentRevalidation(path: string) { const result = await enqueueAutomationJob({ type: 'content_publish', payload: { path }, idempotency_key: `content-revalidate:${path}:${Date.now()}` }); revalidatePath(path); return result }
