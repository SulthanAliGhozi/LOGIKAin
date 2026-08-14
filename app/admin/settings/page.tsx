import { createClient } from '../../../lib/supabase/server'
import { SettingForm } from './setting-form'

export default async function SettingsPage() { 
  const supabase = await createClient(); 
  const { data, error } = await supabase.from('site_settings').select('key,value').order('key'); 
  const count = data?.length || 0;

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">SYSTEM</span>
      </div>
      
      <div className="mt-8 mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Site settings</h1>
          <p className="mt-2 text-sm text-black/50">Controlled structured settings for homepage and navigation. Changes are audited.</p>
        </div>
        <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          {count} configuration keys
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {error ? (
          <div className="col-span-full rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-sm">
            Run the settings migration first.
          </div>
        ) : (
          (data || []).map((row) => (
            <div key={row.key} className="bg-white p-6 rounded-xl border border-black/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-black/70">{row.key}</h3>
              </div>
              <SettingForm initialKey={row.key} initialValue={JSON.stringify(row.value, null, 2)} />
            </div>
          ))
        )}

        {!error && !data?.length && (
          <>
            <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-black/70">homepage</h3>
              </div>
              <SettingForm initialKey="homepage" initialValue="{}" />
            </div>
            <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-black/70">navigation</h3>
              </div>
              <SettingForm initialKey="navigation" initialValue="[]" />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
