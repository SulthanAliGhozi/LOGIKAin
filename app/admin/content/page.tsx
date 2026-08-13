import { createClient } from '../../../lib/supabase/server'
import { PublishButton } from '../../components/publish-button'
import { DeleteContentButton } from '../../components/delete-content-button'

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
  return <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10"><a href="/admin" className="text-xs text-black/50">← Back to overview</a><div className="mt-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end"><div><p className="mono text-[10px] text-[#b36f43]">LOGIKAin / CMS</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">Content & SEO</h1><p className="mt-2 text-sm text-black/50">Structured content, publishing, editing, and deletion across every public content type.</p></div><div className="flex flex-wrap gap-2">{sources.map((source) => <a key={source.table} href={`/admin/content/new?type=${source.table}`} className="bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">+ New {source.singular}</a>)}</div></div><div className="mt-10 space-y-8">{results.map((section) => <section key={section.table} className="overflow-x-auto border border-black/10 bg-white/50"><div className="flex items-center justify-between border-b border-black/10 px-5 py-4"><h2 className="text-sm font-bold">{section.label}</h2><span className="mono text-[10px] text-black/45">{section.data.length} records</span></div>{section.error ? <p className="p-6 text-sm text-red-700">Data belum tersedia. Jalankan migration database terlebih dahulu.</p> : section.data.length === 0 ? <p className="p-6 text-sm text-black/50">Belum ada konten di Supabase. Jalankan seed atau buat konten baru.</p> : <table className="w-full min-w-[760px] text-left text-xs"><thead className="border-b border-black/10 bg-black/5"><tr>{['title', 'slug', 'status', 'updated_at', 'action'].map((column) => <th key={column} className="px-5 py-4 font-bold uppercase tracking-wider text-black/50">{column}</th>)}</tr></thead><tbody>{section.data.map((row) => <tr key={row.id} className="border-b border-black/10 last:border-0"><td className="px-5 py-4 font-bold"><a className="hover:text-[#b36f43]" href={`/admin/content/${row.id}?type=${section.table}`}>{row.name || row.title}</a></td><td className="px-5 py-4">{row.slug}</td><td className="px-5 py-4">{row.status}</td><td className="px-5 py-4">{row.updated_at || '—'}</td><td className="whitespace-nowrap px-5 py-4"><PublishButton table={section.table} id={row.id} status={row.status} /><DeleteContentButton table={section.table} id={row.id} /></td></tr>)}</tbody></table>}</section>)}</div></main>
}
