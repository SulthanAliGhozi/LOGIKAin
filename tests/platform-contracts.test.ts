import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

describe('platform release contracts', () => {
  it('keeps Supabase migrations ordered and documented', () => {
    const migrations = readFileSync('README.md', 'utf8')
    for (const migration of ['001_contact_leads.sql', '002_master_platform_core.sql', '003_operations_automation.sql', '004_storage_policies.sql', '005_invoice_snapshots.sql', '006_seed_public_content.sql', '007_client_project_file_access.sql', '008_client_support_messages.sql', '009_staff_access_policies.sql']) expect(migrations).toContain(migration)
  })

  it('contains server-side automation processing and private file access', () => {
    expect(readFileSync('lib/automation/processor.ts', 'utf8')).toContain('lead_acknowledgment')
    expect(readFileSync('lib/automation/processor.ts', 'utf8')).toContain('invoice_due_reminder')
    expect(readFileSync('supabase/LOGIKAin.sql', 'utf8')).toContain('client_visible = true')
  })

  it('does not leave misleading read-only create controls in generic admin modules', () => {
    expect(readFileSync('app/components/admin-module.tsx', 'utf8')).not.toContain('+ New record')
    expect(readFileSync('app/admin/support/page.tsx', 'utf8')).toContain('SupportTicketActions')
  })

  it('contains final PRD completion entities and commercial history guards', () => {
    const sql = readFileSync('supabase/LOGIKAin.sql', 'utf8')
    for (const table of ['testimonials', 'project_media', 'project_services', 'project_technologies', 'quote_items', 'invoice_items', 'lead_notes', 'client_notes', 'support_attachments', 'site_settings', 'navigation_items']) expect(sql).toContain(`public.${table}`)
    expect(sql).toContain('Accepted quotation is immutable')
    expect(sql).toContain('Issued invoice is immutable')
    expect(sql).toContain('public.project_feedback')
    expect(sql).toContain('public.product_entitlements')
  })

  it('contains the PRD portal and CMS route families', () => {
    for (const route of [
      'app/admin/services/page.tsx', 'app/admin/industries/page.tsx', 'app/admin/insights/page.tsx',
      'app/portal/projects/[id]/page.tsx', 'app/portal/invoices/page.tsx',
    ]) expect(readFileSync(route, 'utf8')).toBeTruthy()
    expect(readFileSync('app/portal/quotations/page.tsx', 'utf8')).toContain('PortalQuotationActions')
    expect(readFileSync('app/robots.ts', 'utf8')).toContain("'/portal'")
  })
})
