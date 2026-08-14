import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getInsights, getInsight } from '../../../lib/content-repository'
import { PublicShell } from '../../components/public-shell'
export const dynamicParams = true
export async function generateStaticParams() { return (await getInsights()).map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getInsight(slug);
  if (!item) return {};
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://logikain.id'}/insights/${slug}`;
  return {
    title: item.seoTitle || item.name,
    description: item.seoDescription || item.summary,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: { title: item.seoTitle || item.name, description: item.seoDescription || item.summary, url, type: 'article', ...(item.image && { images: [item.image] }) },
    twitter: { card: 'summary_large_image', title: item.seoTitle || item.name, description: item.seoDescription || item.summary, ...(item.image && { images: [item.image] }) },
  };
}
export default async function InsightDetail({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const item = await getInsight(slug); if (!item) notFound(); const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: item.name, description: item.summary, author: { '@type': 'Organization', name: 'LOGIKAin' } }; return <PublicShell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><article className="section-pad py-20 md:py-28"><p className="mono text-[10px] text-muted">INSIGHTS / ARTICLE</p><h1 className="display mt-5 max-w-4xl text-[48px] font-extrabold md:text-[82px]">{item.name}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-muted">{item.summary}</p><div className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-[1fr_2fr]"><p className="mono text-[10px] text-muted">READ / 5 MIN</p><div className="space-y-6 text-base leading-8 text-muted"><p>{item.body}</p><p>Ide yang baik tidak berhenti di insight. Ia menjadi pertanyaan yang lebih tajam, keputusan yang lebih baik, dan cara kerja yang lebih masuk akal.</p><div className="mono text-[10px] text-orange">{item.tags.join(' · ')}</div></div></div></article></PublicShell> }
