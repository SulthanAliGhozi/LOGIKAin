import { createClient } from '../../../../../lib/supabase/server'
import { TestimonialForm } from '../../../../components/testimonial-form'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditTestimonialPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient()
  const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single()
  
  if (error || !data) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <Link href="/admin/testimonials" className="hover:text-[#b36f43] transition-colors">← Back</Link>
        <span>/</span>
        <span>Edit Testimonial</span>
      </div>
      
      <div className="mt-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Edit Testimonial</h1>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm">
        <TestimonialForm initialData={data} />
      </div>
    </main>
  )
}
