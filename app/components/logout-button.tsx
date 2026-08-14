import { signOut } from '../actions/auth'

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="text-xs text-white/60 hover:text-white">Logout</button>
    </form>
  )
}
