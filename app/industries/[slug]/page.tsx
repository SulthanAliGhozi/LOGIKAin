import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getIndustries, getIndustry } from '../../../lib/content-repository'
import { PublicShell } from '../../components/public-shell'
export const dynamicParams = true
export async function generateStaticParams() { return (await getIndustries()).map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getIndustry(slug);
  if (!item) return {};
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://logikain.id'}/industries/${slug}`;
  return {
    title: item.seoTitle || item.name,
    description: item.seoDescription || item.summary,
    alternates: { canonical: `/industries/${slug}` },
    openGraph: { title: item.seoTitle || item.name, description: item.seoDescription || item.summary, url, type: 'article', ...(item.image && { images: [item.image] }) },
    twitter: { card: 'summary_large_image', title: item.seoTitle || item.name, description: item.seoDescription || item.summary, ...(item.image && { images: [item.image] }) },
  };
}
export default async function IndustryDetail({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const item = await getIndustry(slug); if (!item) notFound(); return <PublicShell><section className="section-pad py-20 md:py-28"><p className="mono text-[10px] text-muted">INDUSTRIES / DETAIL</p><h1 className="display mt-5 max-w-4xl text-[48px] font-extrabold md:text-[82px]">{item.name}<br /><em className="not-italic text-orange">has a logic.</em></h1><p className="mt-7 max-w-2xl text-lg leading-8 text-muted">{item.summary}</p><div className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-[1fr_2fr]"><p className="mono text-[10px] text-muted">OUR PERSPECTIVE</p><div><p className="text-xl leading-9">{item.body}</p><div className="mt-10 flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="border border-line px-3 py-2 text-xs text-muted">{tag}</span>)}</div><a href="/contact" className="mt-12 inline-block bg-ink px-5 py-4 text-xs font-bold text-paper">Talk to us ↗</a></div></div></section></PublicShell> }
