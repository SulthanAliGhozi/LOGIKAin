import { notFound } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { ProjectOpsForms } from '../../../components/project-ops-forms'
import { ProjectFileUploader } from '../../../components/project-file-uploader'
import { ProjectForm } from '../../../components/admin-forms'
import { AdminDeleteButton } from '../../../components/admin-delete-button'

export default async function ProjectDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ edit?: string }> }) {
  const { id } = await params
  const { edit } = await searchParams
  const supabase = await createClient()
  const [{ data: project }, { data: milestones }, { data: tasks }, { data: approvals }, { data: files }] = await Promise.all([
    supabase.from('business_projects').select('*').eq('id', id).single(),
    supabase.from('project_milestones').select('*').eq('project_id', id).order('target_date'),
    supabase.from('project_tasks').select('*').eq('project_id', id).order('created_at', { ascending: false }),
    supabase.from('project_approvals').select('*').eq('project_id', id).order('requested_at', { ascending: false }),
    supabase.from('project_files').select('id,filename,size_bytes,client_visible,created_at').eq('project_id', id).order('created_at', { ascending: false }),
  ])
  
  if (!project) notFound()
    
  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <a href="/admin/projects" className="text-xs text-black/50">← Back to projects</a>
      
      {edit === 'true' ? (
        <div className="mt-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm">
          <ProjectForm initialData={project} />
          <div className="mt-4 pt-4 border-t border-black/10">
            <a href={`/admin/projects/${id}`} className="text-xs font-bold text-black/50 mr-4 hover:text-black">Cancel Edit</a>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-black/10 pb-6">
          <div>
            <p className="mono text-[10px] text-[#b36f43]">LOGIKAin / PROJECT DELIVERY</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">{project.name}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-black/55">{project.description || 'No project description yet.'}</p>
            <div className="mt-4 flex gap-4 items-center">
              <a href={`/admin/projects/${id}?edit=true`} className="text-xs font-bold text-[#b36f43] hover:underline">Edit Project</a>
              <AdminDeleteButton id={id} kind="project" />
            </div>
          </div>
          <span className="rounded-full bg-[#b36f43]/10 px-3 py-2 text-xs capitalize text-[#8c542f] font-bold tracking-wide">{project.status}</span>
        </div>
      )}

      <div className="mt-10"><ProjectOpsForms projectId={id} /></div>
      <div className="mt-10 grid gap-4 xl:grid-cols-4">
        <section className="border border-black/10 bg-white/50 p-5"><h2 className="font-bold">Milestones</h2>{milestones?.length ? milestones.map((item) => <div key={item.id} className="mt-5 border-t border-black/10 pt-4"><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs text-black/50">{item.status} · {item.target_date || 'No date'}</p></div>) : <p className="mt-5 text-xs text-black/50">No milestones yet.</p>}</section>
        <section className="border border-black/10 bg-white/50 p-5"><h2 className="font-bold">Tasks</h2>{tasks?.length ? tasks.map((item) => <div key={item.id} className="mt-5 border-t border-black/10 pt-4"><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs text-black/50">{item.status}{item.client_visible ? ' · client visible' : ''}</p></div>) : <p className="mt-5 text-xs text-black/50">No tasks yet.</p>}</section>
        <section className="border border-black/10 bg-white/50 p-5"><h2 className="font-bold">Approvals</h2>{approvals?.length ? approvals.map((item) => <div key={item.id} className="mt-5 border-t border-black/10 pt-4"><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs capitalize text-[#b36f43]">{item.status}</p></div>) : <p className="mt-5 text-xs text-black/50">No approval requests yet.</p>}</section>
        <section className="border border-black/10 bg-white/50 p-5"><h2 className="font-bold">Files</h2>{files?.length ? files.map((file) => <div key={file.id} className="mt-5 border-t border-black/10 pt-4"><p className="break-all text-sm font-bold">{file.filename}</p><p className="mt-1 text-xs text-black/50">{file.client_visible ? 'Client visible' : 'Internal'} · {file.size_bytes ? `${Math.ceil(file.size_bytes / 1024)} KB` : '—'}</p></div>) : <p className="mt-5 text-xs text-black/50">No project files yet.</p>}
        <div className="mt-5"><ProjectFileUploader projectId={id} /></div></section>
      </div>
    </main>
  )
}
