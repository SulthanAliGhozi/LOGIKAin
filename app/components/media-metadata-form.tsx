'use client'

import { useState, useTransition } from 'react'
import { updateMediaAsset } from '../actions/admin'

export function MediaMetadataForm({ id, altText, decorative }: { id: string; altText: string | null; decorative: boolean }) {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  return <form className="flex min-w-[280px] flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); startTransition(async () => { try { await updateMediaAsset({ id, alt_text: values.alt_text, is_decorative: values.is_decorative === 'on' }); setMessage('Saved') } catch { setMessage('Failed') } }) }}><input name="alt_text" defaultValue={altText || ''} placeholder="Describe image" className="min-w-[180px] border border-black/15 bg-transparent px-2 py-2 text-[10px]" /><label className="flex items-center gap-1 text-[10px]"><input type="checkbox" name="is_decorative" defaultChecked={decorative} /> decorative</label><button disabled={pending} className="bg-[#171717] px-2 py-2 text-[10px] text-[#f3f0ea]">Save</button>{message && <span className="self-center text-[10px] text-[#b36f43]">{message}</span>}</form>
}
