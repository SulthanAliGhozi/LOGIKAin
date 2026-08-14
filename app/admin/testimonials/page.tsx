/* eslint-disable react/no-unescaped-entities */
import { createClient } from '../../../lib/supabase/server'
import { TestimonialForm } from '../../components/testimonial-form'
import { AdminDeleteButton } from '../../components/admin-delete-button'

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  let color = 'bg-gray-100 text-gray-700'
  if (['active', 'published'].includes(s)) color = 'bg-green-100 text-green-700'
  else if (['pending', 'draft'].includes(s)) color = 'bg-amber-100 text-amber-700'
  else if (['archived'].includes(s)) color = 'bg-red-100 text-red-700'
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}>{status}</span>
}

export default async function TestimonialsPage({ searchParams }: { searchParams: { edit?: string } }) {
  const supabase = await createClient(); 
  const { data, error } = await supabase.from('testimonials').select('id,quote,author_name,author_role,company_name,status,featured,created_at').order('created_at', { ascending: false })
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
        <span className="text-[#b36f43]">CONTENT</span>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Testimonials</h1>
          <p className="mt-2 text-sm text-black/50">Create, review, publish, and delete social proof.</p>
        </div>
        <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          {count} testimonials
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm" id="form-section">
        <TestimonialForm initialData={editData} />
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {error ? (
          <div className="p-12 text-center text-sm text-red-700 bg-red-50">
            Run the PRD completion migration first.
          </div>
        ) : count === 0 ? (
          <div className="p-12 text-center text-sm text-black/50">
            Belum ada testimonial.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02]">
                <tr>
                  {['Quote', 'Author', 'Status', 'Featured', 'Actions'].map((x) => (
                    <th key={x} className="px-6 py-4 font-semibold text-black/60">{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(data || []).map((row) => (
                  <tr key={row.id} className="hover:bg-black/[0.02] even:bg-black/[0.01] transition-colors align-top">
                    <td className="px-6 py-4 max-w-lg">
                      <p className="line-clamp-3 italic text-black/70">"{row.quote}"</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold">{row.author_name}</p>
                      {row.company_name && <p className="text-xs text-black/50 mt-1">{row.company_name}</p>}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-6 py-4">
                      {row.featured ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">Yes</span>
                      ) : (
                        <span className="text-black/30">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <a href={`/admin/testimonials?edit=${row.id}#form-section`} className="text-xs font-bold text-[#b36f43] hover:underline">Edit</a>
                      <AdminDeleteButton id={row.id} kind="testimonial" />
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
