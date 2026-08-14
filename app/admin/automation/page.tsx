import { createClient } from '../../../lib/supabase/server'
import { AdminAutomationRow } from '../../components/admin-automation-row'

export default async function AutomationPage() { 
  const supabase = await createClient()
  const { data: jobs, error } = await supabase.from('automation_jobs').select('*').order('created_at', { ascending: false }).limit(100)

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
        {error ? (
          <div className="p-12 text-center text-sm text-red-700 bg-red-50">
            Gagal mengambil data automation jobs.
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="p-12 text-center text-sm text-black/50">
            Belum ada data job.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02]">
                <tr>
                  {['Type', 'Status', 'Attempts', 'Run At', 'Last Error', 'Finished At', 'Actions'].map((column) => (
                    <th key={column} className="px-5 py-4 font-semibold text-black/60">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {jobs.map((job) => (
                  <AdminAutomationRow key={job.id} job={job as any} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
