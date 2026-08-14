import { createClient } from '../../../lib/supabase/server'
import { createAdminClient } from '../../../lib/supabase/admin'
import { InviteUserForm } from '../../components/invite-user-form'
import { AdminUserRow } from '../../components/admin-user-row'

export default async function UsersAdminPage() {
  const supabase = await createClient()
  const { data: profiles, error } = await supabase.from('profiles').select('id,username,full_name,roles,status,created_at').order('created_at', { ascending: false })
  const authData = process.env.SUPABASE_SERVICE_ROLE_KEY ? (await createAdminClient().auth.admin.listUsers({ page: 1, perPage: 1000 })).data : null
  const emails = new Map((authData?.users || []).map((user) => [user.id, user.email || '']))
  const serviceKeyMissing = !process.env.SUPABASE_SERVICE_ROLE_KEY
  const count = profiles?.length || 0;

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">ACCESS CONTROL</span>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Users & roles</h1>
          <p className="mt-2 text-sm text-black/50">Admin dapat membuat user langsung dengan password, mengubah role/status, dan menghapus akun.</p>
        </div>
        <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          {count} total users
        </div>
      </div>

      {serviceKeyMissing && (
        <div className="mt-6 rounded-xl border border-[#b36f43]/40 bg-[#b36f43]/10 p-5 text-sm text-[#8c542f] flex items-start gap-3 shadow-sm">
          <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <p>SUPABASE_SERVICE_ROLE_KEY belum diisi. CRUD Auth membutuhkan key server-only di .env.local; halaman tetap terbuka agar tidak menjadi error 500.</p>
        </div>
      )}

      <div className="mt-8 bg-white p-6 rounded-xl border border-black/10 shadow-sm">
        <InviteUserForm disabled={serviceKeyMissing} />
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {error ? (
          <div className="p-12 text-center text-sm text-red-700 bg-red-50">
            Profiles table belum tersedia.
          </div>
        ) : count === 0 ? (
          <div className="p-12 text-center text-sm text-black/50">
            Belum ada data user.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02]">
                <tr>
                  {['Username', 'Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map((column) => (
                    <th key={column} className="px-6 py-4 font-semibold text-black/60">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(profiles || []).map((profile) => (
                  <AdminUserRow 
                    key={profile.id} 
                    user={{ 
                      ...profile, 
                      username: profile.username || '', 
                      email: emails.get(profile.id) || 'Email tidak tersedia tanpa service key', 
                      full_name: profile.full_name || '' 
                    }} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
