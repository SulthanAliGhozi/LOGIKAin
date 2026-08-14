import { createClient } from '../../../lib/supabase/server'
import { RedirectForm } from './redirect-form'
import { AdminDeleteButton } from '../../components/admin-delete-button'

function StatusBadge({ code }: { code: number }) {
  let color = 'bg-gray-100 text-gray-700'
  if (code === 301) color = 'bg-blue-100 text-blue-800'
  else if (code === 302) color = 'bg-amber-100 text-amber-800'
  else if (code === 410) color = 'bg-red-100 text-red-800'
  return <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold font-mono ${color}`}>{code}</span>
}

export default async function SeoAdminPage({ searchParams }: { searchParams: { edit?: string } }) { 
  const supabase = await createClient(); 
  const { data, error } = await supabase.from('redirects').select('id,source_path,target_path,status_code,reason,created_at').order('created_at', { ascending: false }); 
  const count = data?.length || 0;

  const editId = searchParams?.edit
  const editData = editId ? data?.find(t => t.id === editId) : undefined

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">GROWTH</span>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">SEO & Redirects</h1>
          <p className="mt-2 text-sm text-black/50">Manage permanent URL changes while keeping canonical and sitemap integrity.</p>
        </div>
        <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          {count} active redirects
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm" id="form-section">
        <RedirectForm initialData={editData} />
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {error ? (
          <div className="p-12 text-center text-sm text-red-700 bg-red-50">
            Redirect table unavailable.
          </div>
        ) : count === 0 ? (
          <div className="p-12 text-center text-sm text-black/50">
            Belum ada redirect rule.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02]">
                <tr>
                  {['Source Path', 'Target Path', 'Status', 'Reason', 'Actions'].map((x) => (
                    <th key={x} className="px-6 py-4 font-semibold text-black/60">{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(data || []).map((row) => (
                  <tr key={row.id} className="hover:bg-black/[0.02] even:bg-black/[0.01] transition-colors align-top">
                    <td className="px-6 py-4 font-mono font-medium text-xs text-black/80">{row.source_path}</td>
                    <td className="px-6 py-4 font-mono text-xs text-black/60">
                      <div className="flex items-center gap-2">
                        <span className="text-black/30">→</span>
                        {row.target_path}
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge code={row.status_code} /></td>
                    <td className="px-6 py-4 text-black/60">{row.reason || '—'}</td>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <a href={`/admin/seo?edit=${row.id}#form-section`} className="text-xs font-bold text-[#b36f43] hover:underline">Edit</a>
                      <AdminDeleteButton id={row.id} kind="redirect" />
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
