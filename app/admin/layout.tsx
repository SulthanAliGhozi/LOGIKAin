import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/server'
import { createAdminClient } from '../../lib/supabase/admin'
import { LogoutButton } from '../components/logout-button'
import { AdminSidebar } from '../components/admin-sidebar'
import { allowedAdminNav } from '../../lib/auth/permissions'

export const metadata: Metadata = { robots: { index: false, follow: false } }

const STAFF_ROLES = ['editor', 'sales', 'project_member', 'finance', 'support', 'admin', 'owner']

const NAV = [
  { label: 'Overview', href: '/admin', group: null },
  { label: 'Content & SEO', href: '/admin/content', group: 'CMS' },
  { label: 'Testimonials', href: '/admin/testimonials', group: 'CMS' },
  { label: 'Media library', href: '/admin/media', group: 'CMS' },
  { label: 'SEO & redirects', href: '/admin/seo', group: 'CMS' },
  { label: 'Leads', href: '/admin/leads', group: 'CRM' },
  { label: 'Sales Sprint', href: '/admin/sales-sprint', group: 'CRM' },
  { label: 'Clients', href: '/admin/clients', group: 'CRM' },
  { label: 'Projects', href: '/admin/projects', group: 'Delivery' },
  { label: 'Delivery workspace', href: '/admin/delivery/projects', group: 'Delivery' },
  { label: 'Quotations', href: '/admin/quotations', group: 'Finance' },
  { label: 'Invoices', href: '/admin/invoices', group: 'Finance' },
  { label: 'Finance workspace', href: '/admin/finance', group: 'Finance' },
  { label: 'Support', href: '/admin/support', group: 'Support' },
  { label: 'Automation', href: '/admin/automation', group: 'System' },
  { label: 'Settings', href: '/admin/settings', group: 'System' },
  { label: 'Users & roles', href: '/admin/users', group: 'System' },
  { label: 'Activity log', href: '/admin/audit', group: 'System' },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=%2Fadmin')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status, full_name, username')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) redirect('/login?next=%2Fadmin&error=profile_error')
  if (!profile || profile.status !== 'active' || !STAFF_ROLES.includes(profile.role)) {
    redirect('/login?next=%2Fadmin&error=staff_required')
  }

  // Cek apakah ada owner/admin — banner setup
  let noOwnerYet = false
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient()
    const { count } = await admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .in('role', ['owner', 'admin'])
      .eq('status', 'active')
    noOwnerYet = (count ?? 0) === 0
  }

  const visible = allowedAdminNav(profile.role)
  const groups = [
    { label: 'CMS & Website', icon: '✦', permissions: ['content', 'media', 'seo'], items: NAV.filter((n) => n.group === 'CMS') },
    { label: 'CRM & Sales', icon: '◈', permissions: ['leads', 'clients'], items: NAV.filter((n) => n.group === 'CRM') },
    { label: 'Delivery', icon: '◉', permissions: ['delivery'], items: NAV.filter((n) => n.group === 'Delivery') },
    { label: 'Finance', icon: '◎', permissions: ['commercial', 'finance'], items: NAV.filter((n) => n.group === 'Finance') },
    { label: 'Support', icon: '⊕', permissions: ['support'], items: NAV.filter((n) => n.group === 'Support') },
    { label: 'System', icon: '⚙', permissions: ['automation', 'settings', 'users', 'audit'], items: NAV.filter((n) => n.group === 'System') },
  ].map((group) => ({ ...group, items: group.items.filter((item) => {
    if (item.href.includes('/content') || item.href.includes('/testimonials')) return visible.has('content')
    if (item.href.includes('/media')) return visible.has('media')
    if (item.href.includes('/seo')) return visible.has('seo')
    if (item.href.includes('/leads')) return visible.has('leads')
    if (item.href.includes('/clients')) return visible.has('clients')
    if (item.href.includes('/projects') || item.href.includes('/delivery')) return visible.has('delivery')
    if (item.href.includes('/quotations') || item.href.includes('/sales-sprint')) return visible.has('commercial')
    if (item.href.includes('/invoices') || item.href === '/admin/finance') return visible.has('finance')
    if (item.href.includes('/support')) return visible.has('support')
    if (item.href.includes('/automation')) return visible.has('automation')
    if (item.href.includes('/settings')) return visible.has('settings')
    if (item.href.includes('/users')) return visible.has('users')
    return visible.has('audit')
  }) })).filter((group) => group.items.length)

  return (
    <div className="min-h-screen bg-[#f3f0ea] text-[#171717]">
      {noOwnerYet && (
        <div className="flex items-center justify-between bg-[#b36f43] px-6 py-2.5 text-xs text-white">
          <span>⚠️ Belum ada owner/admin aktif — beberapa fitur tidak akan berfungsi.</span>
          <a href="/admin/setup" className="ml-4 shrink-0 font-bold underline">Setup sekarang →</a>
        </div>
      )}

      {/* Top header */}
      <header className="flex items-center justify-between border-b border-black/10 bg-[#171717] px-6 py-4 text-[#f3f0ea]">
        <Link href="/admin" className="text-xl font-extrabold tracking-[-1.5px]">
          LOGIKA<span className="text-[#b36f43]">in</span>
          <span className="ml-3 text-[10px] font-normal tracking-wider text-white/30">ADMIN</span>
        </Link>
        <div className="flex items-center gap-5 text-xs">
          <Link href="/" className="text-white/50 hover:text-white">View website ↗</Link>
          <Link href="/portal" className="text-white/50 hover:text-white">Portal ↗</Link>
          <LogoutButton />
          <span className="hidden rounded border border-white/15 px-3 py-1.5 text-white/70 md:block">
            {profile.full_name || profile.username || 'Staff'} · <span className="capitalize text-[#b36f43]">{profile.role}</span>
          </span>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <AdminSidebar groups={groups} />

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
