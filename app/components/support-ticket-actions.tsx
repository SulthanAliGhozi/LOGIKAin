'use client'

import { useState, useTransition } from 'react'
import { addSupportMessage, updateTicketStatus } from '../actions/admin'

export function SupportTicketActions({ ticketId, status }: { ticketId: string; status: string }) {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  return <div className="grid gap-2"><select disabled={pending} defaultValue={status} onChange={(event) => startTransition(async () => { try { await updateTicketStatus(ticketId, event.target.value); setMessage('Updated') } catch { setMessage('Failed') } })} className="border border-black/15 bg-[#f3f0ea] px-2 py-2 text-[10px]"><option value="open">Open</option><option value="in_progress">In progress</option><option value="waiting">Waiting</option><option value="resolved">Resolved</option><option value="closed">Closed</option></select><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const body = new FormData(form).get('body'); startTransition(async () => { try { await addSupportMessage({ ticket_id: ticketId, body, visibility: 'client' }); setMessage('Reply sent'); form.reset() } catch { setMessage('Failed') } }) }}><input required name="body" placeholder="Reply to client" className="min-w-0 border border-black/15 bg-transparent px-2 py-2 text-[10px]" /><button disabled={pending} className="bg-[#171717] px-2 py-2 text-[10px] text-[#f3f0ea]">Send</button></form>{message && <span className="text-[10px] text-[#b36f43]">{message}</span>}</div>
}
