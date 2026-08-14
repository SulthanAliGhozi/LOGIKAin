import { AdminTableModule } from '../../components/admin-module'

export default function AutomationPage() { 
  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">SYSTEM</span>
      </div>
      
      <div className="mt-8 mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Automation Jobs</h1>
          <p className="mt-2 text-sm text-black/50">Monitor background processes and scheduled tasks.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="p-2">
          <AdminTableModule 
            title="Task Queue" 
            eyebrow="AUTOMATION" 
            table="automation_jobs" 
            columns={['type','status','attempts','run_at','last_error','finished_at']} 
          />
        </div>
      </div>
    </main>
  )
}
