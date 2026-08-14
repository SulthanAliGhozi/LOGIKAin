export const STAFF_ROLES = ['editor', 'sales', 'project_member', 'finance', 'support', 'admin', 'owner'] as const
export type StaffRole = typeof STAFF_ROLES[number]
export type StaffPermission = 'content' | 'leads' | 'clients' | 'delivery' | 'commercial' | 'finance' | 'support' | 'media' | 'seo' | 'automation' | 'settings' | 'users' | 'audit'

const PERMISSIONS: Record<StaffPermission, readonly StaffRole[]> = {
  content: ['editor', 'admin', 'owner'],
  leads: ['sales', 'admin', 'owner'],
  clients: ['sales', 'admin', 'owner'],
  delivery: ['project_member', 'admin', 'owner'],
  commercial: ['sales', 'finance', 'admin', 'owner'],
  finance: ['finance', 'admin', 'owner'],
  support: ['support', 'admin', 'owner'],
  media: ['editor', 'admin', 'owner'],
  seo: ['editor', 'admin', 'owner'],
  automation: ['admin', 'owner'],
  settings: ['admin', 'owner'],
  users: ['admin', 'owner'],
  audit: ['admin', 'owner'],
}

export function isStaffRole(role: string): role is StaffRole {
  return (STAFF_ROLES as readonly string[]).includes(role)
}

export function canStaff(role: string, permission: StaffPermission) {
  return isStaffRole(role) && PERMISSIONS[permission].includes(role)
}

export function allowedAdminNav(role: string) {
  return new Set(Object.entries(PERMISSIONS).filter(([, roles]) => roles.includes(role as StaffRole)).map(([permission]) => permission))
}

export function adminPermissionForPath(pathname: string): StaffPermission | null {
  if (pathname === '/admin' || pathname === '/admin/setup') return null
  if (pathname.startsWith('/admin/content') || pathname.startsWith('/admin/services') || pathname.startsWith('/admin/industries') || pathname.startsWith('/admin/insights') || pathname.startsWith('/admin/testimonials')) return 'content'
  if (pathname.startsWith('/admin/media')) return 'media'
  if (pathname.startsWith('/admin/seo')) return 'seo'
  if (pathname.startsWith('/admin/leads')) return 'leads'
  if (pathname.startsWith('/admin/clients')) return 'clients'
  if (pathname.startsWith('/admin/projects') || pathname.startsWith('/admin/delivery')) return 'delivery'
  if (pathname.startsWith('/admin/quotations') || pathname.startsWith('/admin/sales-sprint') || pathname.startsWith('/admin/b2c-store')) return 'commercial'
  if (pathname.startsWith('/admin/invoices') || pathname.startsWith('/admin/finance')) return 'finance'
  if (pathname.startsWith('/admin/support')) return 'support'
  if (pathname.startsWith('/admin/automation')) return 'automation'
  if (pathname.startsWith('/admin/settings')) return 'settings'
  if (pathname.startsWith('/admin/users')) return 'users'
  if (pathname.startsWith('/admin/audit') || pathname.startsWith('/admin/activity')) return 'audit'
  return null
}
