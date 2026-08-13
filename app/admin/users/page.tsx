import { createClient } from '../../../lib/supabase/server'
import { createAdminClient } from '../../../lib/supabase/admin'
import { InviteUserForm } from '../../components/invite-user-form'
import { AdminUserRow } from '../../components/admin-user-row'

export default async function UsersAdminPage() {
  const supabase = await createClient()
  const { data: profiles, error } = await supabase.from('profiles').select('id,username,full_name,role,status,created_at').order('created_at', { ascending: false })
  const authData = process.env.SUPABASE_SERVICE_ROLE_KEY ? (await createAdminClient().auth.admin.listUsers({ page: 1, perPage: 1000 })).data : null
  const emails = new Map((authData?.users || []).map((user) => [user.id, user.email || '']))
  const serviceKeyMissing = !process.env.SUPABASE_SERVICE_ROLE_KEY
  return <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10"><a href="/admin" className="text-xs text-black/50">← Back to overview</a><div className="mt-10"><p className="mono text-[10px] text-[#b36f43]">LOGIKAin / ACCESS CONTROL</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">Users & roles</h1><p className="mt-2 text-sm text-black/50">Admin dapat membuat user langsung dengan password, mengubah role/status, dan menghapus akun.</p></div>{serviceKeyMissing && <div className="mt-6 border border-[#b36f43]/40 bg-[#b36f43]/10 p-4 text-sm text-[#8c542f]">SUPABASE_SERVICE_ROLE_KEY belum diisi. CRUD Auth membutuhkan key server-only di .env.local; halaman tetap terbuka agar tidak menjadi error 500.</div>}<div className="mt-8"><InviteUserForm disabled={serviceKeyMissing} /></div><div className="mt-8 overflow-x-auto border border-black/10 bg-white/50">{error ? <p className="p-6 text-sm text-red-700">Profiles table belum tersedia.</p> : <table className="w-full min-w-[1100px] text-left text-xs"><thead className="border-b border-black/10 bg-black/5"><tr>{['username','name','email','role','status','created','actions'].map((column) => <th key={column} className="px-5 py-4 font-bold uppercase tracking-wider text-black/50">{column}</th>)}</tr></thead><tbody>{(profiles || []).map((profile) => <AdminUserRow key={profile.id} user={{ ...profile, username: profile.username || '', email: emails.get(profile.id) || 'Email tidak tersedia tanpa service key', full_name: profile.full_name || '' }} />)}</tbody></table>}</div></main>
}
