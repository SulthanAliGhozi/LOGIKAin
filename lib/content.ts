export type ContentItem = { slug: string; name: string; summary: string; body: string; tags: string[]; seoTitle?: string; seoDescription?: string }

export const services: ContentItem[] = [
  { slug: 'software-digital-product', name: 'Software & Digital Product', summary: 'Produk digital yang fungsional, mudah dipakai, dan dibangun untuk bertumbuh.', body: 'Kami merancang dan membangun website, aplikasi, dashboard, serta digital product yang menyatukan kebutuhan bisnis dan pengalaman pengguna.', tags: ['Product strategy', 'Web platform', 'UX/UI'] },
  { slug: 'ai-automation-integration', name: 'AI, Automation & Integration', summary: 'Otomasi yang mengurangi pekerjaan berulang dan membuat alur kerja lebih cerdas.', body: 'Mulai dari AI agent, workflow automation, hingga integrasi antarsistem, kami membantu tim menghemat waktu tanpa kehilangan kendali.', tags: ['AI agent', 'Automation', 'API integration'] },
  { slug: 'branding-digital-identity', name: 'Branding & Digital Identity', summary: 'Identitas yang menjadikan bisnis mudah dikenali, dipercaya, dan diingat.', body: 'Kami menyusun fondasi brand, visual identity, dan digital touchpoint yang konsisten dari strategi sampai eksekusi.', tags: ['Brand strategy', 'Visual identity', 'Guidelines'] },
  { slug: 'creative-content', name: 'Creative & Content', summary: 'Cerita dan konten yang menjelaskan nilai bisnis Anda dengan lebih kuat.', body: 'Konten strategis membantu ide kompleks menjadi pesan yang sederhana, relevan, dan bergerak menuju aksi.', tags: ['Content system', 'Campaign', 'Creative direction'] },
  { slug: 'document-business-support', name: 'Document & Business Support', summary: 'Dokumen dan sistem pendukung untuk operasi bisnis yang lebih rapi.', body: 'Kami membantu menata dokumen, template, knowledge base, dan alur administratif agar tim bekerja dengan standar yang sama.', tags: ['Documentation', 'Knowledge base', 'Operations'] },
  { slug: 'digital-transformation', name: 'Digital Transformation', summary: 'Peta jalan dan implementasi untuk membawa bisnis ke cara kerja berikutnya.', body: 'Transformasi dimulai dari pemahaman proses, lalu diterjemahkan menjadi prioritas, sistem, dan kebiasaan baru yang bisa dipakai.', tags: ['Discovery', 'Roadmap', 'Change enablement'] },
]

export const industries: ContentItem[] = [
  { slug: 'umkm', name: 'UMKM', summary: 'Sistem sederhana untuk membuat bisnis kecil lebih siap bertumbuh.', body: 'Kami membantu UMKM mengurangi pekerjaan manual dan membangun fondasi digital yang sesuai kapasitas tim.', tags: ['Efisiensi', 'Penjualan', 'Operasional'] },
  { slug: 'startup', name: 'Startup', summary: 'Kecepatan membangun tanpa kehilangan struktur.', body: 'Dari validasi produk sampai operating system, kami membantu startup mengambil keputusan dengan cepat dan terukur.', tags: ['MVP', 'Scale-up', 'Product'] },
  { slug: 'pendidikan', name: 'School & Education', summary: 'Pengalaman digital yang membuat belajar dan mengelola institusi lebih mudah.', body: 'Teknologi untuk sekolah, lembaga pendidikan, dan komunitas belajar yang human-centered.', tags: ['Learning', 'Community', 'Administration'] },
  { slug: 'corporate', name: 'Company & Corporate', summary: 'Solusi digital yang menghubungkan proses, tim, dan pelanggan.', body: 'Kami membantu organisasi kompleks membangun sistem yang lebih jelas, terhubung, dan siap diaudit.', tags: ['Integration', 'Governance', 'Growth'] },
]

export const projects: ContentItem[] = [
  { slug: 'operating-system-bisnis', name: 'Operating System Bisnis', summary: 'Menyatukan alur lead, delivery, dan insight dalam satu cara kerja.', body: 'Sebuah fondasi digital untuk membantu tim mengurangi duplikasi data dan melihat prioritas dari satu sumber kebenaran.', tags: ['Platform', 'Operations', 'CRM'] },
  { slug: 'ai-agent-untuk-tim', name: 'AI Agent untuk Tim', summary: 'Mengubah pekerjaan berulang menjadi alur otomatis yang tetap bisa diawasi manusia.', body: 'Sistem AI agent dengan review manusia, log aktivitas, dan batasan yang jelas untuk menjaga kualitas keputusan.', tags: ['AI', 'Automation', 'Workflow'] },
  { slug: 'digital-identity-system', name: 'Digital Identity System', summary: 'Membawa identitas brand ke setiap titik digital dengan konsisten.', body: 'Sistem identitas yang membantu tim membuat konten, halaman, dan komunikasi yang terasa satu kesatuan.', tags: ['Branding', 'Design system', 'Content'] },
]

export const insights: ContentItem[] = [
  { slug: 'mulai-dari-masalah-yang-benar', name: 'Mulai dari masalah yang benar', summary: 'Mengapa sistem digital yang baik selalu dimulai dari pemahaman proses.', body: 'Sebelum memilih tools, pahami dulu siapa yang bekerja, apa yang menghambat, dan hasil apa yang ingin dicapai.', tags: ['Strategy', 'Digital transformation'] },
  { slug: 'ai-agent-dengan-human-review', name: 'AI agent dengan human review', summary: 'Otomasi yang bertanggung jawab tetap menyisakan ruang untuk penilaian manusia.', body: 'AI paling berguna ketika ia mempercepat pekerjaan tanpa menghapus konteks, akuntabilitas, dan keputusan manusia.', tags: ['AI', 'Operations'] },
  { slug: 'seo-sebagai-sistem', name: 'SEO sebagai sistem', summary: 'SEO bukan checklist satu kali, melainkan arsitektur pengetahuan yang terus tumbuh.', body: 'Struktur halaman, internal linking, konten, data terstruktur, dan pengukuran harus dirancang sebagai satu sistem.', tags: ['SEO', 'Content'] },
]
