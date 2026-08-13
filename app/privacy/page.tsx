import type { Metadata } from 'next'
import { PublicShell, PageIntro } from '../components/public-shell'

export const metadata: Metadata = { title: 'Privacy', description: 'Kebijakan privasi LOGIKAin.' }

export default function PrivacyPage() {
  return <PublicShell><PageIntro eyebrow="LEGAL / 09" title={<>Privacy by<br /><em className="not-italic text-orange">default.</em></>} description="Kami mengumpulkan data seperlunya untuk merespons permintaan dan menjalankan layanan dengan aman." /><section className="section-pad prose prose-neutral max-w-3xl py-14 md:py-24"><h2>Data yang kami terima</h2><p>Formulir dapat mengirimkan nama, email, perusahaan, dan konteks kebutuhan Anda. Data tersebut digunakan untuk komunikasi bisnis dan tidak dijual kepada pihak lain.</p><h2>Keamanan dan akses</h2><p>Akses internal, portal klien, file, dan dokumen komersial dibatasi melalui autentikasi, membership, authorization server, dan kebijakan database.</p><h2>Permintaan Anda</h2><p>Untuk meminta koreksi atau penghapusan data, hubungi hello@logikain.id.</p></section></PublicShell>
}
