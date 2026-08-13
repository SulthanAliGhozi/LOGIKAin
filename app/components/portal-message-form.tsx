'use client'

import { useState, useTransition } from 'react'
import { addPortalMessage } from '../actions/portal'

export function PortalMessageForm({ ticketId }: { ticketId: string }) {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  return <form className="mt-6 grid gap-3 border-t border-black/10 pt-6" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const body = new FormData(form).get('body'); startTransition(async () => { try { await addPortalMessage({ ticket_id: ticketId, body }); setMessage('Reply sent.'); form.reset() } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not send reply.') } }) }}><textarea required minLength={1} name="body" rows={4} placeholder="Write a reply..." className="border border-black/15 bg-transparent px-3 py-3 text-sm" /><button disabled={pending} className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">{pending ? 'Sending...' : 'Send reply'}</button>{message && <p className="text-xs text-[#b36f43]">{message}</p>}</form>
}
