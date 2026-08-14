'use client'

import { useState, useEffect, useRef } from 'react'

type MediaAsset = { id: string; file_name: string; alt_text: string | null; storage_path: string }

export function MediaPicker({ 
  name, 
  defaultValue, 
  onSelect 
}: { 
  name: string, 
  defaultValue?: string,
  onSelect?: (id: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(defaultValue || '')
  
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchAssets = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/media') // We will need to create this API route or use a server action.
      if (res.ok) {
        const data = await res.json()
        setAssets(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && assets.length === 0) {
      fetchAssets()
    }
  }, [isOpen, assets.length])

  const filteredAssets = assets.filter(a => 
    a.file_name.toLowerCase().includes(search.toLowerCase()) || 
    (a.alt_text && a.alt_text.toLowerCase().includes(search.toLowerCase()))
  )

  const selectedAsset = assets.find(a => a.id === selectedId)

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={selectedId} />
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="border border-black/15 bg-transparent px-4 py-3 text-sm font-normal cursor-pointer flex justify-between items-center hover:border-black/30 transition-colors"
      >
        <span className={selectedId ? "text-black" : "text-black/40"}>
          {selectedId ? (selectedAsset?.file_name || 'Selected Media') : 'Pilih Gambar dari Media Library...'}
        </span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-black/10 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[300px]">
          <div className="p-2 border-b border-black/5 bg-black/[0.02]">
            <input 
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama file atau alt text..." 
              className="w-full border border-black/10 px-3 py-2 text-xs rounded outline-none focus:border-[#b36f43]"
            />
          </div>
          
          <div className="overflow-y-auto flex-1 p-1">
            {loading ? (
              <div className="p-4 text-center text-xs text-black/40 animate-pulse">Memuat media library...</div>
            ) : filteredAssets.length === 0 ? (
              <div className="p-4 text-center text-xs text-black/40">Tidak ada gambar yang cocok.</div>
            ) : (
              <div className="grid gap-1">
                {filteredAssets.map(asset => (
                  <div 
                    key={asset.id} 
                    onClick={() => {
                      setSelectedId(asset.id)
                      setIsOpen(false)
                      if (onSelect) onSelect(asset.id)
                    }}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${selectedId === asset.id ? 'bg-[#b36f43]/10 text-[#b36f43]' : 'hover:bg-black/5'}`}
                  >
                    <div className="w-8 h-8 bg-black/5 rounded overflow-hidden flex-shrink-0 border border-black/5 flex items-center justify-center">
                      <span className="text-[8px] text-black/30 font-mono text-center leading-none">IMG</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate">{asset.file_name}</p>
                      <p className="text-[10px] text-black/50 truncate">{asset.alt_text || 'No alt text'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
