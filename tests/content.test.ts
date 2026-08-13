import { describe, expect, it } from 'vitest'
import { industries, insights, projects, services } from '../lib/content'

describe('public content model', () => {
  it('keeps all SEO collections on unique stable slugs', () => {
    for (const collection of [services, industries, projects, insights]) {
      const slugs = collection.map((item) => item.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
      expect(slugs.every((slug) => /^[a-z0-9-]+$/.test(slug))).toBe(true)
    }
  })

  it('contains the six PRD service groups', () => { expect(services).toHaveLength(6) })
})
