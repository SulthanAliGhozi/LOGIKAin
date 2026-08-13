'use client'

import { useState, useTransition } from 'react'
import { decidePortalQuotation } from '../actions/portal'

export function PortalQuotationActions({ quoteId, status }: { quoteId: string; status: string }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  if (!['sent', 'viewed', 'revision_requested'].includes(status)) return null
  const decide = (decision: 'accepted' | 'rejected' | 'revision_requested') => startTransition(async () => {
    try { await decidePortalQuotation(quoteId, decision); setMessage('Saved.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save decision.') }
  })
  return <div className="mt-5 flex flex-wrap gap-2"><button disabled={pending} onClick={() => decide('accepted')} className="bg-[#171717] px-3 py-2 text-xs text-[#f3f0ea]">Accept</button><button disabled={pending} onClick={() => decide('revision_requested')} className="border border-black/15 px-3 py-2 text-xs">Request revision</button><button disabled={pending} onClick={() => decide('rejected')} className="border border-black/15 px-3 py-2 text-xs">Reject</button>{message && <span className="w-full text-xs text-[#b36f43]">{message}</span>}</div>
}
