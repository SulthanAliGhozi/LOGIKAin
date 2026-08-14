'use client'

import { useState, useTransition } from 'react'
import { createAdminLead, createAdminProject, updateLead, updateAdminProject } from '../actions/admin'
import { EntityPicker } from './entity-picker'

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

type ProjectData = {
  id?: string
  name: string
  client_id?: string
  description?: string
  status?: string
}

export function ProjectForm({ initialData }: { initialData?: ProjectData }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  return (
    <form className="grid gap-3" onSubmit={(event) => { 
      event.preventDefault()
      const target = event.currentTarget
      const form = new FormData(target)
      setMessage('')
      startTransition(async () => { 
        try { 
          if (initialData?.id) {
            await updateAdminProject({ 
              id: initialData.id, 
              name: form.get('name'), 
              client_id: form.get('client_id') || undefined,
              description: form.get('description'),
              status: form.get('status') || initialData.status
            })
            setMessage('Project updated.')
          } else {
            await createAdminProject({ 
              name: form.get('name'), 
              client_id: form.get('client_id') || undefined,
              description: form.get('description') 
            })
            setMessage('Project created.')
            target.reset() 
          }
        } catch { 
          setMessage('Save failed.') 
        } 
      }) 
    }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">{initialData ? 'Edit Project' : 'Create New Project'}</h3>
      </div>
      <input required name="name" defaultValue={initialData?.name || ''} placeholder="Project name" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
      <EntityPicker name="client_id" entity="clients" defaultValue={initialData?.client_id} placeholder="Pilih Client (Opsional)..." />
      <textarea name="description" defaultValue={initialData?.description || ''} placeholder="Description" className="border border-black/15 bg-transparent px-3 py-3 text-xs" rows={3} />
      {initialData && (
        <select name="status" defaultValue={initialData.status} className="border border-black/15 bg-transparent px-3 py-3 text-xs">
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      )}
      <button disabled={pending} className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">
        {pending ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
      </button>
      {message && <p className="text-xs text-[#b36f43]">{message}</p>}
    </form>
  )
}
