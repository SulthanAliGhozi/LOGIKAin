import { notFound } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { ContentEditor } from '../../../components/content-editor'

const validTables = ['content_services', 'content_industries', 'content_projects', 'content_insights'] as const
type Table = typeof validTables[number]

export default async function EditContentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ type?: string }> }) {
  const { id } = await params
  const requested = (await searchParams).type
  const table: Table = validTables.includes(requested as Table) ? requested as Table : 'content_services'
  const supabase = await createClient()
  const { data } = await supabase.from(table).select('*').eq('id', id).single()
  if (!data) notFound()
  const label = table.replace('content_', '')
  return <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10"><a href="/admin/content" className="text-xs text-black/50">← Back to content</a><div className="mt-10"><p className="mono text-[10px] text-[#b36f43]">LOGIKAin / CMS / EDIT</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">Edit {label}</h1></div><div className="mt-10"><ContentEditor content={{ ...data, table }} table={table} /></div></main>
}
