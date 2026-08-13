import type { Metadata } from 'next'
import { getIndustries } from '../../lib/content-repository'
import { PublicShell, PageIntro, CardGrid } from '../components/public-shell'
export const metadata: Metadata = { title: 'Industri', description: 'Solusi digital LOGIKAin untuk UMKM, startup, pendidikan, dan corporate.' }
export default async function IndustriesPage() { const industries = await getIndustries(); return <PublicShell><PageIntro eyebrow="INDUSTRIES / 03" title={<>Setiap konteks<br /><em className="not-italic text-orange">punya logikanya.</em></>} description="Kami mulai dari cara bisnis Anda berjalan—bukan dari template solusi yang sama untuk semua orang." /><CardGrid items={industries} prefix="/industries" /></PublicShell> }
