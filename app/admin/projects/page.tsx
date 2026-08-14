import { AdminTableModule } from '../../components/admin-module'
import { ProjectForm } from '../../components/admin-forms'

export default function ProjectsAdminPage() {
  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">OPERATIONS</span>
      </div>
      
      <div className="mt-8 mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Project Delivery</h1>
          <p className="mt-2 text-sm text-black/50">Oversee active projects, timelines, and business operations.</p>
        </div>
      </div>

      <div className="mb-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm">
        <ProjectForm />
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="p-2">
          <AdminTableModule 
            title="Active Projects" 
            eyebrow="PROJECTS" 
            table="business_projects" 
            columns={['name','status','start_date','target_date','created_at']} 
            linkPrefix="/admin/projects" 
          />
        </div>
      </div>
    </main>
  )
}
