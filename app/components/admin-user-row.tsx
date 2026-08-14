'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { deleteAdminUser, updateAdminUser } from '../actions/admin'

type User = { id: string; username: string; email: string; full_name: string; roles: string[]; status: string; created_at: string }
const input = 'border border-black/15 bg-transparent px-3 py-2 text-xs'

export function AdminUserRow({ user }: { user: User }) {
  const [editing, setEditing] = useState(false)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setMessage('')
    startTransition(async () => {
      try {
        await updateAdminUser({ id: user.id, username: form.get('username'), full_name: form.get('full_name'), email: form.get('email'), password: form.get('password'), roles: form.getAll('roles'), status: form.get('status') })
        setEditing(false)
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Update gagal.')
      }
    })
  }

  return (
    <tr className="border-b border-black/10 last:border-0">
      <td colSpan={7} className="p-0">
        {editing ? (
          <form className="grid gap-3 p-5 md:grid-cols-[1fr_1.1fr_1.3fr_1fr_1fr_1fr_auto_auto]" onSubmit={save}>
            <input required name="username" defaultValue={user.username} className={input} />
            <input required name="full_name" defaultValue={user.full_name} className={input} />
            <input required type="email" name="email" defaultValue={user.email} className={input} />
            <input minLength={8} type="password" name="password" placeholder="Password baru (opsional)" className={input} />
            
            <div className="flex flex-col gap-1 border border-black/15 bg-[#f3f0ea] px-3 py-2 text-xs h-24 overflow-y-auto">
              {[
                {value: 'client', label: 'Client'},
                {value: 'editor', label: 'Editor'},
                {value: 'sales', label: 'Sales'},
                {value: 'project_member', label: 'Project member'},
                {value: 'finance', label: 'Finance'},
                {value: 'support', label: 'Support'},
                {value: 'admin', label: 'Admin'},
                {value: 'owner', label: 'Owner'}
              ].map(r => (
                <label key={r.value} className="flex items-center gap-2">
                  <input type="checkbox" name="roles" value={r.value} defaultChecked={user.roles?.includes(r.value)} className="rounded border-black/20 text-[#b36f43] focus:ring-[#b36f43]" />
                  {r.label}
                </label>
              ))}
            </div>

            <select name="status" defaultValue={user.status} className={input + ' bg-[#f3f0ea] h-10'}>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="suspended">Suspended</option>
            </select>
            <button disabled={pending} className="bg-[#171717] px-3 py-2 text-xs font-bold text-[#f3f0ea] h-10">{pending ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => setEditing(false)} className="px-3 py-2 text-xs h-10">Cancel</button>
            {message && <p className="text-xs text-red-700 md:col-span-8">{message}</p>}
          </form>
        ) : (
          <div className="grid gap-2 px-5 py-4 md:grid-cols-[1fr_1.1fr_1.3fr_1fr_1fr_1fr_auto] md:items-center">
            <div className="font-bold">{user.username || '—'}</div>
            <div className="font-bold">{user.full_name || '—'}</div>
            <div className="break-all">{user.email}</div>
            <div className="capitalize">{(user.roles || []).join(', ')}</div>
            <div className="capitalize">{user.status}</div>
            <div>{new Date(user.created_at).toLocaleDateString('id-ID')}</div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(true)} className="font-bold text-[#b36f43]">Edit</button>
              <button disabled={pending} onClick={() => {
                if (window.confirm('Hapus ' + user.email + '?')) {
                  startTransition(async () => {
                    try { await deleteAdminUser(user.id) } catch (error) { setMessage(error instanceof Error ? error.message : 'Delete gagal.') }
                  })
                }
              }} className="font-bold text-red-700 disabled:opacity-50">Delete</button>
            </div>
            {message && <p className="text-xs text-red-700 md:col-span-7">{message}</p>}
          </div>
        )}
      </td>
    </tr>
  )
}
