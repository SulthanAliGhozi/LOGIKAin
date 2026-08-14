import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../../../lib/supabase/server'
import { LeadForm } from '../../../../components/admin-forms'

export default async function LeadEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: lead } = await supabase.from('leads').select('*').eq('id', id).single()

  if (!lead) notFound()

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <Link href="/admin/leads" className="hover:text-[#b36f43] transition-colors">← Back to Leads</Link>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">CRM</span>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Edit Lead</h1>
          <p className="mt-2 text-sm text-black/50">Update details for {lead.name}</p>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm">
        <LeadForm initialData={lead} />
      </div>
    </main>
  )
}
