'use client'

import { useState, useTransition } from 'react'
import { updateUserRole } from '../actions/admin'

const AVAILABLE_ROLES = [
  { value: 'client', label: 'Client' },
  { value: 'editor', label: 'Editor' },
  { value: 'sales', label: 'Sales' },
  { value: 'project_member', label: 'Project Member' },
  { value: 'finance', label: 'Finance' },
  { value: 'support', label: 'Support' },
  { value: 'admin', label: 'Admin' },
  { value: 'owner', label: 'Owner' }
]

export function RoleEditor({ userId, roles }: { userId: string; roles: string[] }) {
  const [pending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>(roles || ['client'])

  const toggleRole = (role: string) => {
    let newRoles = [...selectedRoles]
    if (newRoles.includes(role)) {
      newRoles = newRoles.filter(r => r !== role)
      if (newRoles.length === 0) newRoles = ['client'] // fallback
    } else {
      newRoles.push(role)
    }
    
    setSelectedRoles(newRoles)
    startTransition(async () => {
      await updateUserRole(userId, newRoles)
    })
  }

  return (
    <div className="relative">
      <button 
        disabled={pending}
        onClick={() => setIsOpen(!isOpen)}
        className="border border-black/15 bg-[#f3f0ea] px-3 py-2 text-[10px] min-w-[120px] text-left flex justify-between items-center"
      >
        <span className="truncate pr-2">
          {pending ? 'Saving...' : selectedRoles.join(', ')}
        </span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 w-48 bg-white border border-black/10 shadow-lg rounded py-1">
            {AVAILABLE_ROLES.map(role => (
              <label key={role.value} className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/5 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={selectedRoles.includes(role.value)}
                  onChange={() => toggleRole(role.value)}
                  disabled={pending}
                  className="rounded border-black/20 text-[#b36f43] focus:ring-[#b36f43]"
                />
                {role.label}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
