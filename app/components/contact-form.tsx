'use client'

import { useActionState } from 'react'
import { sendContact, type ContactState } from '../actions/contact'

const initialState: ContactState = { ok: false, message: '' }

export function ContactForm({ projectBrief = false }: { projectBrief?: boolean }) {
  const [state, action, pending] = useActionState(sendContact, initialState)
  if (state.ok) return <p className="border border-paper/40 p-4 text-sm text-paper">{state.message}</p>
  return <form action={action} className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
    <label className="sr-only" htmlFor="contact-name">Nama</label><input id="contact-name" required name="name" placeholder="Nama Anda" className="border border-ink/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink/60 focus:border-paper" />
    <label className="sr-only" htmlFor="contact-email">Email</label><input id="contact-email" required type="email" name="email" placeholder="Email" className="border border-ink/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink/60 focus:border-paper" />
    {projectBrief && <><input name="company" placeholder="Perusahaan" className="border border-ink/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink/60 focus:border-paper" /><input name="phone" placeholder="Nomor telepon (opsional)" className="border border-ink/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink/60 focus:border-paper" /><select required name="service" defaultValue="" className="border border-ink/30 bg-orange px-4 py-3 text-sm outline-none focus:border-paper"><option value="" disabled>Pilih kebutuhan utama</option><option>Business System</option><option>AI & Automation</option><option>Digital Product</option><option>Other</option></select><select required name="budget" defaultValue="" className="border border-ink/30 bg-orange px-4 py-3 text-sm outline-none focus:border-paper"><option value="" disabled>Rentang budget</option><option>Belum ditentukan</option><option>Di bawah Rp25 juta</option><option>Rp25–100 juta</option><option>Di atas Rp100 juta</option></select><select required name="timeline" defaultValue="" className="border border-ink/30 bg-orange px-4 py-3 text-sm outline-none focus:border-paper"><option value="" disabled>Target waktu</option><option>Secepatnya</option><option>1–3 bulan</option><option>3–6 bulan</option><option>Fleksibel</option></select></>}
    <textarea required name="message" placeholder={projectBrief ? 'Konteks, target, dan masalah yang ingin dibenahi' : 'Ceritakan kebutuhan Anda'} rows={4} className="border border-ink/30 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink/60 focus:border-paper sm:col-span-2" />
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" /><button disabled={pending} className="w-fit bg-paper px-5 py-4 text-xs font-bold disabled:opacity-60 sm:col-span-2">{pending ? 'Mengirim...' : 'Mulai ngobrol →'}</button>{state.message && !state.ok && <p className="text-xs text-ink sm:col-span-2">{state.message}</p>}
  </form>
}
