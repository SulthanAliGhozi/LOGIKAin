import { createClient } from '../../../lib/supabase/server'
import { SupportTicketActions } from '../../components/support-ticket-actions'
import { CreateSupportTicket } from '../../components/create-support-ticket'

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  let color = 'bg-gray-100 text-gray-700'
  if (['resolved', 'closed'].includes(s)) color = 'bg-green-100 text-green-700'
  else if (['open', 'pending'].includes(s)) color = 'bg-amber-100 text-amber-700'
  else if (['escalated', 'urgent'].includes(s)) color = 'bg-red-100 text-red-700'
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}>{status}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = priority.toLowerCase()
  let color = 'bg-gray-100 text-gray-700'
  if (p === 'low') color = 'bg-blue-100 text-blue-700'
  else if (p === 'medium') color = 'bg-amber-100 text-amber-700'
  else if (p === 'high' || p === 'urgent') color = 'bg-red-100 text-red-700'
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${color}`}>{priority}</span>
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function SupportAdminPage() {
  const supabase = await createClient(); 
  const { data, error } = await supabase.from('support_tickets').select('id,reference,subject,description,priority,status,created_at').order('created_at', { ascending: false })
  const count = data?.length || 0;

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">SUPPORT</span>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Support operations</h1>
          <p className="mt-2 text-sm text-black/50">Manage ticket status and communicate with clients from one workspace.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
            {count} active tickets
          </div>
          <CreateSupportTicket />
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {error ? (
          <div className="p-12 text-center text-sm text-red-700 bg-red-50">
            Support tickets table belum tersedia.
          </div>
        ) : count === 0 ? (
          <div className="p-12 text-center text-sm text-black/50">
            Belum ada tiket support. Anda siap melayani!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02]">
                <tr>
                  {['Reference', 'Request', 'Priority', 'Status', 'Created', 'Actions'].map((column) => (
                    <th key={column} className="px-6 py-4 font-semibold text-black/60">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {data.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-black/[0.02] even:bg-black/[0.01] transition-colors align-top">
                    <td className="px-6 py-4 font-mono font-medium text-xs text-black/70">{ticket.reference}</td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="font-semibold text-base mb-1">{ticket.subject}</p>
                      <p className="text-black/60 line-clamp-2 leading-relaxed">{ticket.description}</p>
                    </td>
                    <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                    <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                    <td className="px-6 py-4 text-black/60">{formatDate(ticket.created_at)}</td>
                    <td className="px-6 py-4 min-w-[280px]">
                      <SupportTicketActions ticketId={ticket.id} status={ticket.status} subject={ticket.subject} description={ticket.description} priority={ticket.priority} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
