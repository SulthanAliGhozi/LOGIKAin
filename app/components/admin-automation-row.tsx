'use client'

import { useTransition, useState } from 'react'
import { deleteAutomationJob, retryAutomationJob } from '../actions/admin'

type Job = { id: string; type: string; status: string; attempts: number; run_at: string | null; last_error: string | null; finished_at: string | null }

export function AdminAutomationRow({ job }: { job: Job }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  return (
    <tr className="border-b border-black/10 last:border-0">
      <td colSpan={7} className="p-0">
        <div className="grid gap-2 px-5 py-4 md:grid-cols-[1fr_1fr_0.5fr_1.5fr_1.5fr_1fr_auto] md:items-center text-sm">
          <div className="font-bold truncate">{job.type}</div>
          <div className="capitalize">{job.status}</div>
          <div>{job.attempts}</div>
          <div className="truncate">{job.run_at ? new Date(job.run_at).toLocaleString('id-ID') : '—'}</div>
          <div className="truncate text-red-600" title={job.last_error || ''}>{job.last_error || '—'}</div>
          <div className="truncate">{job.finished_at ? new Date(job.finished_at).toLocaleString('id-ID') : '—'}</div>
          <div className="flex gap-3">
            <button disabled={pending} onClick={() => {
              if (window.confirm('Retry job ' + job.type + '?')) {
                startTransition(async () => {
                  try { await retryAutomationJob(job.id) } catch (error) { setMessage(error instanceof Error ? error.message : 'Retry gagal.') }
                })
              }
            }} className="font-bold text-[#b36f43] disabled:opacity-50">Retry</button>
            <button disabled={pending} onClick={() => {
              if (window.confirm('Hapus job ' + job.type + '?')) {
                startTransition(async () => {
                  try { await deleteAutomationJob(job.id) } catch (error) { setMessage(error instanceof Error ? error.message : 'Delete gagal.') }
                })
              }
            }} className="font-bold text-red-700 disabled:opacity-50">Delete</button>
          </div>
          {message && <p className="text-xs text-red-700 md:col-span-7">{message}</p>}
        </div>
      </td>
    </tr>
  )
}
