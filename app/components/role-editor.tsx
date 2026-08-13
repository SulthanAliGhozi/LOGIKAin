'use client'

import { useTransition } from 'react'
import { updateUserRole } from '../actions/admin'

export function RoleEditor({ userId, role }: { userId: string; role: string }) { const [pending, startTransition] = useTransition(); return <select disabled={pending} defaultValue={role} onChange={(event) => startTransition(async () => { await updateUserRole(userId, event.target.value) })} className="border border-black/15 bg-[#f3f0ea] px-3 py-2 text-xs"><option value="editor">Editor</option><option value="sales">Sales</option><option value="project_member">Project member</option><option value="finance">Finance</option><option value="support">Support</option><option value="admin">Admin</option><option value="owner">Owner</option></select> }
