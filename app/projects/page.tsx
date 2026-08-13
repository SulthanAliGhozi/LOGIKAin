import type { Metadata } from 'next'
import { getProjects } from '../../lib/content-repository'
import { PublicShell, PageIntro, CardGrid } from '../components/public-shell'
export const metadata: Metadata = { title: 'Projects', description: 'Portfolio dan case study LOGIKAin.' }
export default async function ProjectsPage() { const projects = await getProjects(); return <PublicShell><PageIntro eyebrow="PROJECTS / 04" title={<>Proof of<br /><em className="not-italic text-orange">thinking.</em></>} description="Proyek bukan sekadar hasil akhir. Ia adalah bukti dari masalah yang dipahami, keputusan yang dibuat, dan dampak yang dihasilkan." /><CardGrid items={projects} prefix="/projects" /></PublicShell> }
