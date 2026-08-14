import Link from 'next/link'
import { createClient } from '../../../lib/supabase/server'
import { LeadForm } from '../../components/admin-forms'
import { ConvertLeadButton } from '../../components/lead-actions'
import { AdminActionGroup, AdminEditIcon, AdminDeleteIcon } from '../../components/admin-actions'

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  let color = 'bg-gray-100 text-gray-700'
  if (['active', 'published', 'paid'].includes(s)) color = 'bg-green-100 text-green-700'
  else if (['pending', 'draft', 'invited'].includes(s)) color = 'bg-amber-100 text-amber-700'
  else if (['suspended', 'overdue', 'cancelled'].includes(s)) color = 'bg-red-100 text-red-700'
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}>{status}</span>
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function LeadsAdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('leads').select('id,name,email,brief,status,source,created_at').order('created_at', { ascending: false });
  const count = data?.length || 0;

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <Link href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</Link>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">CRM</span>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Lead pipeline</h1>
          <p className="mt-2 text-sm text-black/50">Qualify, convert, and keep the sales lifecycle traceable.</p>
        </div>
        <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          {count} leads in pipeline
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm" id="form-section">
        <LeadForm />
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {error ? (
          <div className="p-12 text-center text-sm text-red-700 bg-red-50">
            Data belum tersedia. Jalankan migration database.
          </div>
        ) : count === 0 ? (
          <div className="p-12 text-center text-sm text-black/50">
            Belum ada leads. Tambahkan lead baru untuk memulai pipeline.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02]">
                <tr>
                  {['Name', 'Email', 'Status', 'Source', 'Created', 'Action'].map((column) => (
                    <th key={column} className="px-6 py-4 font-semibold text-black/60">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(data || []).map((row) => (
                  <tr key={row.id} className="hover:bg-black/[0.02] even:bg-black/[0.01] transition-colors align-top">
                    <td className="px-6 py-4 font-medium">{row.name}</td>
                    <td className="px-6 py-4 text-black/60">{row.email}</td>
                    <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-6 py-4 capitalize text-black/60">{row.source}</td>
                    <td className="px-6 py-4 text-black/60">{formatDate(row.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-3">
                        <ConvertLeadButton leadId={row.id} status={row.status} />
                        <AdminActionGroup>
                          <AdminEditIcon href={`/admin/leads/${row.id}/edit`} />
                          <AdminDeleteIcon id={row.id} kind="lead" />
                        </AdminActionGroup>
                      </div>
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
