'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import { createAdminClient } from '../../lib/supabase/admin'

/**
 * Upgrade akun yang sedang login menjadi owner.
 * Tidak ada batasan — siapapun yang bisa akses server (punya service role key)
 * bisa claim ownership. Ini by design: kalau seseorang bisa set
 * SUPABASE_SERVICE_ROLE_KEY di .env, dia memang server admin yang berhak.
 */
export async function claimOwner(): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Anda harus login dulu sebelum claim ownership.' }

  const admin = createAdminClient()

  const { count: activeOwners } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .in('role', ['owner', 'admin'])
    .eq('status', 'active')

  if ((activeOwners || 0) > 0) {
    const { data: currentProfile } = await admin.from('profiles').select('role,status').eq('id', user.id).maybeSingle()
    if (!currentProfile || currentProfile.status !== 'active' || !['owner', 'admin'].includes(currentProfile.role)) {
      return { error: 'Setup owner sudah selesai. Hanya owner/admin aktif yang dapat mengelola akses.' }
    }
  }

  const { error } = await admin
    .from('profiles')
    .upsert({
      id: user.id,
      role: 'owner',
      status: 'active',
      updated_at: new Date().toISOString(),
    })

  if (error) return { error: `Gagal update profile: ${error.message}` }

  try {
    await admin.from('activity_logs').insert({
      actor_id: user.id, entity_type: 'profile', entity_id: user.id, action: 'claimed_owner',
    })
  } catch { /* non-critical */ }

  revalidatePath('/admin')
  revalidatePath('/admin/users')
  redirect('/admin/users')
}

/** Ambil daftar owner/admin yang aktif — untuk ditampilkan di setup page */
export async function getActiveOwners(): Promise<{ id: string; username: string | null; full_name: string | null; role: string }[]> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('profiles')
    .select('id, username, full_name, role')
    .in('role', ['owner', 'admin'])
    .eq('status', 'active')
    .order('role')
  return data || []
}
