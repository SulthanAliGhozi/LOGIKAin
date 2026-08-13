import { createClient } from '../../lib/supabase/server'
import { createPrivateDownloadUrl } from '../../lib/storage'
import { PortalSupportForm, ApprovalDecision } from '../components/portal-forms'

const STAFF_ROLES = ['editor', 'sales', 'project_member', 'finance', 'support', 'admin', 'owner']

export default async function PortalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: memberships }] = await Promise.all([
    supabase.from('profiles').select('username,full_name,role,status').eq('id', user?.id || '').maybeSingle(),
    supabase.from('client_memberships').select('client_id,portal_role').eq('user_id', user?.id || '').eq('status', 'active'),
  ])

  const isStaff = profile && STAFF_ROLES.includes(profile.role) && profile.status === 'active'
  const clientIds = memberships?.map((m) => m.client_id) || []

  const [{ data: projects }, { data: invoices }, { data: tickets }] = clientIds.length ? await Promise.all([
    supabase.from('business_projects').select('id,name,status,target_date').in('client_id', clientIds).order('created_at', { ascending: false }),
    supabase.from('invoices').select('id,invoice_number,status,total_minor,currency,due_at').in('client_id', clientIds).order('created_at', { ascending: false }),
    supabase.from('support_tickets').select('id,reference,subject,status,priority').in('client_id', clientIds).order('created_at', { ascending: false }),
  ]) : [{ data: [] }, { data: [] }, { data: [] }]

  const projectIds = projects?.map((p) => p.id) || []
  const [{ data: approvals }, { data: files }] = projectIds.length ? await Promise.all([
    supabase.from('project_approvals').select('id,title,status,request_note,project_id').in('project_id', projectIds).eq('status', 'pending'),
    supabase.from('project_files').select('id,project_id,filename,storage_path,size_bytes').in('project_id', projectIds).eq('client_visible', true).order('created_at', { ascending: false }),
  ]) : [{ data: [] }, { data: [] }]

  const fileLinks = await Promise.all((files || []).map(async (file) => {
    try { return { ...file, url: await createPrivateDownloadUrl('private-project-files', file.storage_path) } }
    catch { return { ...file, url: null } }
  }))

  return (
    <main className="min-h-screen bg-[#f3f0ea] text-[#171717]">
      <header className="flex items-center justify-between border-b border-black/10 bg-[#171717] px-6 py-5 text-[#f3f0ea] md:px-10">
        <a href="/" className="text-xl font-extrabold tracking-[-1.5px]">LOGIKA<span className="text-[#b36f43]">in</span></a>
        <div className="flex items-center gap-4">
          {isStaff && <a href="/admin" className="text-xs text-white/60 hover:text-white">Admin ↗</a>}
          <span className="rounded-full border border-white/20 px-3 py-2 text-xs">Client portal</span>
        </div>
      </header>

      <section className="p-6 md:p-10">
        <p className="mono text-[10px] text-[#b36f43]">LOGIKAin / PORTAL</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-2px]">Your project space.</h1>
        <p className="mt-2 text-sm text-black/55">Progress, commercial documents, files, approvals, and support in one place.</p>

        {/* Staff tanpa membership: tunjukkan pesan yang sesuai */}
        {isStaff && !clientIds.length && (
          <div className="mt-10 border border-black/10 bg-white/50 p-6">
            <p className="text-sm font-bold">Selamat datang, {profile?.full_name || 'Staff'}.</p>
            <p className="mt-2 text-sm text-black/55">Akun staff ini tidak terhubung ke client workspace manapun. Gunakan <a href="/admin" className="font-bold text-[#b36f43]">Admin panel</a> untuk mengelola platform.</p>
          </div>
        )}

        {/* Client tanpa membership */}
        {!isStaff && !clientIds.length && (
          <div className="mt-10 border border-black/10 bg-white/50 p-6 text-sm text-black/55">
            Akun ini belum memiliki client membership. Hubungi tim LOGIKAin untuk mendapatkan akses.
          </div>
        )}

        {/* Support form hanya untuk yang punya membership */}
        {clientIds.length > 0 && (
          <div className="mt-8"><PortalSupportForm clientId={clientIds[0]} /></div>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 bg-white/50 p-5"><p className="mono text-[9px] text-black/45">Projects</p><p className="mt-5 text-4xl font-extrabold">{projects?.length || 0}</p></div>
          <div className="border border-black/10 bg-white/50 p-5"><p className="mono text-[9px] text-black/45">Invoices</p><p className="mt-5 text-4xl font-extrabold">{invoices?.length || 0}</p></div>
          <div className="border border-black/10 bg-white/50 p-5"><p className="mono text-[9px] text-black/45">Support tickets</p><p className="mt-5 text-4xl font-extrabold">{tickets?.length || 0}</p></div>
        </div>

        <div className="mt-10 grid gap-4 xl:grid-cols-3">
          <div className="border border-black/10 bg-white/50 p-5">
            <h2 className="font-bold">Projects &amp; files</h2>
            {projects?.length ? projects.map((project) => (
              <div key={project.id} className="mt-5 border-t border-black/10 pt-4">
                <p className="text-sm font-bold">{project.name}</p>
                <p className="mt-1 text-xs capitalize text-[#b36f43]">{project.status}</p>
                {fileLinks.filter((f) => f.project_id === project.id).map((file) => (
                  <div key={file.id} className="mt-3 flex items-center justify-between gap-3 text-xs">
                    <span className="truncate">{file.filename}</span>
                    {file.url ? <a href={file.url} target="_blank" rel="noreferrer" className="shrink-0 text-[#b36f43]">Download</a> : <span className="text-black/40">Unavailable</span>}
                  </div>
                ))}
              </div>
            )) : <p className="mt-5 text-xs text-black/50">No projects yet.</p>}
          </div>

          <div className="border border-black/10 bg-white/50 p-5">
            <h2 className="font-bold">Invoices</h2>
            {invoices?.length ? invoices.map((invoice) => (
              <div key={invoice.id} className="mt-5 border-t border-black/10 pt-4">
                <a href={`/portal/invoices/${invoice.id}`} className="text-sm font-bold hover:text-[#b36f43]">{invoice.invoice_number} →</a>
                <p className="mt-1 text-xs capitalize text-[#b36f43]">{invoice.status}</p>
              </div>
            )) : <p className="mt-5 text-xs text-black/50">No invoices yet.</p>}
          </div>

          <div className="border border-black/10 bg-white/50 p-5">
            <h2 className="font-bold">Support</h2>
            {tickets?.length ? tickets.map((ticket) => (
              <div key={ticket.id} className="mt-5 border-t border-black/10 pt-4">
                <a href={`/portal/support/${ticket.id}`} className="text-sm font-bold hover:text-[#b36f43]">{ticket.subject}</a>
                <p className="mt-1 text-xs capitalize text-[#b36f43]">{ticket.status}</p>
              </div>
            )) : <p className="mt-5 text-xs text-black/50">No open tickets.</p>}
          </div>
        </div>

        {approvals?.length ? (
          <section className="mt-4 border border-black/10 bg-white/50 p-5">
            <h2 className="font-bold">Approvals waiting for you</h2>
            {approvals.map((approval) => (
              <div key={approval.id} className="mt-5 border-t border-black/10 pt-4">
                <p className="text-sm font-bold">{approval.title}</p>
                <p className="mt-1 text-xs leading-5 text-black/55">{approval.request_note}</p>
                <ApprovalDecision approvalId={approval.id} />
              </div>
            ))}
          </section>
        ) : null}
      </section>
    </main>
  )
}
