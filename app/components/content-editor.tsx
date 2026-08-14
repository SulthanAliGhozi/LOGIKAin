'use client'

import { useState, useTransition } from 'react'
import { saveContent } from '../actions/admin'
import { MediaPicker } from './media-picker'

type Content = Record<string, string | number | null | undefined> & { id?: string; table: string }

const inputClass = 'border border-black/15 bg-transparent px-4 py-3 text-sm font-normal'

export function ContentEditor({ content, table }: { content?: Content; table: string }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const isProject = table === 'content_projects'
  const isInsight = table === 'content_insights'
  const nameLabel = isProject || isInsight ? 'Title' : 'Name'

  function value(key: string) { return content?.[key] ?? '' }
  function field(key: string, label: string, multiline = false, required = true) {
    return <label className="grid gap-2 text-xs font-bold" key={key}>{label}{multiline ? <textarea required={required} name={key} defaultValue={String(value(key))} rows={key === 'body' || key === 'content' || key === 'overview' ? 8 : 3} className={inputClass} /> : <input required={required} name={key} defaultValue={String(value(key))} className={inputClass} />}</label>
  }

  return <form className="grid max-w-4xl gap-4" onSubmit={(event) => {
    event.preventDefault(); const form = new FormData(event.currentTarget); const get = (key: string) => form.get(key) || ''
    const payload: Record<string, unknown> = { table, id: content?.id, slug: get('slug'), status: get('status'), seo_title: get('seo_title'), seo_description: get('seo_description'), og_image_id: get('og_image_id') || null }
    if (isProject) Object.assign(payload, { title: get('title'), short_description: get('short_description'), overview: get('overview'), problem: get('problem'), analysis: get('analysis'), solution: get('solution'), implementation: get('implementation'), results: get('results'), client_display_name: get('client_display_name'), project_year: get('project_year') || undefined })
    else if (isInsight) Object.assign(payload, { title: get('title'), excerpt: get('excerpt'), content: get('content') })
    else Object.assign(payload, { name: get('name'), summary: get('summary'), body: get('body') })
    setMessage(''); startTransition(async () => { try { await saveContent(payload); setMessage('Saved successfully.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save content.') } })
  }}>
    {field(isProject || isInsight ? 'title' : 'name', nameLabel)}
    {field('slug', 'Slug')}
    <label className="grid gap-2 text-xs font-bold">Cover / Thumbnail (Media Library)
      <MediaPicker name="og_image_id" defaultValue={String(value('og_image_id') || '')} />
    </label>
    {isProject ? <>
      {field('short_description', 'Short description', true)}{field('overview', 'Overview', true)}{field('problem', 'Problem', true, false)}{field('analysis', 'Analysis', true, false)}{field('solution', 'Solution', true, false)}{field('implementation', 'Implementation', true, false)}{field('results', 'Results', true, false)}
      <div className="grid gap-4 sm:grid-cols-2">{field('client_display_name', 'Client display name', false, false)}{field('project_year', 'Project year', false, false)}</div>
    </> : isInsight ? <>{field('excerpt', 'Excerpt', true)}{field('content', 'Content', true)}</> : <>{field('summary', 'Summary', true)}{field('body', 'Body', true)}</>}
    <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold">Status<select name="status" defaultValue={String(content?.status || 'draft')} className={`${inputClass} bg-[#f3f0ea]`}><option value="draft">Draft</option><option value="review">Review</option><option value="published">Published</option><option value="archived">Archived</option></select></label>{field('seo_title', 'SEO title', false, false)}</div>
    {field('seo_description', 'SEO description', true, false)}
    <button disabled={pending} className="w-fit bg-[#171717] px-5 py-4 text-xs font-bold text-[#f3f0ea]">{pending ? 'Saving...' : 'Save content'}</button>
    {message && <p className="text-xs text-[#b36f43]">{message}</p>}
  </form>
}
