import { createClient } from '../../../lib/supabase/server'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

export default async function AuditPage() {
  const supabase = await createClient(); 
  const { data, error } = await supabase.from('activity_logs').select('id,actor_id,entity_type,entity_id,action,metadata,created_at').order('created_at', { ascending: false }).limit(100)
  const count = data?.length || 0;

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">GOVERNANCE</span>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Activity log</h1>
          <p className="mt-2 text-sm text-black/50">Operational changes, publishing, billing, and access events.</p>
        </div>
        <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          Showing last 100 events
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {error ? (
          <div className="p-12 text-center text-sm text-red-700 bg-red-50">
            Audit log hanya tersedia untuk admin atau owner.
          </div>
        ) : count === 0 ? (
          <div className="p-12 text-center text-sm text-black/50">
            Belum ada activity log.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02]">
                <tr>
                  {['Time', 'Actor', 'Entity', 'Action', 'Metadata'].map((column) => (
                    <th key={column} className="px-6 py-4 font-semibold text-black/60">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(data || []).map((item) => (
                  <tr key={item.id} className="hover:bg-black/[0.02] even:bg-black/[0.01] transition-colors align-top">
                    <td className="px-6 py-4 text-xs font-mono text-black/50 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {item.actor_id ? (
                        <span className="bg-black/5 px-2 py-1 rounded">{item.actor_id.substring(0,8)}...</span>
                      ) : (
                        <span className="bg-amber-50 text-amber-800 px-2 py-1 rounded font-bold">system</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-xs uppercase tracking-wide">{item.entity_type}</span>
                        {item.entity_id && <span className="font-mono text-xs text-black/40 mt-1">{item.entity_id}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#b36f43]">{item.action}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-md overflow-hidden rounded border border-black/5 bg-black/[0.02] p-2">
                        <pre className="text-[10px] font-mono text-black/60 whitespace-pre-wrap break-all">
                          {JSON.stringify(item.metadata, null, 2)}
                        </pre>
                      </div>
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
