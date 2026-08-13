'use client'

import { useTransition } from 'react'
import { publishContent } from '../actions/admin'

export function PublishButton({ table, id, status }: { table: string; id: string; status: string }) {
  const [pending, startTransition] = useTransition()
  if (status === 'published') return <span className="text-[10px] text-emerald-700">Published</span>
  return <button disabled={pending} onClick={() => startTransition(() => publishContent(table, id))} className="text-[10px] font-bold text-[#b36f43] disabled:opacity-50">{pending ? 'Publishing...' : 'Publish ↗'}</button>
}
