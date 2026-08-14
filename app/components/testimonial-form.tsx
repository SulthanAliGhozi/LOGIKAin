'use client'
import { useState, useTransition } from 'react'
import { createTestimonial, updateTestimonial } from '../actions/admin'

type TestimonialData = {
  id?: string
  quote: string
  author_name: string
  author_role?: string
  company_name?: string
  featured?: boolean
}

export function TestimonialForm({ initialData }: { initialData?: TestimonialData }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  return (
    <form 
      className="grid gap-3 border border-black/10 bg-white/50 p-5" 
      onSubmit={(event) => { 
        event.preventDefault()
        const form = event.currentTarget
        const raw = Object.fromEntries(new FormData(form))
        
        startTransition(async () => { 
          try { 
            if (initialData?.id) {
              await updateTestimonial({ ...raw, id: initialData.id, featured: raw.featured === 'on' })
              setMessage('Testimonial updated.')
            } else {
              await createTestimonial({ ...raw, featured: raw.featured === 'on' })
              setMessage('Testimonial created.')
              form.reset() 
            }
          } catch (error) { 
            setMessage(error instanceof Error ? error.message : 'Could not save testimonial.') 
          } 
        }) 
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">{initialData ? 'Edit Testimonial' : 'Create New Testimonial'}</h3>
        {initialData && (
          <a href="/admin/testimonials" className="text-xs text-black/50 hover:text-black">Cancel Edit</a>
        )}
      </div>

      <textarea required name="quote" defaultValue={initialData?.quote || ''} placeholder="Customer quote" rows={4} className="border border-black/15 bg-transparent p-3 text-sm" />
      <input required name="author_name" defaultValue={initialData?.author_name || ''} placeholder="Author name" className="border border-black/15 bg-transparent p-3 text-sm" />
      <input name="author_role" defaultValue={initialData?.author_role || ''} placeholder="Role" className="border border-black/15 bg-transparent p-3 text-sm" />
      <input name="company_name" defaultValue={initialData?.company_name || ''} placeholder="Company" className="border border-black/15 bg-transparent p-3 text-sm" />
      
      <label className="flex items-center gap-2 text-xs mt-2">
        <input type="checkbox" name="featured" defaultChecked={initialData?.featured} /> Featured
      </label>
      
      <button disabled={pending} className="mt-2 w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">
        {pending ? 'Saving...' : initialData ? 'Update Testimonial' : 'Save Testimonial'}
      </button>
      
      {message && <p className="mt-2 text-xs text-[#b36f43] font-bold">{message}</p>}
    </form> 
  )
}
