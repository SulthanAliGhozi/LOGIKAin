'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '../../lib/supabase/server'
import { createAdminClient } from '../../lib/supabase/admin'

const loginSchema = z.object({ identifier: z.string().min(3), password: z.string().min(6), next: z.enum(['/admin', '/portal']).default('/portal') })
const registerSchema = z.object({ username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/), full_name: z.string().min(2).max(120), email: z.string().email(), password: z.string().min(8).max(128) })

export type LoginState = { error: string }

export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Masukkan email/username dan password yang valid.' }
  const supabase = await createClient()
  let email = parsed.data.identifier
  if (!email.includes('@')) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { error: 'Login dengan username membutuhkan SUPABASE_SERVICE_ROLE_KEY di server.' }
    const { data, error: listError } = await createAdminClient().auth.admin.listUsers({ page: 1, perPage: 1000 })
    if (listError) return { error: 'Username tidak dapat diverifikasi saat ini.' }
    const match = data.users.find((user) => String(user.user_metadata?.username || '').toLowerCase() === email.toLowerCase())
    if (!match?.email) return { error: 'Username atau password tidak sesuai.' }
    email = match.email
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password: parsed.data.password })
  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) return { error: 'Email atau password tidak sesuai.' }
    return { error: `Login gagal: ${error.message}` }
  }
  redirect(parsed.data.next)
}

export async function signUp(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Semua kolom wajib diisi. Password minimal 8 karakter.' }

  // Cek apakah service role key tersedia — dibutuhkan untuk skip email confirmation
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Registrasi saat ini tidak tersedia. Hubungi tim LOGIKAin.' }
  }

  const admin = createAdminClient()

  // Cek apakah username sudah dipakai
  const { data: existingUsername } = await admin.from('profiles').select('id').eq('username', parsed.data.username).maybeSingle()
  if (existingUsername) return { error: 'Username tersebut sudah digunakan, coba yang lain.' }

  // Buat user di Supabase Auth — email_confirm: true = skip konfirmasi email
  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { username: parsed.data.username, full_name: parsed.data.full_name },
  })
  if (authError) {
    if (authError.message.toLowerCase().includes('already')) return { error: 'Email tersebut sudah terdaftar.' }
    return { error: `Registrasi gagal: ${authError.message}` }
  }
  if (!created.user) return { error: 'Registrasi gagal. Silakan coba lagi.' }

  // Masukkan ke tabel profiles
  const { error: profileError } = await admin.from('profiles').upsert({
    id: created.user.id,
    username: parsed.data.username,
    full_name: parsed.data.full_name,
    role: 'editor',
    status: 'active',
    updated_at: new Date().toISOString(),
  })

  if (profileError) {
    // Rollback: hapus auth user jika profile gagal dibuat
    await admin.auth.admin.deleteUser(created.user.id)
    return { error: `Gagal menyimpan profil: ${profileError.message}` }
  }

  // Login otomatis setelah register berhasil
  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password })
  if (signInError) {
    // Akun berhasil dibuat tapi login otomatis gagal — arahkan ke login manual
    redirect('/login')
  }

  redirect('/portal')
}
