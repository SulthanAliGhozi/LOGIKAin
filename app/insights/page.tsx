import type { Metadata } from 'next'
import { getInsights } from '../../lib/content-repository'
import { PublicShell, PageIntro, CardGrid } from '../components/public-shell'
export const metadata: Metadata = { title: 'Insights', description: 'Gagasan tentang teknologi, bisnis, AI, dan transformasi digital dari LOGIKAin.' }
export default async function InsightsPage() { const insights = await getInsights(); return <PublicShell><PageIntro eyebrow="INSIGHTS / 05" title={<>Ideas that<br /><em className="not-italic text-orange">move thinking.</em></>} description="Catatan tentang cara membuat teknologi lebih masuk akal untuk bisnis dan manusia yang menggunakannya." /><CardGrid items={insights} prefix="/insights" /></PublicShell> }
