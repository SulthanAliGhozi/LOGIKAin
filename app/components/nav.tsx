'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Wordmark({ className = '' }: { className?: string }) { return <span className={`font-extrabold tracking-[-1.5px] ${className}`}>LOGIKA<span className="text-orange">in</span></span> }
const links = [['Solusi', '/#services'], ['Cara kerja', '/#process'], ['Proyek', '/#work'], ['Insight', '/#insights'], ['Kontak', '/#contact']]

export function Nav() {
  const [open, setOpen] = useState(false)
  return <header className="relative z-10 flex h-[72px] items-center justify-between border-b border-line px-[max(6vw,24px)] md:h-[88px]"><Link href="/" aria-label="LOGIKAin home"><Wordmark className="text-xl md:text-2xl" /></Link><button className="flex flex-col gap-1.5 md:hidden" onClick={() => setOpen(!open)} aria-label="Buka menu" aria-expanded={open}><span className="h-0.5 w-6 bg-ink" /><span className="h-0.5 w-6 bg-ink" /></button><nav aria-label="Navigasi utama" className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-[72px] flex-col gap-5 border-b border-line bg-paper px-6 py-6 text-xs font-bold md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0`}>{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="text-[#57534d] hover:text-ink">{label}</a>)}<Link href="/portal" onClick={() => setOpen(false)} className="text-[#57534d] hover:text-ink">Portal</Link><a href="/#contact" onClick={() => setOpen(false)} className="w-fit bg-ink px-4 py-3 text-paper">Mulai proyek <span className="ml-2 text-lg text-orange">↗</span></a></nav></header>
}
