import { createClient } from '../../../lib/supabase/server'
import { ClientMembershipForm } from '../../components/client-membership-form'
import { ClientCrudForm } from '../../components/client-crud-form'

export default async function ClientsAdminPage() {
  const supabase = await createClient()
  const [{ data: clients, error }, { data: users }] = await Promise.all([
    supabase.from('clients').select('id,name,legal_name,email,phone,status,created_at').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id,username,full_name').eq('status', 'active').order('full_name'),
  ])
  const portalUsers = (users || []).map((user) => ({ id: user.id, label: user.username ? `${user.username} — ${user.full_name || ''}` : user.full_name || user.id }))
  return <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10"><a href="/admin" className="text-xs text-black/50">← Back to overview</a><div className="mt-10"><p className="mono text-[10px] text-[#b36f43]">LOGIKAin / CRM / CLIENTS</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">Clients & portal access</h1><p className="mt-2 text-sm text-black/50">Full CRUD client records plus portal membership assignment.</p></div><div className="mt-8"><ClientCrudForm /></div><div className="mt-8 space-y-3">{error ? <p className="border border-black/10 bg-white/50 p-6 text-sm text-red-700">Clients table belum tersedia.</p> : (clients || []).map((client) => <section key={client.id} className="border border-black/10 bg-white/50 p-4"><ClientCrudForm client={client} /><div className="mt-4 border-t border-black/10 pt-3"><p className="text-[10px] font-bold uppercase tracking-wider text-black/45">Portal membership</p><ClientMembershipForm clientId={client.id} users={portalUsers} /></div></section>)}</div></main>
}
