import type { MetadataRoute } from 'next'
import { getServices, getIndustries, getProjects, getInsights } from '../lib/content-repository'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://logikain.id')
  const [services, industries, projects, insights] = await Promise.all([getServices(), getIndustries(), getProjects(), getInsights()])
  const pages = ['/about', '/services', '/industries', '/projects', '/insights', '/process', '/contact', '/start-project', '/privacy', '/terms']
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...pages.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: .8 })),
    ...services.map(({ slug }) => ({ url: `${base}/services/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: .7 })),
    ...industries.map(({ slug }) => ({ url: `${base}/industries/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: .7 })),
    ...projects.map(({ slug }) => ({ url: `${base}/projects/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: .7 })),
    ...insights.map(({ slug }) => ({ url: `${base}/insights/${slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: .7 })),
  ]
}
