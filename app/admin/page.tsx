import { createClient } from '../../lib/supabase/server'

const MODULES = [
  { label: 'CMS', href: '/admin/content', icon: '✦', desc: 'Konten & SEO' },
  { label: 'CRM', href: '/admin/leads', icon: '◈', desc: 'Leads & Clients' },
  { label: 'Delivery', href: '/admin/projects', icon: '◉', desc: 'Projects & Milestones' },
  { label: 'Finance', href: '/admin/finance', icon: '◎', desc: 'Invoices & Payments' },
  { label: 'Support', href: '/admin/support', icon: '⊕', desc: 'Tickets & Messages' },
  { label: 'Automation', href: '/admin/automation', icon: '⟳', desc: 'Background Jobs' },
]

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-purple-100 text-purple-700',
  proposal: 'bg-orange-100 text-orange-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-500',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminPage() {
  const supabase = await createClient()
  const [{ count: leads }, { count: clients }, { count: projects }, { count: invoices }, { data: recentLeads }] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('business_projects').select('*', { count: 'exact', head: true }),
    supabase.from('invoices').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('id,name,email,status,created_at').order('created_at', { ascending: false }).limit(6),
  ])

  return (
    <div className="p-6 md:p-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mono text-[10px] tracking-widest text-[#b36f43]">LOGIKAin / ADMIN DASHBOARD</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-[-2px] md:text-5xl">Overview.</h1>
          <p className="mt-1.5 text-sm text-black/50">Platform operations — semua bergerak dari sini.</p>
        </div>
        <a href="/admin/leads" className="w-fit bg-[#171717] px-5 py-3 text-xs font-bold text-[#f3f0ea] hover:bg-black">
          + New lead
        </a>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: 'Total Leads', value: leads ?? 0, sub: 'Sales pipeline', href: '/admin/leads' },
          { label: 'Active Clients', value: clients ?? 0, sub: 'Relationships', href: '/admin/clients' },
          { label: 'Projects', value: projects ?? 0, sub: 'Delivery', href: '/admin/projects' },
          { label: 'Invoices', value: invoices ?? 0, sub: 'Commercial', href: '/admin/invoices' },
        ].map(({ label, value, sub, href }) => (
          <a key={label} href={href} className="group border border-black/10 bg-white/50 p-5 transition-colors hover:border-[#b36f43]/30 hover:bg-white/70">
            <p className="mono text-[9px] tracking-widest text-black/40">{label.toUpperCase()}</p>
            <p className="mt-4 text-5xl font-extrabold tracking-[-2px] text-[#171717] group-hover:text-[#b36f43]">{value}</p>
            <p className="mt-2 text-xs text-black/40">{sub}</p>
          </a>
        ))}
      </div>

      {/* Recent Leads + Quick Access */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {/* Recent Leads */}
        <div className="border border-black/10 bg-white/50">
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <div>
              <p className="text-sm font-bold">Recent Leads</p>
              <p className="text-xs text-black/40">Opportunities terbaru</p>
            </div>
            <a href="/admin/leads" className="text-xs font-bold text-[#b36f43]">View all ↗</a>
          </div>
          {recentLeads?.length ? (
            <div className="divide-y divide-black/[0.06]">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-black/[0.02]">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{lead.name}</p>
                    <p className="truncate text-xs text-black/40">{lead.email} · {lead.created_at ? fmt(lead.created_at) : ''}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${STATUS_COLORS[lead.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <p className="text-2xl">◈</p>
              <p className="mt-2 text-sm font-bold">Belum ada lead</p>
              <p className="mt-1 text-xs text-black/40">Form /start-project akan muncul di sini.</p>
              <a href="/admin/leads" className="mt-4 bg-[#171717] px-4 py-2 text-xs font-bold text-[#f3f0ea]">
                + Tambah manual
              </a>
            </div>
          )}
        </div>

        {/* Quick Access Modules */}
        <div className="border border-black/10 bg-[#171717] p-5 text-[#f3f0ea]">
          <p className="mono mb-4 text-[9px] tracking-widest text-[#b36f43]">QUICK ACCESS</p>
          <div className="grid gap-1.5">
            {MODULES.map(({ label, href, icon, desc }) => (
              <a key={href} href={href} className="flex items-center justify-between border border-white/10 px-4 py-3 hover:border-[#b36f43]/40 hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-[#b36f43]">{icon}</span>
                  <div>
                    <p className="text-xs font-bold">{label}</p>
                    <p className="text-[10px] text-white/40">{desc}</p>
                  </div>
                </div>
                <span className="text-xs text-[#b36f43]">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
