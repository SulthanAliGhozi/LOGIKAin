'use client'

import { useTransition } from 'react'
import { publishContent, unpublishContent } from '../actions/admin'

export function PublishButton({ table, id, status }: { table: string; id: string; status: string }) {
  const [pending, startTransition] = useTransition()
  const isPublished = status === 'published'
  return (
    <button 
      disabled={pending} 
      onClick={() => startTransition(() => isPublished ? unpublishContent(table, id) : publishContent(table, id))} 
      className={`text-[10px] font-bold disabled:opacity-50 ${isPublished ? 'text-emerald-700 hover:text-emerald-900' : 'text-[#b36f43] hover:text-[#8a5533]'}`}
    >
      {pending ? (isPublished ? 'Unpublishing...' : 'Publishing...') : (isPublished ? 'Unpublish ↓' : 'Publish ↗')}
    </button>
  )
}
