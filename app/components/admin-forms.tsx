'use client'

import { useState, useTransition } from 'react'
import { createAdminLead, createAdminProject, updateLead } from '../actions/admin'

type LeadData = {
  id?: string
  name: string
  email: string
  brief?: string
  source?: string
}

export function LeadForm({ initialData }: { initialData?: LeadData }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  return (
    <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { 
      event.preventDefault()
      const target = event.currentTarget
      const form = new FormData(target)
      setMessage('')
      startTransition(async () => { 
        try { 
          if (initialData?.id) {
            await updateLead({ 
              id: initialData.id, 
              name: form.get('name'), 
              email: form.get('email'), 
              brief: form.get('brief'), 
              source: initialData.source || 'admin' 
            })
            setMessage('Lead updated.')
          } else {
            await createAdminLead({ 
              name: form.get('name'), 
              email: form.get('email'), 
              brief: form.get('brief'), 
              source: 'admin' 
            })
            setMessage('Lead created.')
            target.reset() 
          }
        } catch { 
          setMessage('Save failed.') 
        } 
      }) 
    }}>
      <div className="sm:col-span-2 flex items-center justify-between mb-2">
        <h3 className="font-bold">{initialData ? 'Edit Lead' : 'Create New Lead'}</h3>
        {initialData && (
          <a href="/admin/leads" className="text-xs text-black/50 hover:text-black">Cancel Edit</a>
        )}
      </div>
      <input required name="name" defaultValue={initialData?.name || ''} placeholder="Name" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
      <input required type="email" name="email" defaultValue={initialData?.email || ''} placeholder="Email" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
      <textarea required name="brief" defaultValue={initialData?.brief || ''} placeholder="Brief / Requirements" className="border border-black/15 bg-transparent px-3 py-3 text-xs sm:col-span-2" rows={3} />
      <button disabled={pending} className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">
        {pending ? 'Saving...' : initialData ? 'Update Lead' : 'Create Lead'}
      </button>
      {message && <p className="text-xs text-[#b36f43] sm:col-span-2">{message}</p>}
    </form>
  )
}

export function NewProjectForm() {
  const [open, setOpen] = useState(false); const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  return <div className="border border-black/10 bg-white/50 p-5"><button onClick={() => setOpen(!open)} className="text-xs font-bold text-[#b36f43]">{open ? '− Close form' : '+ Create project'}</button>{open && <form className="mt-5 grid gap-3" onSubmit={(event) => { event.preventDefault(); const target = event.currentTarget; const form = new FormData(target); setMessage(''); startTransition(async () => { try { await createAdminProject({ name: form.get('name'), description: form.get('description') }); setMessage('Project created.'); target.reset() } catch { setMessage('Project gagal dibuat.') } }) }}><input required name="name" placeholder="Project name" className="border border-black/15 bg-transparent px-3 py-3 text-xs" /><textarea name="description" placeholder="Description" className="border border-black/15 bg-transparent px-3 py-3 text-xs" rows={3} /><button disabled={pending} className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">{pending ? 'Saving...' : 'Save project'}</button>{message && <p className="text-xs text-[#b36f43]">{message}</p>}</form>}</div>
}
