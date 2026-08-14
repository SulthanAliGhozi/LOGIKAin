import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { createClient } from '../../lib/supabase/server'
import { LogoutButton } from '../components/logout-button'

const STAFF_ROLES = ['editor', 'sales', 'project_member', 'finance', 'support', 'admin', 'owner']

export async function portalScope() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=%2Fportal')
  const { data: profile } = await supabase.from('profiles').select('role, status, full_name, username').eq('id', user.id).maybeSingle()
  const isStaff = profile && STAFF_ROLES.includes(profile.role) && profile.status === 'active'
  const { data: memberships } = await supabase.from('client_memberships').select('client_id,portal_role').eq('user_id', user.id).eq('status', 'active')
  return { supabase, user, profile, isStaff, memberships: memberships || [], clientIds: (memberships || []).map((item) => item.client_id) }
}

export function PortalHeader({ title, description }: { title: string; description: string }) {
  return <><header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 bg-[#171717] px-6 py-5 text-[#f3f0ea] md:px-10"><a href="/portal" className="text-xl font-extrabold tracking-[-1.5px]">LOGIKA<span className="text-[#b36f43]">in</span></a><nav className="order-3 flex w-full gap-4 text-[11px] text-white/55 md:order-2 md:w-auto"><a href="/portal/projects" className="hover:text-white">Projects</a><a href="/portal/invoices" className="hover:text-white">Invoices</a><a href="/portal/support" className="hover:text-white">Support</a></nav><div className="flex items-center gap-4 md:order-3"><span className="hidden rounded-full border border-white/20 px-3 py-2 text-xs sm:inline">Client portal</span><LogoutButton /></div></header><section className="border-b border-black/10 px-6 py-10 md:px-10"><p className="mono text-[10px] text-[#b36f43]">LOGIKAin / PORTAL</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">{title}</h1><p className="mt-2 text-sm text-black/55">{description}</p></section></>
}

export function PortalShell({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-[#f3f0ea] text-[#171717]"><PortalHeader title="Your project space." description="Progress, commercial documents, files, approvals, and support in one place." />{children}</main>
}
