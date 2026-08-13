import type { Metadata } from 'next'
import { PublicShell, PageIntro } from '../components/public-shell'

export const metadata: Metadata = { title: 'Terms', description: 'Syarat penggunaan layanan LOGIKAin.' }

export default function TermsPage() {
  return <PublicShell><PageIntro eyebrow="LEGAL / 10" title={<>Work with<br /><em className="not-italic text-orange">clarity.</em></>} description="Syarat umum penggunaan website dan kolaborasi dengan LOGIKAin." /><section className="section-pad prose prose-neutral max-w-3xl py-14 md:py-24"><h2>Penggunaan website</h2><p>Konten website disediakan untuk informasi umum. Anda bertanggung jawab atas kebenaran informasi yang dikirim melalui formulir.</p><h2>Kolaborasi dan dokumen komersial</h2><p>Ruang lingkup, harga, jadwal, pembayaran, dan penerimaan pekerjaan mengikuti quotation atau perjanjian yang disetujui para pihak.</p><h2>Kontak</h2><p>Hubungi hello@logikain.id untuk pertanyaan tentang syarat penggunaan.</p></section></PublicShell>
}
