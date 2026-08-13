import { test, expect } from '@playwright/test'

test('public home exposes the primary proposition and navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/LOGIKAin/)
  await expect(page.getByText('Bangun sistem digital yang membuat bisnis', { exact: false })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Mulai percakapan' })).toBeVisible()
})

test('public SEO endpoints are available and exclude protected surfaces', async ({ request }) => {
  const robots = await request.get('/robots.txt'); expect(robots.ok()).toBeTruthy(); expect(await robots.text()).toContain('/sitemap.xml')
  const sitemap = await request.get('/sitemap.xml'); expect(sitemap.ok()).toBeTruthy(); const body = await sitemap.text(); expect(body).not.toContain('/admin'); expect(body).not.toContain('/portal')
})

test('public pages render across desktop, tablet, and mobile widths', async ({ page }) => {
  test.setTimeout(120000)
  const pages = ['/', '/about', '/services', '/industries', '/projects', '/insights', '/process', '/contact', '/start-project', '/privacy', '/terms']
  const viewports = [{ width: 1440, height: 900 }, { width: 1024, height: 900 }, { width: 390, height: 844 }]
  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    for (const path of pages) {
      const response = await page.goto(path)
      expect(response?.ok(), `${path} at ${viewport.width}px`).toBeTruthy()
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${path} overflows at ${viewport.width}px`).toBeLessThanOrEqual(2)
    }
  }
})

test('homepage brand assets load successfully', async ({ page }) => {
  await page.goto('/')
  expect(await page.locator('img[alt="Ikon LOGIKAin"]').evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await expect(page.locator('img[alt="Ikon LOGIKAin"]')).not.toHaveAttribute('src', /icon%20logikain/)
})
