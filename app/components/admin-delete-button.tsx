'use client'

import { useState, useTransition } from 'react'
import { deleteMediaAsset, deleteRedirect, deleteTestimonial, deleteLead, deleteAdminProject } from '../actions/admin'

const actions = { testimonial: deleteTestimonial, media: deleteMediaAsset, redirect: deleteRedirect, lead: deleteLead, project: deleteAdminProject } as const
type Kind = keyof typeof actions

export function AdminDeleteButton({ id, kind }: { id: string; kind: Kind }) {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  return <span><button disabled={pending} onClick={() => { if (window.confirm('Hapus data ini?')) startTransition(async () => { try { await actions[kind](id) } catch (error) { setMessage(error instanceof Error ? error.message : 'Gagal menghapus') } }) }} className="font-bold text-red-700 disabled:opacity-50">{pending ? '...' : 'Delete'}</button>{message && <small className="ml-2 text-red-700">{message}</small>}</span>
}
