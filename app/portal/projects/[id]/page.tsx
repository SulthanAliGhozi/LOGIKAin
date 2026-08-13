import { notFound } from 'next/navigation'
import { portalScope, PortalShell } from '../../_lib'
import { ProjectFeedbackForm } from '../../../components/project-feedback-form'

export const metadata = { robots: { index: false, follow: false } }

export default async function PortalProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, clientIds } = await portalScope()
  const { data: project } = clientIds.length
    ? await supabase.from('business_projects').select('id,name,status,description,start_date,target_date').eq('id', id).in('client_id', clientIds).maybeSingle()
    : { data: null }
  if (!project) notFound()
  const [{ data: milestones }, { data: tasks }, { data: files }, { data: approvals }] = await Promise.all([
    supabase.from('project_milestones').select('id,title,description,status,target_date').eq('project_id', id).eq('client_visible', true).order('target_date'),
    supabase.from('project_tasks').select('id,title,status,due_date').eq('project_id', id).eq('client_visible', true).order('due_date'),
    supabase.from('project_files').select('id,filename,size_bytes,created_at').eq('project_id', id).eq('client_visible', true).order('created_at', { ascending: false }),
    supabase.from('project_approvals').select('id,title,request_note,status,requested_at').eq('project_id', id).order('requested_at', { ascending: false }),
  ])
  return <PortalShell><section className="p-6 md:p-10"><a href="/portal/projects" className="text-xs text-black/50">← Back to projects</a><div className="mt-8"><p className="mono text-[9px] text-[#b36f43]">PROJECT DELIVERY</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">{project.name}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">{project.description || 'No description yet.'}</p><p className="mt-4 text-xs capitalize text-[#b36f43]">{project.status} · {project.start_date || 'Start date pending'} → {project.target_date || 'Target pending'}</p></div><div className="mt-10 grid gap-4 lg:grid-cols-2"><section className="border border-black/10 bg-white/50 p-5"><h2 className="font-bold">Milestones</h2>{milestones?.length ? milestones.map((item) => <div key={item.id} className="mt-5 border-t border-black/10 pt-4"><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs capitalize text-[#b36f43]">{item.status} · {item.target_date || 'No date'}</p><p className="mt-2 text-xs leading-5 text-black/50">{item.description}</p></div>) : <p className="mt-5 text-xs text-black/50">No visible milestones yet.</p>}</section><section className="border border-black/10 bg-white/50 p-5"><h2 className="font-bold">Visible tasks</h2>{tasks?.length ? tasks.map((item) => <div key={item.id} className="mt-5 flex justify-between gap-3 border-t border-black/10 pt-4 text-sm"><span>{item.title}</span><span className="shrink-0 text-xs capitalize text-[#b36f43]">{item.status}</span></div>) : <p className="mt-5 text-xs text-black/50">No visible tasks yet.</p>}</section><section className="border border-black/10 bg-white/50 p-5"><h2 className="font-bold">Files</h2>{files?.length ? files.map((item) => <div key={item.id} className="mt-5 flex justify-between gap-3 border-t border-black/10 pt-4 text-xs"><span>{item.filename}</span><span className="text-black/45">{item.size_bytes ? `${Math.ceil(item.size_bytes / 1024)} KB` : '—'}</span></div>) : <p className="mt-5 text-xs text-black/50">No visible files yet.</p>}</section><section className="border border-black/10 bg-white/50 p-5"><h2 className="font-bold">Approvals</h2>{approvals?.length ? approvals.map((item) => <div key={item.id} className="mt-5 border-t border-black/10 pt-4"><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs capitalize text-[#b36f43]">{item.status}</p><p className="mt-2 text-xs leading-5 text-black/50">{item.request_note}</p></div>) : <p className="mt-5 text-xs text-black/50">No approval requests yet.</p>}<ProjectFeedbackForm projectId={id} /></section></div></section></PortalShell>
}
