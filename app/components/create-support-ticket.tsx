'use client'

import { useState, useTransition } from 'react'
import { createTicket } from '../actions/admin'

export function CreateSupportTicket() {
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)} className="bg-[#171717] text-[#f3f0ea] px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors">Create ticket</button>
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-black/10 shadow-sm mt-4 text-left min-w-[300px]">
      <h3 className="font-semibold mb-4 text-sm">Create new ticket</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const subject = new FormData(form).get('subject') as string;
        const description = new FormData(form).get('description') as string;
        const priority = new FormData(form).get('priority') as string;
        startTransition(async () => {
          try {
            await createTicket({ subject, description, priority });
            setIsOpen(false);
            form.reset();
          } catch(err: any) {
            setMessage(err.message || 'Failed to create');
          }
        })
      }} className="grid gap-3">
        <input required name="subject" placeholder="Ticket subject" className="border border-black/15 rounded-md px-3 py-2 text-sm bg-transparent" />
        <textarea required name="description" placeholder="Ticket description" className="border border-black/15 rounded-md px-3 py-2 text-sm bg-transparent" rows={3} />
        <select name="priority" defaultValue="medium" className="border border-black/15 rounded-md px-3 py-2 text-sm bg-transparent">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <div className="flex gap-2">
          <button disabled={pending} className="bg-[#171717] text-[#f3f0ea] px-4 py-2 rounded-md text-sm font-medium hover:bg-black/80 transition-colors flex-1">{pending ? 'Creating...' : 'Submit'}</button>
          <button type="button" disabled={pending} onClick={() => setIsOpen(false)} className="bg-gray-100 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex-1">Cancel</button>
        </div>
        {message && <p className="text-red-500 text-xs">{message}</p>}
      </form>
    </div>
  )
}
