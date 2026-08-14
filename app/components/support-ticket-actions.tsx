'use client'

import { useState, useTransition } from 'react'
import { addSupportMessage, updateTicketStatus, updateTicket, deleteTicket } from '../actions/admin'

export function SupportTicketActions({ ticketId, status, subject, description, priority }: { ticketId: string; status: string; subject: string; description: string; priority: string }) {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  
  if (isEditing) {
    return (
      <form className="grid gap-2" onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const subj = new FormData(form).get('subject') as string;
        const desc = new FormData(form).get('description') as string;
        const prio = new FormData(form).get('priority') as string;
        startTransition(async () => {
          try {
            await updateTicket({ id: ticketId, subject: subj, description: desc, priority: prio });
            setIsEditing(false);
            setMessage('Updated');
          } catch {
            setMessage('Failed to update');
          }
        });
      }}>
        <input required name="subject" defaultValue={subject} className="border border-black/15 bg-transparent px-2 py-1 text-[10px]" />
        <textarea required name="description" defaultValue={description} className="border border-black/15 bg-transparent px-2 py-1 text-[10px]" rows={2} />
        <select name="priority" defaultValue={priority} className="border border-black/15 bg-transparent px-2 py-1 text-[10px]">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <div className="flex gap-2">
          <button disabled={pending} className="bg-[#171717] px-2 py-1 text-[10px] text-[#f3f0ea] flex-1">Save</button>
          <button type="button" disabled={pending} onClick={() => setIsEditing(false)} className="bg-gray-200 px-2 py-1 text-[10px] text-black flex-1">Cancel</button>
        </div>
      </form>
    )
  }

  return <div className="grid gap-2">
    <div className="flex gap-2">
      <select disabled={pending} defaultValue={status} onChange={(event) => startTransition(async () => { try { await updateTicketStatus(ticketId, event.target.value); setMessage('Updated') } catch { setMessage('Failed') } })} className="border border-black/15 bg-[#f3f0ea] px-2 py-2 text-[10px] flex-1">
        <option value="open">Open</option><option value="in_progress">In progress</option><option value="waiting_client">Waiting</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
      </select>
      <button type="button" disabled={pending} onClick={() => setIsEditing(true)} className="border border-black/15 px-2 py-2 text-[10px] bg-white">Edit</button>
      <button type="button" disabled={pending} onClick={() => { if(confirm('Delete ticket?')) { startTransition(async () => { try { await deleteTicket(ticketId); } catch { setMessage('Failed to delete') } }) } }} className="border border-red-200 text-red-700 px-2 py-2 text-[10px] bg-red-50">Delete</button>
    </div>
    <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const body = new FormData(form).get('body'); startTransition(async () => { try { await addSupportMessage({ ticket_id: ticketId, body, visibility: 'client' }); setMessage('Reply sent'); form.reset() } catch { setMessage('Failed') } }) }}><input required name="body" placeholder="Reply to client" className="min-w-0 border border-black/15 bg-transparent px-2 py-2 text-[10px] flex-1" /><button disabled={pending} className="bg-[#171717] px-2 py-2 text-[10px] text-[#f3f0ea]">Send</button></form>
    {message && <span className="text-[10px] text-[#b36f43]">{message}</span>}
  </div>
}
