'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'

export function Wordmark({ className = '' }: { className?: string }) { 
  return <span className={`font-extrabold tracking-[-1.5px] ${className}`}>LOGIKA<span className="text-orange">in</span></span> 
}

const links = [
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Solusi', href: '/services' },
  { label: 'Portofolio', href: '/projects' },
  { label: 'Insight', href: '/insights' }
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-line bg-paper/90 px-[max(6vw,24px)] backdrop-blur-md md:h-[88px]">
      <Link href="/" aria-label="LOGIKAin home">
        <Wordmark className="text-xl md:text-2xl" />
      </Link>
      
      {/* Mobile Toggle Button */}
      <button 
        className="flex p-2 md:hidden" 
        onClick={() => setOpen(!open)} 
        aria-label="Buka menu" 
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6 text-ink" /> : <Menu className="h-6 w-6 text-ink" />}
      </button>

      {/* Navigation Links */}
      <nav 
        aria-label="Navigasi utama" 
        className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-[72px] flex-col gap-2 border-b border-line bg-paper px-6 py-6 font-bold md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0`}
      >
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link 
              key={link.href} 
              href={link.href as any} 
              onClick={() => setOpen(false)} 
              className={`block px-2 py-3 text-sm transition-colors md:p-0 md:text-xs ${isActive ? 'text-orange' : 'text-[#57534d] hover:text-ink'}`}
            >
              {link.label}
            </Link>
          )
        })}
        
        <div className="my-4 h-px w-full bg-line md:my-0 md:h-6 md:w-px" />
        
        <Link href="/portal" onClick={() => setOpen(false)} className="block px-2 py-3 text-sm text-[#57534d] hover:text-ink md:p-0 md:text-xs">
          Client Portal
        </Link>
        
        <Link href="/start-project" onClick={() => setOpen(false)} className="mt-4 flex w-fit items-center gap-2 bg-ink px-6 py-3 text-xs text-paper transition-transform hover:-translate-y-0.5 hover:bg-orange md:mt-0 md:px-5 md:py-3">
          Mulai Proyek <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>
    </header>
  )
}
