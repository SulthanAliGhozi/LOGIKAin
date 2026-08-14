'use client'

import { useState, useTransition } from 'react'
import { createAdminUser } from '../actions/admin'

export function InviteUserForm({ disabled = false }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  return (
    <section className="border border-black/10 bg-white/50 p-5">
      <button disabled={disabled} onClick={() => setOpen(!open)} className="text-xs font-bold text-[#b36f43] disabled:opacity-50">
        {open ? 'Tutup form' : '+ Buat user baru'}
      </button>
      {open && (
        <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={(event) => {
          event.preventDefault()
          const target = event.currentTarget
          const form = new FormData(target)
          setMessage('')
          startTransition(async () => {
            try {
              await createAdminUser({
                username: form.get('username'),
                full_name: form.get('full_name'),
                email: form.get('email'),
                password: form.get('password'),
                roles: form.getAll('roles'),
                status: form.get('status'),
              })
              setMessage('User berhasil dibuat dan bisa langsung login.')
              target.reset()
            } catch (error) {
              setMessage(error instanceof Error ? error.message : 'User gagal dibuat.')
            }
          })
        }}>
          <input required name="username" placeholder="Username" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
          <input required name="full_name" placeholder="Nama lengkap" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
          <input required type="email" name="email" placeholder="Email" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
          <input required minLength={8} type="password" name="password" placeholder="Password minimal 8 karakter" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
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
                <input type="checkbox" name="roles" value={r.value} defaultChecked={r.value === 'client'} className="rounded border-black/20 text-[#b36f43] focus:ring-[#b36f43]" />
                {r.label}
              </label>
            ))}
          </div>
          <select name="status" defaultValue="active" className="border border-black/15 bg-[#f3f0ea] px-3 py-3 text-xs">
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="suspended">Suspended</option>
          </select>
          <button disabled={pending} className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">
            {pending ? 'Membuat...' : 'Buat user'}
          </button>
          {message && <p className="text-xs text-[#b36f43] sm:col-span-2">{message}</p>}
        </form>
      )}
    </section>
  )
}
