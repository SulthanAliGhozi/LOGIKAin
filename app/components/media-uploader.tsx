'use client'

import { useState, useTransition } from 'react'
import { createBrowserSupabaseClient } from '../../lib/supabase/browser'
import { registerMediaAsset } from '../actions/admin'

export function MediaUploader() {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  return <form className="border border-black/10 bg-white/50 p-5" onSubmit={(event) => { event.preventDefault(); const input = event.currentTarget.elements.namedItem('asset') as HTMLInputElement; const file = input.files?.[0]; if (!file) return; setMessage(''); startTransition(async () => { try { const supabase = createBrowserSupabaseClient(); const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`; const { error } = await supabase.storage.from('public-media').upload(path, file, { contentType: file.type, upsert: false }); if (error) throw error; await registerMediaAsset({ storage_path: path, filename: file.name, mime_type: file.type, size_bytes: file.size, alt_text: '' }); setMessage('Asset uploaded.'); input.value = '' } catch { setMessage('Upload gagal. Pastikan Storage migration dan session sudah aktif.') } }) }}><p className="text-sm font-bold">Upload media</p><p className="mt-1 text-xs text-black/50">Marketing assets only. Add alt text in the metadata table after upload.</p><div className="mt-4 flex flex-wrap gap-3"><input required name="asset" type="file" accept="image/*,video/*,application/pdf" className="max-w-full text-xs" /><button disabled={pending} className="bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">{pending ? 'Uploading...' : 'Upload'}</button></div>{message && <p className="mt-3 text-xs text-[#b36f43]">{message}</p>}</form>
}
