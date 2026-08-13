import type { ReactNode } from 'react'

// Setup page punya layout sendiri — tidak inherit admin layout
// supaya user yang belum jadi owner tetap bisa akses halaman ini
export default function SetupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
