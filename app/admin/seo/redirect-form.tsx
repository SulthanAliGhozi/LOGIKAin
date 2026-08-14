'use client'
import { useState, useTransition } from 'react'
import { createRedirect, updateRedirect } from '../../actions/admin'

type RedirectData = {
  id?: string
  source_path: string
  target_path: string
  status_code: number
  reason?: string
}

export function RedirectForm({ initialData }: { initialData?: RedirectData }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  return (
    <form className="grid gap-3 border border-black/10 bg-white/50 p-5 sm:grid-cols-2" onSubmit={(event) => { 
      event.preventDefault()
      const form = event.currentTarget
      const raw = Object.fromEntries(new FormData(form))
      startTransition(async () => { 
        try { 
          if (initialData?.id) {
            await updateRedirect({ ...raw, id: initialData.id })
            setMessage('Redirect updated.')
          } else {
            await createRedirect(raw)
            setMessage('Redirect saved.')
            form.reset() 
          }
        } catch (error) { 
          setMessage(error instanceof Error ? error.message : 'Could not save redirect.') 
        } 
      }) 
    }}>
      <div className="sm:col-span-2 flex items-center justify-between mb-2">
        <h3 className="font-bold">{initialData ? 'Edit Redirect' : 'Create Redirect'}</h3>
        {initialData && (
          <a href="/admin/seo" className="text-xs text-black/50 hover:text-black">Cancel Edit</a>
        )}
      </div>

      <input required name="source_path" defaultValue={initialData?.source_path || ''} placeholder="/old-path" className="border border-black/15 bg-transparent p-3 text-xs" />
      <input required name="target_path" defaultValue={initialData?.target_path || ''} placeholder="/new-path" className="border border-black/15 bg-transparent p-3 text-xs" />
      <select name="status_code" defaultValue={initialData?.status_code || "301"} className="border border-black/15 bg-transparent p-3 text-xs">
        <option value="301">301 Permanent</option>
        <option value="302">302 Temporary</option>
      </select>
      <input name="reason" defaultValue={initialData?.reason || ''} placeholder="Reason" className="border border-black/15 bg-transparent p-3 text-xs" />
      
      <button disabled={pending} className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">
        {pending ? 'Saving...' : initialData ? 'Update redirect' : 'Create redirect'}
      </button>
      
      {message && <p className="text-xs text-[#b36f43] sm:col-span-2">{message}</p>}
    </form> 
  )
}
