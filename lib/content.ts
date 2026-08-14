export type ContentItem = { slug: string; name: string; summary: string; body: string; tags: string[]; seoTitle?: string; seoDescription?: string }

export const services: ContentItem[] = [
  { slug: 'website-umkm', name: 'Website UMKM', summary: 'Hadirkan bisnis Anda di Google 24 jam dengan website profesional yang siap mendatangkan pelanggan baru.', body: 'Mulai dari Web Starter (1 halaman profil & katalog WhatsApp) hingga Web Toko Online lengkap dengan keranjang belanja dan dashboard admin. Kami memastikan website Anda cepat, SEO-friendly, dan dioptimasi untuk layar HP.', tags: ['Web Profile', 'Toko Online', 'Katalog WhatsApp'] },
  { slug: 'manajemen-konten', name: 'Manajemen Konten', summary: 'Desain promosi, copywriting, dan kalender konten bulanan untuk menghidupkan media sosial bisnis Anda.', body: 'Kami menyusun strategi, membuat desain, menulis caption, hingga meriset hashtag agar akun bisnis Anda terlihat profesional dan siap menerima traffic. Tersedia paket harian hingga bulanan.', tags: ['Instagram Feed', 'Copywriting', 'Social Media'] },
  { slug: 'video-reels-tiktok', name: 'Video Reels & TikTok', summary: 'Konten video vertikal yang memancing interaksi (hook), lengkap dengan subtitle dan musik viral.', body: 'Tingkatkan jangkauan organik Anda dengan video pendek. Kami menyediakan paket express (3 video) hingga paket creator (10 video viral) yang sudah termasuk script dan hook yang teruji.', tags: ['Reels', 'TikTok', 'Video Vertikal'] },
  { slug: 'branding-desain', name: 'Branding & Identitas', summary: 'Logo, palet warna, dan aset desain yang membuat bisnis Anda terlihat jauh lebih kredibel dari kompetitor.', body: 'Identitas yang konsisten adalah kunci kepercayaan. Kami merancang logo utama, variasi logo, brand guide, hingga template sosial media agar bisnis UMKM Anda memiliki standar visual premium.', tags: ['Logo Design', 'Brand Guide', 'Visual Identity'] },
  { slug: 'dokumen-profesional', name: 'Dokumen Profesional', summary: 'Kebutuhan administrasi acara, proposal bisnis, hingga pembuatan CV & Portofolio ATS-friendly.', body: 'Jangan biarkan dokumen yang berantakan menggagalkan peluang Anda. Kami mendesain proposal, rundown acara, presentasi pitch deck, hingga CV profesional untuk pelamar kerja.', tags: ['Proposal', 'CV ATS', 'Pitch Deck'] }
]

export const industries: ContentItem[] = [
  { slug: 'fnb-kafe', name: 'F&B (Kafe & Resto)', summary: 'Website katalog menu dan branding sosial media untuk menarik pengunjung lokal.', body: 'Kami membantu bisnis F&B tampil di Google Maps dan Instagram dengan visual menggugah selera.', tags: ['Kafe', 'Restoran', 'Katering'] },
  { slug: 'jasa-lokal', name: 'Jasa Lokal (Salon, Laundry)', summary: 'Permudah pelanggan menemukan jasa Anda dan melakukan pemesanan via WhatsApp.', body: 'Sistem booking sederhana dan profil bisnis yang meyakinkan pelanggan di sekitar lokasi Anda.', tags: ['Salon', 'Laundry', 'Bengkel'] },
  { slug: 'retail-toko', name: 'Retail & Toko Oleh-oleh', summary: 'Katalog online yang bisa dibagikan dan sistem etalase digital tanpa potongan marketplace.', body: 'Fokus pada etalase produk yang bersih, mudah diakses, dan langsung terhubung ke admin toko.', tags: ['Retail', 'Toko Online', 'Distributor'] },
  { slug: 'profesional', name: 'Karir & Profesional', summary: 'Optimasi profil digital, portofolio, dan dokumen lamaran kerja.', body: 'Layanan khusus bagi individu yang ingin membangun personal branding yang kuat di dunia kerja.', tags: ['Portofolio', 'Karir', 'Personal Branding'] }
]

export const projects: ContentItem[] = [
  { slug: 'web-toko-kopi', name: 'Kopi Sudut Kota', summary: 'Website UMKM Starter dengan katalog menu dan direct WhatsApp.', body: 'Membantu kedai kopi lokal mendapatkan pesanan online tanpa bergantung pada aplikasi pihak ketiga yang memotong komisi.', tags: ['Website UMKM', 'F&B'] },
  { slug: 'rebranding-salon', name: 'Glow Beauty Salon', summary: 'Branding lengkap dan manajemen konten Instagram bulanan.', body: 'Merombak visual identitas salon agar menargetkan segmen premium dan meningkatkan booking harian.', tags: ['Branding', 'Social Media'] },
  { slug: 'cv-ats-profesional', name: 'Tech Talent Portofolio', summary: 'Desain ulang CV dan pembuatan website portofolio interaktif.', body: 'Membantu profesional IT menampilkan hasil kerjanya dengan elegan untuk dilirik oleh recruiter.', tags: ['Dokumen', 'Portofolio'] }
]

export const insights: ContentItem[] = [
  { slug: 'pentingnya-website-umkm', name: 'Mengapa UMKM Butuh Website di 2026', summary: 'Sosial media bukan milik Anda, website adalah aset digital permanen.', body: 'Bergantung sepenuhnya pada Instagram atau TikTok sangat berisiko. Algoritma berubah, akun bisa diblokir. Website adalah satu-satunya properti digital yang Anda kendalikan 100%.', tags: ['Website', 'Bisnis Lokal'] },
  { slug: 'formula-video-vertikal', name: 'Formula Hook untuk Video Reels', summary: 'Cara menahan audiens di 3 detik pertama video Anda.', body: 'Audiens saat ini memiliki rentang perhatian yang sangat pendek. Jika 3 detik pertama (hook) gagal, video Anda akan di-scroll.', tags: ['Video', 'TikTok'] }
]
