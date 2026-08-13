import type { Metadata } from 'next'
import { PublicShell, PageIntro } from '../components/public-shell'
import { ContactForm } from '../components/contact-form'
export const metadata: Metadata = { title: 'Start a Project', description: 'Mulai percakapan tentang project digital Anda bersama LOGIKAin.' }
export default function StartProjectPage() { return <PublicShell><PageIntro eyebrow="START PROJECT / 08" title={<>Start with<br /><em className="not-italic text-orange">the why.</em></>} description="Brief singkat membantu kami memahami konteks, target, budget, timeline, dan bentuk kolaborasi yang paling tepat." /><section className="section-pad py-14 md:py-24"><ContactForm projectBrief /></section></PublicShell> }
