# LOGIKAin Master Platform

Next.js App Router + TypeScript + Tailwind + Supabase foundation for the LOGIKAin Master Platform PRD.

## Local setup

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Run the SQL migrations in `supabase/migrations` in order, or apply them through the Supabase CLI in a linked project. Create at least one Supabase Auth user and a matching `profiles` row before opening `/admin`.

## Main surfaces

- Public acquisition: `/`, `/about`, `/services`, `/industries`, `/projects`, `/insights` (alias `/insight`), `/process`, `/contact`, `/start-project`
- Internal operations: `/admin`
- Client experience: `/portal`
- Health: `/api/health`

## Environment

See `.env.example`. Provider integrations are server-only and intentionally adapter-based. Do not expose service-role keys, payment secrets, AI keys, or webhook secrets in `NEXT_PUBLIC_*` variables.

## Automation runner

The protected endpoint `POST /api/automation/run` processes queued, idempotent jobs. Schedule it from Vercel Cron or another trusted scheduler with `Authorization: Bearer $AUTOMATION_CRON_SECRET`. Jobs are claimed atomically and record attempts, failures, and completion time.

## Supabase database setup

Untuk project Supabase baru, jalankan satu file `supabase/LOGIKAin.sql` di SQL Editor. File ini sudah menggabungkan seluruh schema, policy, storage bucket, seed, dan trigger profile dalam urutan dependency yang benar. File gabungan tersebut mempertahankan urutan logical migration berikut: `001_contact_leads.sql`, `002_master_platform_core.sql`, `003_operations_automation.sql`, `004_storage_policies.sql`, `005_invoice_snapshots.sql`, `006_seed_public_content.sql`, `007_client_project_file_access.sql`, `008_client_support_messages.sql`, `009_staff_access_policies.sql`, `010_profile_on_signup.sql`, dan `011_prd_completion_entities.sql`.

Gunakan `supabase/LOGIKAin.sql` sebagai satu-satunya file schema, policy, trigger, storage, dan seed. Folder `supabase/migrations` tidak diperlukan untuk setup aplikasi ini; file utama ditujukan untuk project Supabase baru dan jangan dijalankan ulang pada database yang sudah terisi.

Untuk menjalankan file tersebut ke database yang sudah terhubung, gunakan `npm run db:push`. Command ini menjalankan ulang schema lengkap secara idempotent; perubahan berikutnya cukup ditambahkan ke `supabase/LOGIKAin.sql`.

## Panduan penggunaan menyeluruh

### 1. Menjalankan website

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Buka `http://localhost:3000`. Halaman publik utama berisi proposition, solusi, proof, diagnostic prioritas, proses kerja, dan form percakapan. Form contact/start-project menyimpan lead ke Supabase.

### 2. Menyiapkan Supabase

1. Isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` pada `.env.local`.
2. Jalankan seluruh isi `supabase/LOGIKAin.sql` di SQL Editor, atau gunakan `npm run db:push` setelah project ter-link.
3. Admin dapat membuat user langsung dari `/admin/users` memakai email dan password; user langsung bisa login. Tombol ini membutuhkan `SUPABASE_SERVICE_ROLE_KEY` server-only.
4. User baru juga dapat registrasi mandiri di `/login`. Setelah email dikonfirmasi, admin menghubungkan akun ke client melalui `/admin/clients` agar portal dapat dibuka.
5. Admin dapat mengganti role dari tabel `/admin/users`. Role yang tersedia: `owner`, `admin`, `editor`, `sales`, `project_member`, `finance`, dan `support`.

Jika email provider Supabase belum dikonfigurasi, invitation tetap memerlukan konfigurasi SMTP bawaan/custom Supabase agar email benar-benar sampai.

File SQL juga memiliki seed idempotent untuk konten publik, demo lead, client, project, milestone, task, quote, invoice, support ticket, testimonial, technologies, site settings, dan navigation. Seed tidak membuat Auth user atau password.

### 3. Operasional admin

- `Content & SEO`: buat, edit, publish, dan hapus service, industry, project, serta insight.
- `Leads`: buat lead manual dan ubah status pipeline.
- `Clients`: kelola client dan akses portal.
- `Projects` / `Delivery workspace`: kelola project, milestone, task, approval, file, dan feedback.
- `Quotations` / `Finance workspace`: buat quote, invoice, payment, item, snapshot, dan status komersial.
- `Support`: proses ticket, ubah status/prioritas, dan komunikasi.
- `Media library`: upload asset lalu lengkapi metadata/alt text.
- `Automation`: pantau job queued/running/succeeded/failed.
- `Settings`: ubah konfigurasi homepage, navigation, dan contact.
- `Users & roles`: atur role operator. Minimal satu owner aktif selalu dipertahankan.
- `Activity log` dan `Audit log`: lacak perubahan operasional.

Semua mutation admin memakai server action, validasi Zod, pemeriksaan role, RLS Supabase, revalidation cache, dan pencatatan activity log. Data komersial yang sudah accepted/issued/paid dilindungi agar tidak diedit secara destruktif.

### 4. Client portal

Hubungkan Auth user ke client melalui `/admin/clients`. Client aktif dapat menggunakan `/portal` untuk melihat project, milestone, task yang visible, file, quotation, invoice, approval, dan support ticket. Visibility file/task/message dikontrol di database, bukan hanya di UI.

### 5. Automation

Endpoint `POST /api/automation/run` dipanggil scheduler tepercaya dengan header `Authorization: Bearer $AUTOMATION_CRON_SECRET`. Job bersifat idempotent dan menyimpan attempts/error.

### 6. QA dan release

```powershell
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

UI publik menggunakan breakpoint mobile, tablet, dan desktop; tabel admin memakai horizontal scrolling pada layar sempit agar data tidak terpotong. Sebelum release, uji `/`, `/services`, `/projects`, `/insights`, `/start-project`, `/login`, dan seluruh menu `/admin` dengan akun role yang sesuai.
