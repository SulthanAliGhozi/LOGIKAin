import { createClient } from '../../../lib/supabase/server'
import { MediaUploader } from '../../components/media-uploader'
import { MediaMetadataForm } from '../../components/media-metadata-form'
import { AdminDeleteButton } from '../../components/admin-delete-button'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default async function MediaPage() {
  const supabase = await createClient(); 
  const { data, error } = await supabase.from('media_assets').select('id,filename,mime_type,size_bytes,alt_text,is_decorative,created_at').order('created_at', { ascending: false })
  const count = data?.length || 0;

  return (
    <main className="min-h-screen bg-[#f3f0ea] p-6 text-[#171717] md:p-10">
      <div className="flex items-center gap-2 text-xs font-medium text-black/50">
        <a href="/admin" className="hover:text-[#b36f43] transition-colors">← Back</a>
        <span>/</span>
        <span>LOGIKAin</span>
        <span>/</span>
        <span className="text-[#b36f43]">MEDIA</span>
      </div>
      
      <div className="mt-8 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Media library</h1>
          <p className="mt-2 text-sm text-black/50">Upload, edit metadata, and delete unused assets.</p>
        </div>
        <div className="text-sm font-medium text-black/50 bg-white/50 px-3 py-1 rounded-full border border-black/5">
          {count} media assets
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl border border-black/10 shadow-sm">
        <MediaUploader />
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {error ? (
          <div className="p-12 text-center text-sm text-red-700 bg-red-50">
            Media table belum tersedia.
          </div>
        ) : count === 0 ? (
          <div className="p-12 text-center text-sm text-black/50">
            Belum ada media. Upload file pertama Anda di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02]">
                <tr>
                  {['Filename', 'Type', 'Size', 'Metadata', 'Actions'].map((column) => (
                    <th key={column} className="px-6 py-4 font-semibold text-black/60">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {data.map((asset) => (
                  <tr key={asset.id} className="hover:bg-black/[0.02] even:bg-black/[0.01] transition-colors">
                    <td className="px-6 py-4 font-medium max-w-[300px] truncate" title={asset.filename}>{asset.filename}</td>
                    <td className="px-6 py-4 text-black/60">
                      <span className="bg-black/5 px-2 py-1 rounded text-xs font-mono">{asset.mime_type || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-black/60 font-mono text-sm">
                      {asset.size_bytes ? `${Math.ceil(asset.size_bytes / 1024)} KB` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <MediaMetadataForm id={asset.id} altText={asset.alt_text} decorative={asset.is_decorative} />
                    </td>
                    <td className="px-6 py-4">
                      <AdminDeleteButton id={asset.id} kind="media" />
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
