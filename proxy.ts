import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { adminPermissionForPath, canStaff } from './lib/auth/permissions'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) },
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  const permission = adminPermissionForPath(request.nextUrl.pathname)
  if (user && permission) {
    const { data: profile } = await supabase.from('profiles').select('role,status').eq('id', user.id).maybeSingle()
    if (!profile || profile.status !== 'active' || !canStaff(profile.role, permission)) {
      return NextResponse.redirect(new URL('/admin?error=forbidden', request.url))
    }
  }
  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] }
