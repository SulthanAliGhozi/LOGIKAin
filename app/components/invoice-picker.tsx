'use client'

import { useState, useEffect, useRef } from 'react'

type Invoice = { id: string; invoice_number: string; status: string; total_minor: number }

export function InvoicePicker({ 
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
  const [invoices, setInvoices] = useState<Invoice[]>([])
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

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/invoices/search')
      if (res.ok) {
        const data = await res.json()
        setInvoices(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && invoices.length === 0) {
      fetchInvoices()
    }
  }, [isOpen, invoices.length])

  const filteredInvoices = invoices.filter(a => 
    a.invoice_number.toLowerCase().includes(search.toLowerCase()) || 
    a.id.toLowerCase().includes(search.toLowerCase())
  )

  const selectedInvoice = invoices.find(a => a.id === selectedId)

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name={name} value={selectedId} />
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="border border-black/15 bg-transparent px-3 py-3 text-xs font-normal cursor-pointer flex justify-between items-center hover:border-black/30 transition-colors h-full min-h-[42px]"
      >
        <span className={selectedId ? "text-black" : "text-black/40"}>
          {selectedId ? (selectedInvoice?.invoice_number || selectedId) : 'Search & Pick Invoice...'}
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
              placeholder="Cari nomor invoice..." 
              className="w-full border border-black/10 px-3 py-2 text-xs rounded outline-none focus:border-[#b36f43]"
            />
          </div>
          
          <div className="overflow-y-auto flex-1 p-1">
            {loading ? (
              <div className="p-4 text-center text-xs text-black/40 animate-pulse">Memuat data invoice...</div>
            ) : filteredInvoices.length === 0 ? (
              <div className="p-4 text-center text-xs text-black/40">Invoice tidak ditemukan.</div>
            ) : (
              <div className="grid gap-1">
                {filteredInvoices.map(inv => (
                  <div 
                    key={inv.id} 
                    onClick={() => {
                      setSelectedId(inv.id)
                      setIsOpen(false)
                      if (onSelect) onSelect(inv.id)
                    }}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedId === inv.id ? 'bg-[#b36f43]/10 text-[#b36f43]' : 'hover:bg-black/5'}`}
                  >
                    <div className="flex-1">
                      <p className="text-xs font-bold">{inv.invoice_number}</p>
                      <p className="text-[10px] text-black/50">Status: {inv.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{(inv.total_minor / 100).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
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
