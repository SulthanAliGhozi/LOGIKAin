import type { Metadata } from 'next'
import { getServices } from '../../lib/content-repository'
import { PublicShell, PageIntro, CardGrid } from '../components/public-shell'
export const metadata: Metadata = { title: 'Layanan', description: 'Enam kelompok layanan LOGIKAin untuk teknologi, kreativitas, otomasi, dan transformasi bisnis.' }
export default async function ServicesPage() { const services = await getServices(); return <PublicShell><PageIntro eyebrow="SERVICES / 02" title={<>Solusi untuk<br /><em className="not-italic text-orange">bergerak maju.</em></>} description="Dari fondasi brand hingga sistem digital yang terintegrasi, kami membantu bisnis memilih dan membangun hal yang paling penting." /><CardGrid items={services} prefix="/services" /></PublicShell> }
