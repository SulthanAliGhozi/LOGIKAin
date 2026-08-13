'use client'

import { useTransition } from 'react'
import { convertLeadToClient } from '../actions/admin'

export function ConvertLeadButton({ leadId, status }: { leadId: string; status: string }) { const [pending, startTransition] = useTransition(); if (status === 'won') return <span className="text-[10px] text-emerald-700">Converted</span>; return <button disabled={pending} onClick={() => startTransition(async () => { await convertLeadToClient(leadId) })} className="text-[10px] font-bold text-[#b36f43] disabled:opacity-50">{pending ? 'Converting...' : 'Convert ↗'}</button> }
