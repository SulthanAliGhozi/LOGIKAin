import { createClient } from '../../../lib/supabase/server'
import { ClientMembershipForm } from '../../components/client-membership-form'
import { ClientCrudForm } from '../../components/client-crud-form'

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  let color = 'bg-gray-100 text-gray-700'
  if (['active', 'published', 'paid'].includes(s)) color = 'bg-green-100 text-green-700'
  else if (['pending', 'draft', 'invited'].includes(s)) color = 'bg-amber-100 text-amber-700'
  else if (['suspended', 'overdue', 'cancelled'].includes(s)) color = 'bg-red-100 text-red-700'
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}>{status}</span>
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function ClientsAdminPage() {
  const supabase = await createClient()
  const [{ data: clients, error }, { data: users }] = await Promise.all([
    supabase.from('clients').select('id,name,legal_name,email,phone,status,created_at').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id,username,full_name').eq('status', 'active').order('full_name'),
  ])
  const portalUsers = (users || []).map((user) => ({ id: user.id, label: user.username ? `${user.username} — ${user.full_name || ''}` : user.full_name || user.id }))
  const count = clients?.length || 0;

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">CLIENTS</span>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Clients & portal access</h1>
          <p className="mt-2 text-sm text-black/50">Full CRUD client records plus portal membership assignment.</p>
        </div>
        <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          {count} active clients
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm">
        <ClientCrudForm />
      </div>

      <div className="mt-10 space-y-6">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-sm">
            Clients table belum tersedia.
          </div>
        ) : count === 0 ? (
          <div className="rounded-xl border border-black/10 bg-white/50 p-12 text-center text-sm text-black/50 shadow-sm">
            Belum ada clients terdaftar.
          </div>
        ) : (
          (clients || []).map((client) => (
            <section key={client.id} className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-black/5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <p className="text-sm text-black/50">Added on {formatDate(client.created_at)}</p>
                    </div>
                    <StatusBadge status={client.status} />
                  </div>
                  <ClientCrudForm client={client} />
                </div>
                <div className="w-full md:w-80 bg-black/[0.02] p-6 flex flex-col justify-center">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-black/50">Portal Membership</h4>
                  <ClientMembershipForm clientId={client.id} users={portalUsers} />
                </div>
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  )
}
