import type { Metadata } from 'next'
import { PublicShell, PageIntro } from '../components/public-shell'
import { ContactForm } from '../components/contact-form'
export const metadata: Metadata = { title: 'Contact', description: 'Hubungi LOGIKAin untuk membicarakan kebutuhan bisnis dan digital Anda.' }
export default function ContactPage() { return <PublicShell><PageIntro eyebrow="CONTACT / 07" title={<>Let&apos;s make it<br /><em className="not-italic text-orange">make sense.</em></>} description="Ceritakan tantangan Anda. Kami akan membantu mencari logikanya bersama." /><section className="section-pad py-14 md:py-24"><ContactForm /></section></PublicShell> }
