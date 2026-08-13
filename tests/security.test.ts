import { describe, expect, it } from 'vitest'

describe('security contracts', () => {
  it('does not expose server secrets as public variables', () => {
    expect(Object.keys(process.env).filter((key) => key.startsWith('NEXT_PUBLIC_') && /SECRET|SERVICE_ROLE|PRIVATE|API_KEY/i.test(key))).toEqual([])
  })
})
