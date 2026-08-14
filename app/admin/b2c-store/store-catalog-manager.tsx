'use client'

import { useState, useTransition } from 'react'
import { updateSiteSetting } from '../../actions/admin'

type Product = {
  slug: string
  name: string
  price: number
  desc: string
}

export function StoreCatalogManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  
  const [form, setForm] = useState<Product>({ slug: '', name: '', price: 0, desc: '' })
  const [isEditing, setIsEditing] = useState(false)

  const saveToDb = (newProducts: Product[]) => {
    startTransition(async () => {
      try {
        await updateSiteSetting('b2c_store_catalog', JSON.stringify(newProducts))
        setProducts(newProducts)
        setMessage('Katalog berhasil diperbarui!')
        setTimeout(() => setMessage(''), 3000)
      } catch (error) {
        setMessage('Gagal menyimpan.')
      }
    })
  }

  const handleAddOrEdit = (e: React.FormEvent) => {
    e.preventDefault()
    let newProducts = [...products]
    
    if (isEditing) {
      newProducts = newProducts.map(p => p.slug === form.slug ? form : p)
    } else {
      if (newProducts.find(p => p.slug === form.slug)) {
        alert('Slug sudah digunakan! Gunakan slug yang unik.')
        return
      }
      newProducts.push(form)
    }
    
    saveToDb(newProducts)
    setForm({ slug: '', name: '', price: 0, desc: '' })
    setIsEditing(false)
  }

  const handleEdit = (p: Product) => {
    setForm(p)
    setIsEditing(true)
  }

  const handleDelete = (slug: string) => {
    if (!confirm('Hapus produk ini?')) return
    const newProducts = products.filter(p => p.slug !== slug)
    saveToDb(newProducts)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 mt-6">
      
      {/* Table Section */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-black/10 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#171717] text-[#f3f0ea] text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Harga (Rp)</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {products.length === 0 ? (
                <tr><td colSpan={3} className="p-6 text-center text-black/50">Belum ada produk B2C.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.slug} className="hover:bg-black/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-black/50 mt-1">{p.desc}</div>
                      <div className="text-[10px] bg-black/10 inline-block px-2 py-0.5 rounded mt-2">{p.slug}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">
                      {p.price.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(p)} className="text-[#b36f43] text-xs font-bold mr-3 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p.slug)} disabled={pending} className="text-red-500 text-xs font-bold hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm h-fit">
        <h3 className="font-bold text-lg mb-4">{isEditing ? 'Edit Produk' : 'Tambah Produk B2C'}</h3>
        <form onSubmit={handleAddOrEdit} className="grid gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Nama Produk</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-black/15 p-2 text-sm" placeholder="Web Starter" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Slug (URL unik)</label>
            <input required type="text" value={form.slug} disabled={isEditing} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full border border-black/15 p-2 text-sm bg-black/5" placeholder="web-starter" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Harga (Angka saja)</label>
            <input required type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full border border-black/15 p-2 text-sm" placeholder="350000" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Deskripsi Singkat</label>
            <textarea required rows={3} value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full border border-black/15 p-2 text-sm" placeholder="Include A, B, C..." />
          </div>
          
          {message && <p className="text-xs font-bold text-[#b36f43]">{message}</p>}
          
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={pending} className="flex-1 bg-[#171717] text-[#f3f0ea] px-4 py-3 text-xs font-bold hover:bg-[#b36f43] transition-colors">
              {pending ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setForm({ slug: '', name: '', price: 0, desc: '' }) }} className="px-4 py-3 bg-black/10 text-xs font-bold hover:bg-black/20">
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

    </div>
  )
}
