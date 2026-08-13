import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import { createAdminClient } from '../../lib/supabase/admin'

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=%2Fadmin')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role,status')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) redirect('/login?next=%2Fadmin&error=profile_error')
  if (!profile || profile.status !== 'active' || !['editor', 'sales', 'project_member', 'finance', 'support', 'admin', 'owner'].includes(profile.role)) {
    redirect('/login?next=%2Fadmin&error=staff_required')
  }

  // Cek apakah ada owner/admin — kalau tidak, tampilkan banner setup
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

  return (
    <>
      {noOwnerYet && (
        <div className="flex items-center justify-between bg-[#b36f43] px-6 py-3 text-xs text-white">
          <span>⚠️ Belum ada owner/admin aktif — fitur manajemen user tidak akan berfungsi.</span>
          <a href="/admin/setup" className="ml-4 shrink-0 font-bold underline">
            Setup sekarang →
          </a>
        </div>
      )}
      {children}
    </>
  )
}
