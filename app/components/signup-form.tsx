'use client'

import { useActionState } from 'react'
import { signUp, type LoginState } from '../actions/auth'

const initialState: LoginState = { error: '' }

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, initialState)
  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-xs font-bold">
        Username
        <input required name="username" minLength={3} pattern="[A-Za-z0-9._-]+" autoComplete="username" placeholder="namauser" className="border border-paper/25 bg-transparent px-4 py-3 text-sm outline-none focus:border-orange" />
        <span className="text-[11px] font-normal text-paper/50">3–40 karakter: huruf, angka, titik, garis bawah, atau strip.</span>
      </label>
      <label className="grid gap-2 text-xs font-bold">
        Nama lengkap
        <input required name="full_name" autoComplete="name" className="border border-paper/25 bg-transparent px-4 py-3 text-sm outline-none focus:border-orange" />
      </label>
      <label className="grid gap-2 text-xs font-bold">
        Email
        <input required type="email" name="email" autoComplete="email" className="border border-paper/25 bg-transparent px-4 py-3 text-sm outline-none focus:border-orange" />
      </label>
      <label className="grid gap-2 text-xs font-bold">
        Password
        <input required type="password" name="password" minLength={8} autoComplete="new-password" className="border border-paper/25 bg-transparent px-4 py-3 text-sm outline-none focus:border-orange" />
      </label>
      {state.error && <p className="border border-orange/30 bg-orange/10 p-3 text-xs text-orange">{state.error}</p>}
      <button disabled={pending} className="border border-paper/30 px-5 py-4 text-xs font-bold text-paper disabled:opacity-60">
        {pending ? 'Membuat akun...' : 'Buat akun & masuk'}
      </button>
    </form>
  )
}
