'use client'

import { useRef, useState, useTransition } from 'react'
import { uploadProjectFile } from '../actions/admin'

export function ProjectFileUploader({ projectId }: { projectId: string }) {
  const formRef = useRef<HTMLFormElement>(null); const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  return <form ref={formRef} className="grid gap-3 border-t border-black/10 pt-5" action={(formData) => { setMessage(''); startTransition(async () => { try { await uploadProjectFile(formData); setMessage('File uploaded.'); formRef.current?.reset() } catch (error) { setMessage(error instanceof Error ? error.message : 'Upload failed.') } }) }}><input type="hidden" name="project_id" value={projectId} /><input required type="file" name="file" className="text-xs" /><label className="flex items-center gap-2 text-xs"><input type="checkbox" name="client_visible" /> Visible to client</label><button disabled={pending} className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">{pending ? 'Uploading...' : 'Upload file'}</button>{message && <p className="text-xs text-[#b36f43]">{message}</p>}</form>
}
