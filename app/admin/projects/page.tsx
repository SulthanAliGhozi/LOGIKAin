import Link from 'next/link'
import { createClient } from '../../../lib/supabase/server'
import { ProjectForm } from '../../components/admin-forms'
import { AdminActionGroup, AdminViewIcon, AdminEditIcon, AdminDeleteIcon } from '../../components/admin-actions'

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() || ''
  let color = 'bg-gray-100 text-gray-700'
  if (['active', 'in_progress'].includes(s)) color = 'bg-blue-100 text-blue-700'
  else if (['completed', 'delivered'].includes(s)) color = 'bg-green-100 text-green-700'
  else if (['on_hold', 'delayed'].includes(s)) color = 'bg-amber-100 text-amber-700'
  else if (['cancelled'].includes(s)) color = 'bg-red-100 text-red-700'
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}>{status || 'Unknown'}</span>
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function ProjectsAdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('business_projects').select('*').order('created_at', { ascending: false });
  const count = data?.length || 0;

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <Link href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</Link>
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
        <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          {count} projects
        </div>
      </div>

      <div className="mb-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm" id="form-section">
        <ProjectForm />
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {error ? (
          <div className="p-12 text-center text-sm text-red-700 bg-red-50">
            Data belum tersedia. Jalankan migration database.
          </div>
        ) : count === 0 ? (
          <div className="p-12 text-center text-sm text-black/50">
            Belum ada proyek. Tambahkan proyek baru untuk memulai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02]">
                <tr>
                  {['Name', 'Status', 'Start Date', 'Target Date', 'Created', 'Action'].map((column) => (
                    <th key={column} className="px-6 py-4 font-semibold text-black/60">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(data || []).map((row) => (
                  <tr key={row.id} className="hover:bg-black/[0.02] even:bg-black/[0.01] transition-colors align-top">
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/admin/projects/${row.id}`} className="hover:text-[#b36f43] transition-colors">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-6 py-4 text-black/60">{formatDate(row.start_date)}</td>
                    <td className="px-6 py-4 text-black/60">{formatDate(row.target_date)}</td>
                    <td className="px-6 py-4 text-black/60">{formatDate(row.created_at)}</td>
                    <td className="px-6 py-4">
                      <AdminActionGroup>
                        <AdminViewIcon href={`/admin/projects/${row.id}`} />
                        <AdminEditIcon href={`/admin/projects/${row.id}/edit`} />
                        <AdminDeleteIcon id={row.id} kind="project" />
                      </AdminActionGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
