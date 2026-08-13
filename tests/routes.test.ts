import { describe, expect, it } from 'vitest'

describe('release route inventory', () => {
  it('keeps protected surfaces out of the public sitemap contract', async () => {
    const sitemap = await import('../app/sitemap')
    const entries = (await sitemap.default()).map((entry) => entry.url)
    expect(entries.some((url) => url.includes('/admin'))).toBe(false)
    expect(entries.some((url) => url.includes('/portal'))).toBe(false)
  })
})
