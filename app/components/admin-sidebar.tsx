'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LogoutButton } from './logout-button'

type SidebarItem = { label: string; href: string }
type SidebarGroup = { label: string; icon: string; items: SidebarItem[] }

export function AdminSidebar({ groups, profile }: { groups: SidebarGroup[], profile: any }) {
  const pathname = usePathname()
  const activeGroup = groups.findIndex((group) => group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)))
  const [openGroup, setOpenGroup] = useState(activeGroup >= 0 ? activeGroup : 0)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Tutup sidebar mobile kalau route berubah
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Toggle Button (Top Right Header) */}
      {!isMobileOpen && (
        <button 
          onClick={() => setIsMobileOpen(true)} 
          className="fixed top-4 right-6 z-[60] flex items-center justify-center text-3xl text-white md:hidden"
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-black/10 bg-[#eae4dc] shadow-2xl transition-transform duration-300 ease-in-out md:static md:block md:w-64 md:translate-x-0 md:shadow-none flex flex-col ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Mobile Header (Only visible on mobile) */}
        <div className="flex items-center justify-between border-b border-black/10 bg-[#171717] px-6 py-5 md:hidden">
          <span className="text-xl font-extrabold tracking-[-1.5px] text-[#f3f0ea]">
            LOGIKA<span className="text-[#b36f43]">in</span>
          </span>
          <button onClick={() => setIsMobileOpen(false)} className="text-white/60 hover:text-white">✕</button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 md:px-3 md:py-4">
          <a href="/admin" className={`mb-4 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold md:mb-3 md:px-3 md:py-3 md:text-xs ${pathname === '/admin' ? 'bg-[#171717] text-[#f3f0ea]' : 'text-black/60 hover:bg-black/5 hover:text-black'}`}>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#b36f43]/15 text-[#b36f43] md:h-7 md:w-7">⌂</span>
            Overview
          </a>
          <div className="space-y-3 md:space-y-2">
            {groups.map((group, index) => {
              const isOpen = openGroup === index
              const hasActive = group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
              return (
                <div key={group.label} className="rounded-xl border border-black/[0.06] bg-white/30 p-1.5 md:p-1">
                  <button type="button" onClick={() => setOpenGroup(isOpen ? -1 : index)} aria-expanded={isOpen} className={`flex w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-sm font-bold md:py-3 md:text-xs ${hasActive ? 'text-[#8c542f]' : 'text-black/65 hover:bg-black/5 hover:text-black'}`}>
                    <span className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-black/[0.05] text-base md:h-7 md:w-7 md:text-sm">{group.icon}</span>{group.label}</span>
                    <span className={`text-black/35 transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </button>
                  {isOpen && <div className="mb-1 mt-1 space-y-1 border-t border-black/[0.06] pt-1.5 md:space-y-0.5 md:pt-1">{group.items.map((item) => { const active = pathname === item.href || pathname.startsWith(`${item.href}/`); return <a key={item.href} href={item.href} className={`block rounded-lg px-3 py-3 pl-12 text-sm md:py-2.5 md:text-xs ${active ? 'bg-[#b36f43]/10 font-bold text-[#8c542f]' : 'text-black/55 hover:bg-black/5 hover:text-black'}`}>{item.label}</a> })}</div>}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Mobile Utility Footer (hidden on desktop) */}
        <div className="border-t border-black/10 p-4 bg-black/5 md:hidden space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold">
              {profile.username?.[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <div className="font-bold text-sm text-[#171717]">{profile.full_name || profile.username || 'Staff'}</div>
              <div className="text-xs text-[#b36f43] capitalize">{profile.role}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a href="/" className="rounded bg-white/50 px-3 py-2 text-center text-xs font-bold text-black/70 hover:bg-white hover:text-black">View Web ↗</a>
            <a href="/portal" className="rounded bg-white/50 px-3 py-2 text-center text-xs font-bold text-black/70 hover:bg-white hover:text-black">Portal ↗</a>
          </div>
          <div className="bg-red-500/10 text-red-700 text-center font-bold py-2 rounded">
            <LogoutButton />
          </div>
        </div>

      </aside>
    </>
  )
}
