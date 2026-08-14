'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

type SidebarItem = { label: string; href: string }
type SidebarGroup = { label: string; icon: string; items: SidebarItem[] }

export function AdminSidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname()
  const activeGroup = groups.findIndex((group) => group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)))
  const [openGroup, setOpenGroup] = useState(activeGroup >= 0 ? activeGroup : 0)

  return (
    <aside className="hidden w-64 shrink-0 border-r border-black/10 bg-[#eae4dc] md:block">
      <nav className="sticky top-0 max-h-[calc(100vh-57px)] overflow-y-auto px-3 py-4">
        <a href="/admin" className={`mb-3 flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold ${pathname === '/admin' ? 'bg-[#171717] text-[#f3f0ea]' : 'text-black/60 hover:bg-black/5 hover:text-black'}`}>
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#b36f43]/15 text-[#b36f43]">⌂</span>
          Overview
        </a>
        <div className="space-y-2">
          {groups.map((group, index) => {
            const isOpen = openGroup === index
            const hasActive = group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
            return (
              <div key={group.label} className="rounded-xl border border-black/[0.06] bg-white/30 p-1">
                <button type="button" onClick={() => setOpenGroup(isOpen ? -1 : index)} aria-expanded={isOpen} className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-xs font-bold ${hasActive ? 'text-[#8c542f]' : 'text-black/65 hover:bg-black/5 hover:text-black'}`}>
                  <span className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-black/[0.05] text-sm">{group.icon}</span>{group.label}</span>
                  <span className={`text-black/35 transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                </button>
                {isOpen && <div className="mb-1 mt-1 space-y-0.5 border-t border-black/[0.06] pt-1">{group.items.map((item) => { const active = pathname === item.href || pathname.startsWith(`${item.href}/`); return <a key={item.href} href={item.href} className={`block rounded-lg px-3 py-2.5 pl-12 text-xs ${active ? 'bg-[#b36f43]/10 font-bold text-[#8c542f]' : 'text-black/55 hover:bg-black/5 hover:text-black'}`}>{item.label}</a> })}</div>}
              </div>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
