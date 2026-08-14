'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { deleteMediaAsset, deleteRedirect, deleteTestimonial, deleteLead, deleteAdminProject, deleteInvoice, deleteQuote, deleteContent } from '../actions/admin'

const deleteActions = { 
  testimonial: deleteTestimonial, 
  media: deleteMediaAsset, 
  redirect: deleteRedirect, 
  lead: deleteLead, 
  project: deleteAdminProject,
  invoice: deleteInvoice,
  quote: deleteQuote
} as const

type Kind = keyof typeof deleteActions

export function AdminDeleteIcon({ id, kind, table }: { id: string; kind: Kind | 'content'; table?: string }) {
  const [pending, startTransition] = useTransition(); 
  const [message, setMessage] = useState('')
  return (
    <span className="inline-flex items-center gap-2">
      <button 
        disabled={pending} 
        title="Delete"
        onClick={() => { 
          if (window.confirm('Hapus data ini secara permanen?')) 
            startTransition(async () => { 
              try { 
                if (kind === 'content' && table) {
                  await deleteContent(table, id)
                } else {
                  await deleteActions[kind as Kind](id)
                }
              } 
              catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal') } 
            }) 
        }} 
        className="p-1.5 text-black/40 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-red-50"
      >
        {pending ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="32" strokeDashoffset="32" strokeLinecap="round" className="opacity-50"></circle></svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        )}
      </button>
      {message && <small className="text-red-600 text-xs">{message}</small>}
    </span>
  )
}

export function AdminEditIcon({ href }: { href: string }) {
  return (
    <Link href={href as any} title="Edit" className="p-1.5 text-black/40 hover:text-[#b36f43] transition-colors rounded-md hover:bg-[#b36f43]/10">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    </Link>
  )
}

export function AdminViewIcon({ href }: { href: string }) {
  return (
    <Link href={href as any} title="View" className="p-1.5 text-black/40 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    </Link>
  )
}

export function AdminActionGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>
}
