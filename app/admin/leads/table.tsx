'use client'

import { ConvertLeadButton } from '../../components/lead-actions'
export function LeadActions({ id, status }: { id: string; status: string }) { return <ConvertLeadButton leadId={id} status={status} /> }
