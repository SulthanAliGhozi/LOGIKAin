import { cache } from 'react'
import { services as localServices, industries as localIndustries, projects as localProjects, insights as localInsights, type ContentItem } from './content'
import { createBrowserSupabaseClient } from './supabase/browser'
import { createClient } from './supabase/server'

const configured = process.env.NODE_ENV !== 'test' && Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

// Use browser client (no cookies) so this can safely be called from
// generateStaticParams() which runs outside of any request context.
// Wrapped in React cache() so parallel calls within the same render deduplicate.
async function published<T extends ContentItem>(table: string, fallback: T[]): Promise<T[]> {
  if (!configured) return fallback
  try {
    const supabase = createBrowserSupabaseClient()
    const { data, error } = await supabase.from(table).select('*').eq('status', 'published').order('updated_at', { ascending: false })
    if (error || !data?.length) return fallback
    return data.map((row) => ({ slug: row.slug, name: row.name || row.title, summary: row.summary || row.excerpt || row.short_description || '', body: row.body || row.content || row.overview || '', tags: row.tags || [], seoTitle: row.seo_title || undefined, seoDescription: row.seo_description || undefined, image: row.image_url || row.cover_image || row.image || undefined })) as unknown as T[]
  } catch { return fallback }
}

// cache() deduplicates identical calls within the same request/render tree
export const getServices   = cache(async () => published('content_services', localServices))
export const getIndustries = cache(async () => published('content_industries', localIndustries))
export const getProjects   = cache(async () => published('content_projects', localProjects))
export const getInsights   = cache(async () => published('content_insights', localInsights))

export async function getService(slug: string)  { return (await getServices()).find((item) => item.slug === slug) }
export async function getIndustry(slug: string) { return (await getIndustries()).find((item) => item.slug === slug) }
export async function getProject(slug: string)  { return (await getProjects()).find((item) => item.slug === slug) }
export async function getInsight(slug: string)  { return (await getInsights()).find((item) => item.slug === slug) }

// Testimonials are session-sensitive (admin-controlled visibility), so keep the
// cookie-based server client here.  This is only called from page components
// (inside a request), never from generateStaticParams.
export const getTestimonials = cache(async () => {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('testimonials').select('quote,author_name,author_role,company_name').eq('status', 'published').eq('featured', true).order('created_at', { ascending: false }).limit(3)
    return data || []
  } catch { return [] }
})
