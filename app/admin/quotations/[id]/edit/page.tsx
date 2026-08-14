import { createClient } from '../../../../../lib/supabase/server'
import { FinanceForm } from '../../../../components/finance-forms'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EditQuotePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient()
  const { data: quote } = await supabase.from('quotes').select('*').eq('id', id).single()
  
  if (!quote) notFound()

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50 mb-8">
        <Link href="/admin/finance" className="hover:text-[#b36f43] transition-colors">← Back to Finance</Link>
        <span>/</span>
        <span className="text-[#b36f43]">EDIT QUOTE</span>
      </div>
      
      <div className="max-w-2xl bg-white p-6 rounded-xl border border-black/10 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit Quote: {quote.quote_number}</h1>
        <FinanceForm type="quote" initialData={quote} />
      </div>
    </main>
  )
}
