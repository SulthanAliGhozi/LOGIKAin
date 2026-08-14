import { createClient } from '../../../lib/supabase/server'
import { PublishButton } from '../../components/publish-button'
import { DeleteContentButton } from '../../components/delete-content-button'

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

type ContentRow = { id: string; slug: string; name?: string; title?: string; status: string; updated_at: string | null }
const sources = [
  { table: 'content_services', label: 'Services', singular: 'service', title: 'name' },
  { table: 'content_industries', label: 'Industries', singular: 'industry', title: 'name' },
  { table: 'content_projects', label: 'Projects', singular: 'project', title: 'title' },
  { table: 'content_insights', label: 'Insights', singular: 'insight', title: 'title' },
] as const

export default async function ContentAdminPage() {
  const supabase = await createClient()
  const results = await Promise.all(sources.map(async (source) => {
    const { data, error } = await supabase.from(source.table).select(`id,slug,${source.title},status,updated_at`).order('updated_at', { ascending: false })
    return { ...source, data: (data || []) as unknown as ContentRow[], error }
  }))
  const totalCount = results.reduce((acc, curr) => acc + (curr.data?.length || 0), 0)

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">CMS</span>
      </div>
      
      <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Content & SEO</h1>
          <p className="mt-2 text-sm text-black/50">Structured content, publishing, editing, and deletion across every public content type.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
            {totalCount} total entries
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-3">
        {sources.map((source) => (
          <a key={source.table} href={`/admin/content/new?type=${source.table}`} 
             className="inline-flex items-center gap-2 rounded-lg bg-[#171717] px-4 py-2.5 text-sm font-semibold text-[#f3f0ea] hover:bg-[#b36f43] transition-colors shadow-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New {source.singular}
          </a>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {results.map((section) => (
          <section key={section.table} className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black/10 bg-black/[0.02] px-6 py-4">
              <h2 className="text-lg font-bold">{section.label}</h2>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-black/60 shadow-sm border border-black/5">
                {section.data.length} records
              </span>
            </div>
            
            {section.error ? (
              <div className="p-10 text-center text-sm text-red-700 bg-red-50/50">
                Data belum tersedia. Jalankan migration database terlebih dahulu.
              </div>
            ) : section.data.length === 0 ? (
              <div className="p-10 text-center text-sm text-black/50">
                Belum ada konten di Supabase. Jalankan seed atau buat konten baru.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="border-b border-black/5 bg-white">
                    <tr>
                      {['Title', 'Slug', 'Status', 'Last Updated', 'Actions'].map((column) => (
                        <th key={column} className="px-6 py-4 font-semibold text-black/60">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {section.data.map((row) => (
                      <tr key={row.id} className="hover:bg-black/[0.02] even:bg-black/[0.01] transition-colors">
                        <td className="px-6 py-4 font-medium">
                          <a className="hover:text-[#b36f43] transition-colors" href={`/admin/content/${row.id}?type=${section.table}`}>
                            {row.name || row.title}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-black/60">{row.slug}</td>
                        <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                        <td className="px-6 py-4 text-black/60">{formatDate(row.updated_at)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <PublishButton table={section.table} id={row.id} status={row.status} />
                            <DeleteContentButton table={section.table} id={row.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  )
}
