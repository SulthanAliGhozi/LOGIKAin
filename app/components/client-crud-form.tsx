'use client'

import { useRef, useState, useTransition } from 'react'
import { createClientRecord, deleteClientRecord, updateClientRecord } from '../actions/admin'

type Client = { id?: string; name: string; legal_name?: string | null; email?: string | null; phone?: string | null; status: string }
const input = 'border border-black/15 bg-transparent px-3 py-2 text-xs'

export function ClientCrudForm({ client }: { client?: Client }) {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState(''); const formRef = useRef<HTMLFormElement>(null)
  return (
    <div className="border border-black/10 bg-white/50 p-4 rounded-xl">
      <form ref={formRef} className="flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const payload = { id: client?.id, name: form.get('name'), legal_name: form.get('legal_name'), email: form.get('email'), phone: form.get('phone'), status: form.get('status') }; setMessage(''); startTransition(async () => { try { if (client) await updateClientRecord(payload); else await createClientRecord(payload); setMessage(client ? 'Updated' : 'Created'); if (!client) formRef.current?.reset() } catch (error) { setMessage(error instanceof Error ? error.message : 'Save failed') } }) }}>
        <input required name="name" defaultValue={client?.name} placeholder="Client name" className={`${input} flex-1 min-w-[150px]`} />
        <input name="legal_name" defaultValue={client?.legal_name || ''} placeholder="Legal name" className={`${input} flex-1 min-w-[150px]`} />
        <input type="email" name="email" defaultValue={client?.email || ''} placeholder="Email" className={`${input} flex-1 min-w-[200px]`} />
        <input name="phone" defaultValue={client?.phone || ''} placeholder="Phone" className={`${input} flex-1 min-w-[150px]`} />
        <select name="status" defaultValue={client?.status || 'prospect'} className={`${input} bg-[#f3f0ea] w-32 shrink-0`}>
          <option value="prospect">Prospect</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
        <button disabled={pending} className="bg-[#171717] px-4 py-2 text-xs font-bold text-[#f3f0ea] shrink-0 rounded">
          {pending ? '...' : client ? 'Save' : '+ Create'}
        </button>
        {message && <span className="text-[10px] text-[#b36f43] w-full mt-1">{message}</span>}
      </form>
      {client && (
        <div className="mt-3 pt-3 border-t border-black/5 flex justify-end">
          <button disabled={pending} onClick={() => { if (window.confirm('Hapus client ini?')) startTransition(async () => { try { await deleteClientRecord(client.id!) } catch (error) { setMessage(error instanceof Error ? error.message : 'Delete failed') } }) }} className="text-xs font-bold text-red-700 hover:underline">
            Delete client
          </button>
        </div>
      )}
    </div>
  )
}
