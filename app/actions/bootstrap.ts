'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '../../lib/supabase/server'
import { createAdminClient } from '../../lib/supabase/admin'

/**
 * Dipakai HANYA saat setup pertama kali — upgrade akun sendiri jadi owner.
 * Hanya bisa berjalan kalau belum ada SATU PUN akun dengan role owner/admin.
 * Setelah ada owner pertama, action ini tidak akan berfungsi lagi.
 */
export async function bootstrapOwner(): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Anda harus login dulu.' }

  const admin = createAdminClient()

  // Cek apakah sudah ada owner atau admin — kalau sudah ada, tolak
  const { count } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .in('role', ['owner', 'admin'])
    .eq('status', 'active')

  if ((count ?? 0) > 0) {
    return { error: 'Sudah ada akun owner/admin aktif. Minta mereka untuk assign role Anda.' }
  }

  // Upgrade akun yang sedang login menjadi owner
  const { error } = await admin
    .from('profiles')
    .upsert({
      id: user.id,
      role: 'owner',
      status: 'active',
      updated_at: new Date().toISOString(),
    })

  if (error) return { error: `Gagal: ${error.message}` }

  try {
    await admin
      .from('activity_logs')
      .insert({ actor_id: user.id, entity_type: 'profile', entity_id: user.id, action: 'bootstrap_owner' })
  } catch { /* non-critical — log insert failure doesn't block bootstrap */ }

  revalidatePath('/admin')
  redirect('/admin/users')
}
