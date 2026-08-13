import { createClient } from '../../lib/supabase/server'

type Row = Record<string, unknown>

export async function AdminTableModule({ title, eyebrow, table, columns, linkPrefix }: { title: string; eyebrow: string; table: string; columns: string[]; linkPrefix?: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false }).limit(50)
  const rows = (data || []) as Row[]
  return <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10"><a href="/admin" className="text-xs text-black/50">← Back to overview</a><div className="mt-10"><p className="mono text-[10px] text-[#b36f43]">LOGIKAin / {eyebrow}</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">{title}</h1></div><div className="mt-10 overflow-x-auto border border-black/10 bg-white/50">{error ? <p className="p-6 text-sm text-red-700">Data belum tersedia. Jalankan migration database terlebih dahulu.</p> : rows.length === 0 ? <p className="p-6 text-sm text-black/50">Belum ada data di modul ini.</p> : <table className="w-full min-w-[640px] text-left text-xs"><thead className="border-b border-black/10 bg-black/5"><tr>{columns.map((column) => <th key={column} className="px-5 py-4 font-bold uppercase tracking-wider text-black/50">{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id || index)} className="border-b border-black/10 last:border-0">{columns.map((column) => <td key={column} className="px-5 py-4">{column === columns[0] && linkPrefix && row.id ? <a href={`${linkPrefix}/${String(row.id)}`} className="font-bold hover:text-[#b36f43]">{String(row[column] ?? '—')}</a> : String(row[column] ?? '—')}</td>)}</tr>)}</tbody></table>}</div></main>
}
