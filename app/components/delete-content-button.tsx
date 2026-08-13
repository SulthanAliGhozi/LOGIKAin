'use client'

import { useTransition } from 'react'
import { deleteContent } from '../actions/admin'

export function DeleteContentButton({ table, id }: { table: string; id: string }) {
  const [pending, startTransition] = useTransition()
  return <button disabled={pending} onClick={() => { if (window.confirm('Hapus konten ini? Tindakan ini tidak dapat dibatalkan.')) startTransition(() => deleteContent(table, id)) }} className="ml-3 text-[10px] font-bold text-red-700 disabled:opacity-50">{pending ? 'Deleting...' : 'Delete'}</button>
}
