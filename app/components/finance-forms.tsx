'use client'

import { useState, useTransition } from 'react'
import { createInvoice, createQuote, recordPayment, updateInvoice, updateQuote } from '../actions/admin'
import { AdminActionGroup, AdminEditIcon, AdminDeleteIcon, AdminViewIcon } from './admin-actions'
import { InvoicePicker } from './invoice-picker'
import { EntityPicker } from './entity-picker'

type FinanceData = {
  id?: string;
  invoice_number?: string;
  quote_number?: string;
  client_id?: string;
  lead_id?: string;
  project_id?: string;
  total_minor?: number;
  issued_at?: string;
  due_at?: string;
  valid_until?: string;
  status?: string;
};

export function FinanceForm({ type, initialData }: { type: 'quote' | 'invoice' | 'payment', initialData?: FinanceData }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('')
  const isEdit = !!initialData?.id;

  return (
    <div className="border border-black/10 bg-white/50 p-5">
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => { 
        event.preventDefault(); 
          const raw = Object.fromEntries(new FormData(event.currentTarget)); 
          startTransition(async () => { 
            try { 
              if (type === 'quote') {
                if (isEdit) await updateQuote({ id: initialData.id, ...raw, total_minor: Number(raw.total_minor) });
                else await createQuote({ ...raw, total_minor: Number(raw.total_minor) }); 
              } else if (type === 'invoice') {
                if (isEdit) await updateInvoice({ id: initialData.id, ...raw, total_minor: Number(raw.total_minor) });
                else await createInvoice({ ...raw, total_minor: Number(raw.total_minor) }); 
              } else {
                await recordPayment({ ...raw, amount_minor: Number(raw.amount_minor) }); 
              }
              setMessage('Saved.'); 
              if (!isEdit) (event.currentTarget as HTMLFormElement).reset();
            } catch (err: unknown) { 
              setMessage('Could not save record: ' + (err instanceof Error ? err.message : String(err)));
            } 
          }) 
        }}>
          {type === 'payment' ? (
            <InvoicePicker name="invoice_id" defaultValue={initialData?.invoice_number || ''} />
          ) : (
            <input required defaultValue={initialData?.invoice_number || initialData?.quote_number} name={type === 'quote' ? 'quote_number' : 'invoice_number'} placeholder={`${type} number`} className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
          )}
          {type !== 'payment' && (
            <EntityPicker required name="client_id" entity="clients" defaultValue={initialData?.client_id} placeholder="Pilih Client..." />
          )}
          {type === 'quote' && (
            <EntityPicker name="lead_id" entity="leads" defaultValue={initialData?.lead_id} placeholder="Pilih Lead (Opsional)..." />
          )}
          {type === 'invoice' && (
            <EntityPicker name="project_id" entity="business_projects" defaultValue={initialData?.project_id} placeholder="Pilih Project (Opsional)..." />
          )}
          <input required defaultValue={initialData?.total_minor} type="number" min="0" name={type === 'payment' ? 'amount_minor' : 'total_minor'} placeholder="Amount in minor units" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
          {type === 'invoice' ? (
            <>
              <input defaultValue={initialData?.issued_at ? initialData.issued_at.substring(0, 10) : ''} name="issued_at" type="date" aria-label="Issue date" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
              <input defaultValue={initialData?.due_at ? initialData.due_at.substring(0, 10) : ''} name="due_at" type="date" aria-label="Due date" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
            </>
          ) : type === 'quote' ? (
            <input defaultValue={initialData?.valid_until ? initialData.valid_until.substring(0, 10) : ''} name="valid_until" type="date" className="border border-black/15 bg-transparent px-3 py-3 text-xs" />
          ) : null}
          <div className="flex gap-2 sm:col-span-2">
            <button disabled={pending} type="submit" className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">
              {pending ? 'Saving...' : 'Save'}
            </button>
          </div>
          {message && <p className="text-xs text-[#b36f43] sm:col-span-2">{message}</p>}
        </form>
    </div>
  )
}

export function FinanceList({ type, data }: { type: 'quote' | 'invoice', data: FinanceData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead className="border-b border-black/10 bg-black/5">
          <tr>
            <th className="px-5 py-4 font-bold uppercase tracking-wider text-black/50">ID / Number</th>
            <th className="px-5 py-4 font-bold uppercase tracking-wider text-black/50">Client ID</th>
            <th className="px-5 py-4 font-bold uppercase tracking-wider text-black/50">Status</th>
            <th className="px-5 py-4 font-bold uppercase tracking-wider text-black/50">Total</th>
            <th className="px-5 py-4 font-bold uppercase tracking-wider text-black/50">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-black/50">No data found.</td>
            </tr>
          )}
          {data.map((row) => (
            <tr key={row.id} className="border-b border-black/10 last:border-0">
              <td className="px-5 py-4 font-medium">{row.invoice_number || row.quote_number}</td>
              <td className="px-5 py-4">{row.client_id}</td>
              <td className="px-5 py-4">{row.status}</td>
              <td className="px-5 py-4">{row.total_minor}</td>
              <td className="px-5 py-4">
                <AdminActionGroup>
                  <AdminViewIcon href={`/admin/${type === 'quote' ? 'quotations' : 'invoices'}/${row.id}`} />
                  <AdminEditIcon href={`/admin/${type === 'quote' ? 'quotations' : 'invoices'}/${row.id}/edit`} />
                  {row.id && <AdminDeleteIcon id={row.id} kind={type} />}
                </AdminActionGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
