'use client'

import { useState, useTransition } from 'react'
import { addProjectFeedback } from '../actions/portal'

export function ProjectFeedbackForm({ projectId }: { projectId: string }) {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState('')
  return <form className="mt-5 grid gap-3 border-t border-black/10 pt-5" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const values = new FormData(form); startTransition(async () => { try { await addProjectFeedback({ project_id: projectId, body: values.get('body'), rating: values.get('rating') ? Number(values.get('rating')) : undefined }); setMessage('Feedback sent.'); form.reset() } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not send feedback.') } }) }}><textarea required name="body" rows={3} placeholder="Share feedback with the delivery team" className="border border-black/15 bg-transparent p-3 text-xs" /><select name="rating" defaultValue="" className="border border-black/15 bg-[#f3f0ea] p-3 text-xs"><option value="">Rating (optional)</option>{[1,2,3,4,5].map((rating) => <option key={rating} value={rating}>{rating}/5</option>)}</select><button disabled={pending} className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">{pending ? 'Sending...' : 'Send feedback'}</button>{message && <p className="text-xs text-[#b36f43]">{message}</p>}</form>
}
