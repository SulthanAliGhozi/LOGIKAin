import { ContentEditor } from '../../../components/content-editor'

const validTables = ['content_services', 'content_industries', 'content_projects', 'content_insights'] as const
type Table = typeof validTables[number]

export default async function NewContentPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const requested = (await searchParams).type
  const table: Table = validTables.includes(requested as Table) ? requested as Table : 'content_services'
  const label = table.replace('content_', '')
  return <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10"><a href="/admin/content" className="text-xs text-black/50">← Back to content</a><div className="mt-10"><p className="mono text-[10px] text-[#b36f43]">LOGIKAin / CMS / NEW</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">Create {label}</h1></div><div className="mt-10"><ContentEditor table={table} /></div></main>
}
