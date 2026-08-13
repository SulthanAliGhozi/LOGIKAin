'use client'

import { useState, useTransition } from 'react'
import { assignClientMembership } from '../actions/admin'

export function ClientMembershipForm({ clientId, users }: { clientId: string; users: { id: string; label: string }[] }) {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  return <form className="mt-4 flex flex-wrap items-center gap-2" onSubmit={(event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); startTransition(async () => { try { await assignClientMembership({ client_id: clientId, user_id: values.user_id, portal_role: values.portal_role }); setMessage('Assigned') } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not assign') } }) }}><select required name="user_id" className="border border-black/15 bg-[#f3f0ea] px-3 py-2 text-xs"><option value="">Select portal user</option>{users.map((user) => <option key={user.id} value={user.id}>{user.label}</option>)}</select><select name="portal_role" className="border border-black/15 bg-[#f3f0ea] px-3 py-2 text-xs"><option value="client_member">Member</option><option value="client_admin">Admin</option><option value="client_owner">Owner</option><option value="viewer">Viewer</option></select><button disabled={pending} className="bg-[#171717] px-3 py-2 text-[10px] font-bold text-[#f3f0ea]">{pending ? 'Saving...' : 'Assign'}</button>{message && <span className="text-[10px] text-[#b36f43]">{message}</span>}</form>
}
