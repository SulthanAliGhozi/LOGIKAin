import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export const metadata: Metadata = { robots: { index: false, follow: false } }

// Roles yang merupakan staff internal LOGIKAin — tidak perlu client membership
const STAFF_ROLES = ['editor', 'sales', 'project_member', 'finance', 'support', 'admin', 'owner']

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=%2Fportal')

  // Ambil profile untuk cek role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) redirect('/login?next=%2Fportal&error=profile_error')

  // Jika profile ada dan role-nya adalah staff internal → langsung masuk, bypass membership
  if (profile && STAFF_ROLES.includes(profile.role) && profile.status === 'active') {
    return <>{children}</>
  }

  // Untuk user non-staff (client) → wajib punya active client membership
  const { count, error: membershipError } = await supabase
    .from('client_memberships')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (membershipError) redirect('/login?next=%2Fportal&error=membership_check')
  if (!count) redirect('/login?next=%2Fportal&error=membership_required')

  return <>{children}</>
}
