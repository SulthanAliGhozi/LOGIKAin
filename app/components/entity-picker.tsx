'use client'

import { useState, useEffect, useRef } from 'react'

export function EntityPicker({ 
  name, 
  entity,
  defaultValue, 
  placeholder,
  required = false
}: { 
  name: string, 
  entity: 'clients' | 'leads' | 'business_projects',
  defaultValue?: string,
  placeholder: string,
  required?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState(defaultValue || '')
  
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/search?entity=${entity}`)
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && items.length === 0) {
      fetchItems()
    }
  }, [isOpen, items.length])

  const filteredItems = items.filter(a => {
    const term = search.toLowerCase()
    return (
      (a.name && a.name.toLowerCase().includes(term)) || 
      (a.title && a.title.toLowerCase().includes(term)) || 
      (a.company && a.company.toLowerCase().includes(term)) ||
      (a.company_name && a.company_name.toLowerCase().includes(term)) ||
      (a.id && a.id.toLowerCase().includes(term))
    )
  })

  const selectedItem = items.find(a => a.id === selectedId)
  
  let displayValue = selectedId
  if (selectedItem) {
    if (entity === 'clients') displayValue = `${selectedItem.name} ${selectedItem.company_name ? `(${selectedItem.company_name})` : ''}`
    else if (entity === 'leads') displayValue = `${selectedItem.name} ${selectedItem.company ? `(${selectedItem.company})` : ''}`
    else if (entity === 'business_projects') displayValue = selectedItem.title || selectedItem.id
  }

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={selectedId} required={required} />
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="border border-black/15 bg-transparent px-3 py-3 text-xs font-normal cursor-pointer flex justify-between items-center hover:border-black/30 transition-colors h-full min-h-[42px]"
      >
        <span className={selectedId ? "text-black truncate pr-2" : "text-black/40 truncate pr-2"}>
          {selectedId ? displayValue : placeholder}
        </span>
        <svg className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-black/10 rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[300px]">
          <div className="p-2 border-b border-black/5 bg-black/[0.02]">
            <input 
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama/perusahaan/ID..." 
              className="w-full border border-black/10 px-3 py-2 text-xs rounded outline-none focus:border-[#b36f43]"
            />
          </div>
          
          <div className="overflow-y-auto flex-1 p-1">
            {loading ? (
              <div className="p-4 text-center text-xs text-black/40 animate-pulse">Memuat data...</div>
            ) : filteredItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-black/40">Data tidak ditemukan.</div>
            ) : (
              <div className="grid gap-1">
                {filteredItems.map(item => {
                  let title = ''
                  let subtitle = ''
                  
                  if (entity === 'clients') {
                    title = item.name
                    subtitle = item.company_name || 'No company'
                  } else if (entity === 'leads') {
                    title = item.name
                    subtitle = item.company || 'No company'
                  } else if (entity === 'business_projects') {
                    title = item.title
                    subtitle = item.client_id || 'No client'
                  }

                  return (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        setSelectedId(item.id)
                        setIsOpen(false)
                      }}
                      className={`flex flex-col p-2 rounded cursor-pointer transition-colors ${selectedId === item.id ? 'bg-[#b36f43]/10 text-[#b36f43]' : 'hover:bg-black/5'}`}
                    >
                      <p className="text-xs font-bold truncate">{title}</p>
                      <p className="text-[10px] text-black/50 truncate">{subtitle}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
