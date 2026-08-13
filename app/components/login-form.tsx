'use client'

import { useActionState } from 'react'
import { signIn, type LoginState } from '../actions/auth'

const initialState: LoginState = { error: '' }

export function LoginForm({ next }: { next: '/admin' | '/portal' }) {
  const [state, action, pending] = useActionState(signIn, initialState)
  return <form action={action} className="mt-8 grid gap-4"><input type="hidden" name="next" value={next} /><label className="grid gap-2 text-xs font-bold">Username atau email<input required name="identifier" autoComplete="username" placeholder="namauser atau email@domain.com" className="border border-paper/25 bg-transparent px-4 py-3 text-sm font-normal outline-none focus:border-orange" /></label><label className="grid gap-2 text-xs font-bold">Password<input required type="password" name="password" minLength={6} autoComplete="current-password" className="border border-paper/25 bg-transparent px-4 py-3 text-sm font-normal outline-none focus:border-orange" /></label>{state.error && <p className="border border-orange/30 bg-orange/10 p-3 text-xs text-orange">{state.error}</p>}<button disabled={pending} className="mt-2 bg-paper px-5 py-4 text-xs font-bold text-ink disabled:opacity-60">{pending ? 'Memproses...' : 'Masuk ↗'}</button></form>
}
