import { notFound } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { PortalMessageForm } from '../../../components/portal-message-form'

export const metadata = { robots: { index: false, follow: false } }

export default async function PortalSupportDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) notFound()
  const { data: ticket } = await supabase.from('support_tickets').select('id,reference,subject,description,status,priority,created_at,client_id').eq('id', id).single(); if (!ticket) notFound()
  const { data: membership } = await supabase.from('client_memberships').select('id').eq('client_id', ticket.client_id).eq('user_id', user.id).eq('status', 'active').maybeSingle(); if (!membership) notFound()
  const { data: messages } = await supabase.from('support_messages').select('id,body,created_at,author_user_id').eq('ticket_id', id).eq('visibility', 'client').order('created_at')
  return <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10"><a href="/portal" className="text-xs text-black/50">← Back to portal</a><div className="mx-auto mt-10 max-w-3xl"><p className="mono text-[10px] text-[#b36f43]">LOGIKAin / SUPPORT / {ticket.reference}</p><h1 className="mt-3 text-4xl font-extrabold tracking-[-2px]">{ticket.subject}</h1><p className="mt-2 text-xs capitalize text-[#b36f43]">{ticket.status} · {ticket.priority}</p><div className="mt-8 border border-black/10 bg-white/50 p-6"><p className="text-sm leading-6">{ticket.description}</p><div className="mt-8 space-y-4">{messages?.map((item) => <div key={item.id} className="border-t border-black/10 pt-4"><p className="text-sm leading-6">{item.body}</p><p className="mt-2 text-[10px] text-black/40">{item.created_at}</p></div>)}</div><PortalMessageForm ticketId={ticket.id} /></div></div></main>
}
