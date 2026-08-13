import { createClient } from '../../lib/supabase/server'

const modules = [['CMS', '/admin/content'], ['CRM', '/admin/leads'], ['Delivery', '/admin/projects'], ['Finance', '/admin/finance'], ['Support', '/admin/support'], ['Automation', '/admin/automation'], ['Settings', '/admin/settings']]
const adminNav = [['Overview','/admin'],['Content & SEO','/admin/content'],['Testimonials','/admin/testimonials'],['Media library','/admin/media'],['SEO & redirects','/admin/seo'],['Leads','/admin/leads'],['Clients','/admin/clients'],['Projects','/admin/projects'],['Delivery workspace','/admin/delivery/projects'],['Quotations','/admin/quotations'],['Invoices','/admin/invoices'],['Finance workspace','/admin/finance'],['Support','/admin/support'],['Automation','/admin/automation'],['Settings','/admin/settings'],['Users & roles','/admin/users'],['Activity log','/admin/audit'],['System activity','/admin/activity']]

export default async function AdminPage() {
  const supabase = await createClient()
  const [{ count: leads }, { count: clients }, { count: projects }, { count: invoices }, { data: recentLeads }] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('business_projects').select('*', { count: 'exact', head: true }),
    supabase.from('invoices').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('id,name,email,status,created_at').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <main className="min-h-screen bg-[#f3f0ea] text-[#171717]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-black/10 bg-[#171717] px-6 py-5 text-[#f3f0ea] md:px-10">
        <a href="/" className="text-xl font-extrabold tracking-[-1.5px]">LOGIKA<span className="text-[#b36f43]">in</span></a>
        <div className="flex items-center gap-5 text-xs">
          <a href="/" className="text-white/60 hover:text-white">View website ↗</a>
          <span className="rounded-full border border-white/20 px-3 py-2">Admin workspace</span>
        </div>
      </header>

      <div className="grid md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-73px)] border-r border-black/10 bg-[#ebe6de] p-5 md:block">
          <p className="mono mb-5 text-[9px] text-[#b36f43]">PLATFORM / OPERATE</p>
          {adminNav.map(([item, href], i) => (
            <a key={item} href={href} className={`mb-1 block px-3 py-3 text-xs ${i === 0 ? 'bg-[#171717] font-bold text-[#f3f0ea]' : 'text-black/60 hover:bg-black/5'}`}>{item}</a>
          ))}
        </aside>

        {/* Main content */}
        <section className="p-6 md:p-10">
          <p className="mono text-[10px] text-[#b36f43]">LOGIKAin / ADMIN</p>
          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-extrabold tracking-[-2px] md:text-5xl">Good morning.</h1>
              <p className="mt-2 text-sm text-black/55">Satu ruang untuk melihat apa yang sedang bergerak.</p>
            </div>
            <a href="/admin/leads" className="w-fit bg-[#171717] px-4 py-3 text-xs font-bold text-[#f3f0ea]">+ New lead</a>
          </div>

          {/* Stats */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[['Leads', leads ?? 0, 'Sales pipeline'], ['Clients', clients ?? 0, 'Relationships'], ['Projects', projects ?? 0, 'Delivery'], ['Invoices', invoices ?? 0, 'Commercial']].map(([label, value, sub]) => (
              <div key={label} className="border border-black/10 bg-white/45 p-5">
                <p className="mono text-[9px] text-black/45">{label}</p>
                <p className="mt-5 text-4xl font-extrabold">{value}</p>
                <p className="mt-2 text-xs text-black/45">{sub}</p>
              </div>
            ))}
          </div>

          {/* Recent Leads + Quick Access — equal 2 columns side by side */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {/* Recent Leads */}
            <div className="border border-black/10 bg-white/45">
              <div className="flex items-center justify-between border-b border-black/10 p-5">
                <div>
                  <p className="text-sm font-bold">Recent leads</p>
                  <p className="mt-0.5 text-xs text-black/45">Latest opportunities</p>
                </div>
                <a href="/admin/leads" className="text-xs font-bold text-[#b36f43]">View all ↗</a>
              </div>
              {recentLeads?.length ? (
                <div className="divide-y divide-black/10">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between gap-4 px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{lead.name}</p>
                        <p className="truncate text-xs text-black/45">{lead.email}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#b36f43]/10 px-3 py-1 text-[10px] capitalize text-[#8c542f]">{lead.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-sm text-black/50">Belum ada lead. Form start-project akan muncul di sini.</div>
              )}
            </div>

            {/* Quick Access */}
            <div className="border border-black/10 bg-[#171717] p-4 text-[#f3f0ea]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <p className="mono text-[9px] text-[#b36f43]">QUICK ACCESS</p>
                <span className="text-[10px] text-white/40">{modules.length} modul</span>
              </div>
              <div className="mt-2">
                {modules.map(([label, href]) => (
                  <a key={label} href={href} className="flex items-center justify-between border-b border-white/10 px-1 py-2.5 text-xs hover:text-[#b36f43]">
                    <b>{label}</b>
                    <span className="text-[#b36f43]">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
