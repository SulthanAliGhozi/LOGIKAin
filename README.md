# LOGIKAin Master Platform

> **"Yang rumit, kami LOGIKAin."** — Platform digital operasional lengkap: website publik, CMS, CRM, project delivery, billing, client portal, dan automation dalam satu sistem.

---

## Daftar Isi

1. [Setup Lokal](#1-setup-lokal)
2. [Setup Supabase Database](#2-setup-supabase-database)
3. [Environment Variables](#3-environment-variables)
4. [Setup Awal — Buat Akun Owner Pertama](#4-setup-awal--buat-akun-owner-pertama)
5. [Halaman Publik Website](#5-halaman-publik-website)
6. [Semua Role & Hak Akses](#6-semua-role--hak-akses)
7. [Admin Panel — Panduan Per Modul](#7-admin-panel--panduan-per-modul)
8. [Client Portal — Panduan Lengkap](#8-client-portal--panduan-lengkap)
9. [Cara Onboard Client Baru](#9-cara-onboard-client-baru)
10. [Automation & Cron Jobs](#10-automation--cron-jobs)
11. [QA & Release](#11-qa--release)
12. [Deployment Vercel](#12-deployment-vercel)
13. [Kolaborasi GitHub](#13-kolaborasi-github)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Setup Lokal

```powershell
# 1. Salin file environment
Copy-Item .env.example .env

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev
```

Buka `http://localhost:3000` — website publik langsung tampil tanpa login.

---

## 2. Setup Supabase Database

### Daftar migrasi yang tercakup

File `supabase/LOGIKAin.sql` adalah bootstrap database yang menggabungkan migrasi berikut: `001_contact_leads.sql`, `002_master_platform_core.sql`, `003_operations_automation.sql`, `004_storage_policies.sql`, `005_invoice_snapshots.sql`, `006_seed_public_content.sql`, `007_client_project_file_access.sql`, `008_client_support_messages.sql`, `009_staff_access_policies.sql`, `010_profile_on_signup.sql`, `011_prd_completion_entities.sql`, `012_seed_operations_demo_data.sql`, dan `012_username_auth.sql`.

**Untuk project Supabase baru:**

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) → project Anda
2. Masuk ke **SQL Editor**
3. Copy seluruh isi file `supabase/LOGIKAin.sql` → paste → klik **Run**
4. Selesai — semua tabel, policy RLS, trigger, storage bucket, dan seed data sudah terbuat

**Atau via CLI:**
```powershell
npm run db:push
```

> ⚠️ Untuk database produksi, backup dahulu dan jangan menjalankan bootstrap berulang tanpa memahami perubahan schema. Pastikan bucket `public-media` dan `private-project-files`, RLS, trigger profile, policy staff, dan policy client sudah terbentuk.

---

## 3. Environment Variables

Isi file `.env` berdasarkan `.env.example`:

| Variable | Keterangan | Wajib |
|----------|-----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase Anda | ✅ |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon/publishable key Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only, **jangan** prefix `NEXT_PUBLIC_`) | ✅ |
| `NEXT_PUBLIC_SITE_URL` | URL produksi (misal: `https://logikain.id`) | Direkomendasikan |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID (opsional) | Opsional |
| `AUTOMATION_CRON_SECRET` | Secret untuk endpoint automation cron | Opsional |

> `SUPABASE_SERVICE_ROLE_KEY` dibutuhkan untuk: login dengan username, buat user (admin & self-register), dan fitur manajemen user. Tanpa key ini, fitur-fitur tersebut tidak berfungsi.

---

## 4. Setup Awal — Buat Akun Owner Pertama

Ini langkah **wajib** sebelum bisa menggunakan admin panel sepenuhnya.

### Langkah-langkah:

**Step 1:** Daftar akun di `/register` atau login di `/login`

**Step 2:** Buka `http://localhost:3000/admin/setup`

**Step 3:** Halaman menampilkan daftar owner/admin yang ada di database. Klik **"Set akun ini sebagai Owner"**

**Step 4:** Otomatis redirect ke `/admin/users` — sekarang Anda punya akses penuh

### Alternatif via SQL (kalau setup page gagal):
```sql
-- Jalankan di Supabase Dashboard → SQL Editor
-- Ganti dengan email akun Anda
UPDATE public.profiles
SET role = 'owner', status = 'active'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'email-anda@contoh.com'
);
```

---

## 5. Halaman Publik Website

Tidak perlu login — bisa diakses siapa saja:

| URL | Konten |
|-----|--------|
| `/` | Homepage: proposisi, solusi, proof of work, cara kerja, insight, form kontak |
| `/services` | Semua layanan LOGIKAin |
| `/services/[slug]` | Detail halaman layanan |
| `/projects` | Portfolio proyek/case study |
| `/projects/[slug]` | Detail case study |
| `/industries` | Industri yang dilayani |
| `/industries/[slug]` | Detail industri |
| `/insights` | Artikel dan insight |
| `/insights/[slug]` | Detail artikel |
| `/process` | Cara kerja LOGIKAin (7 tahap) |
| `/about` | Tentang LOGIKAin |
| `/start-project` | Form mulai proyek → masuk CRM sebagai lead |
| `/contact` | Form kontak → masuk CRM sebagai lead |
| `/privacy` | Kebijakan privasi |
| `/terms` | Syarat & ketentuan |

---

## 6. Semua Role & Hak Akses

### Role Staff Internal (akses `/admin`)

Semua role staff aktif dapat masuk ke shell `/admin`, tetapi route, sidebar, server action, dan RLS membatasi akses sesuai permission. Role tanpa permission ke modul tertentu akan diarahkan ke halaman forbidden.

| Role | Deskripsi | Modul yang bisa diakses |
|------|-----------|------------------------|
| **`owner`** | Pemilik platform — akses penuh | Semua modul + manage semua user termasuk owner lain |
| **`admin`** | Administrator — akses penuh operasional | Semua modul + manage user |
| **`editor`** | Tim konten | Content & SEO, Testimonials, Media Library, Insights, Industries |
| **`sales`** | Tim penjualan | Leads, Clients, Quotations |
| **`project_member`** | Tim delivery | Projects, Delivery Workspace, Milestones, Tasks, Files |
| **`finance`** | Tim keuangan | Finance Workspace, Invoices, Payments, Quotations (view) |
| **`support`** | Tim support | Support Tickets |

> **Semua role staff** di atas bisa masuk `/portal` — tapi sebagai staff, bukan client.

### Status Akun

Role `client` adalah role akun eksternal. Role ini tidak dapat membuka admin; akun harus memiliki `client_memberships.status = active` agar dapat menggunakan portal.

| Status | Arti |
|--------|------|
| `active` | Aktif — bisa login dan akses fitur |
| `invited` | Belum aktif (default trigger DB baru) |
| `suspended` | Dibekukan — tidak bisa akses admin |

### Role Portal Client (`portal_role` di tabel `client_memberships`)

| Portal Role | Hak akses di portal |
|-------------|---------------------|
| `client_owner` | PIC utama client |
| `client_admin` | Admin dari sisi client |
| `client_member` | Anggota client untuk melihat dan berkomunikasi |
| `viewer` | Pengguna baca-saja secara operasional |

Portal memeriksa membership aktif untuk akses data. Saat ini belum ada UI khusus untuk mengelola anggota dari dalam portal; assignment dilakukan staff melalui `/admin/clients`.

---

## 7. Admin Panel — Panduan Per Modul

Akses admin panel di `/admin`. Sidebar kiri berisi navigasi semua modul.

---

### 📊 Overview Dashboard — `/admin`

**Tampil:**
- Jumlah total: Leads, Clients, Projects, Invoices
- 5 lead terbaru dengan nama, email, dan status
- Quick access ke semua modul utama

**Tombol:** `+ New lead` → shortcut buat lead baru

---

### 📝 Content & SEO — `/admin/content`

**Untuk role:** `editor`, `admin`, `owner`

Kelola semua konten publik website:

**4 jenis konten:**
- **Services** — Halaman layanan (`/services/[slug]`)
- **Industries** — Halaman industri (`/industries/[slug]`)
- **Projects** — Case study portfolio (`/projects/[slug]`)
- **Insights** — Artikel/blog (`/insights/[slug]`)

**Fitur per konten:**
- Buat/edit: nama, slug URL, summary, body (rich text), status, SEO title & description
- **Status workflow:** `draft` → `review` → `published` → `archived`
- Publish → halaman publik langsung terupdate (cache revalidation otomatis)
- **Revision history** — bisa restore ke versi sebelumnya

---

### 💬 Testimonials — `/admin/testimonials`

**Untuk role:** `editor`, `admin`, `owner`

- Buat testimoni: kutipan, nama, role, perusahaan
- Set status: `draft` / `published`
- Toggle **Featured** — tampil di homepage jika published + featured
- Hapus testimoni

---

### 🖼️ Media Library — `/admin/media`

**Untuk role:** `editor`, `admin`, `owner`

- Upload file gambar/dokumen (maks 25 MB)
- Edit alt text dan flag dekoratif (aksesibilitas)
- Hapus asset (otomatis hapus dari Supabase Storage)
- Lihat grid semua asset yang sudah diupload

---

### 🔗 SEO & Redirects — `/admin/seo`

**Untuk role:** `editor`, `admin`, `owner`

- Kelola redirect rules: source path → target path
- Pilih tipe redirect: **301** (permanen) atau **302** (sementara)
- Berguna saat slug konten berubah agar tidak kehilangan SEO equity
- Hapus redirect yang sudah tidak dipakai

---

### 🎯 Leads — `/admin/leads`

**Untuk role:** `sales`, `admin`, `owner`

**Pipeline status:** `new` → `contacted` → `qualified` → `proposal` → `won` / `lost` / `archived`

**Halaman list:**
- Tabel semua lead dengan filter status
- Buat lead manual (nama, email, brief, sumber)

**Halaman detail lead (`/admin/leads/[id]`):**
- Info lengkap lead
- Tombol ubah status pipeline
- Form tambah catatan internal (timestamped)
- Timeline aktivitas lead
- Tombol **"Convert to Client"** — saat lead `won`/`qualified`, satu klik otomatis buat:
  - Record di tabel `clients`
  - Contact person dari data lead
  - Link ke quotation (opsional)

---

### 🏢 Clients — `/admin/clients`

**Untuk role:** `sales`, `admin`, `owner`

**Halaman list:**
- Tabel semua client dengan status, email, jumlah proyek

**Halaman detail client (`/admin/clients/[id]`):**
- Edit info client: nama legal, email, telepon, status (`prospect`/`active`/`inactive`/`archived`)
- Kelola **contact persons** (bisa banyak per client)
- **Assign portal member** — hubungkan user ke client ini agar bisa akses `/portal`
  - Pilih user yang sudah ada
  - Tentukan portal role: `client_owner`, `client_admin`, `client_member`, `viewer`
- Lihat semua proyek, quote, invoice, ticket milik client
- Tambah catatan internal client

---

### 📁 Projects — `/admin/projects`

**Untuk role:** `project_member`, `admin`, `owner`

**Halaman list:**
- Semua proyek dengan status, client, target selesai

**Halaman detail project (`/admin/projects/[id]`):**

**Milestone & Task:**
- Buat milestone (judul, deskripsi, target date, `client_visible`)
- Buat task di dalam milestone (judul, deskripsi, due date, assignee, `client_visible`)

**File Deliverable:**
- Upload file (maks 25 MB) ke Supabase Storage private bucket
- Toggle visibility: internal saja atau terlihat oleh client di portal

**Approval Request:**
- Buat permintaan approval ke client (judul, catatan request)
- Client bisa approve/reject/minta revisi dari portal mereka

**Feedback:**
- Client bisa submit feedback yang bisa dilihat oleh tim

---

### 🚚 Delivery Workspace — `/admin/delivery/projects`

**Untuk role:** `project_member`, `admin`, `owner`

View delivery-oriented dari semua proyek aktif — fokus pada progress milestone dan task yang perlu dikerjakan. Fungsi sama dengan `/admin/projects` tapi layout lebih cocok untuk kerja sehari-hari tim delivery.

---

### 💰 Quotations — `/admin/quotations`

**Untuk role:** `sales`, `finance`, `admin`, `owner`

**Status workflow:** `draft` → `sent` → `viewed` → `accepted` / `rejected` / `revision_requested`

**Fitur:**
- Buat quotation baru dengan nomor unik (misal: `QUO-2026-0001`)
- Tambah line items: deskripsi, jumlah, harga satuan
- Total dihitung otomatis dari line items
- Update status — setelah `accepted`, quote terkunci (tidak bisa edit langsung)
- Quote yang accepted terlihat di portal client

---

### 🧾 Invoices — `/admin/invoices`

**Untuk role:** `finance`, `admin`, `owner`

**Status workflow:** `draft` → `issued` → `partially_paid` / `paid` / `overdue` / `void`

**Halaman detail invoice (`/admin/invoices/[id]`):**
- Tambah line items: deskripsi, jumlah, harga satuan
- Record pembayaran: jumlah, provider, referensi
- Status update otomatis: `partially_paid` kalau bayar sebagian, `paid` kalau lunas
- **Snapshot invoice** — buat snapshot immutable (PDF history) saat invoice diterbitkan

---

### 💼 Finance Workspace — `/admin/finance`

**Untuk role:** `finance`, `admin`, `owner`

Overview keuangan:
- Ringkasan semua invoice berdasarkan status
- Total pendapatan (paid invoices)
- Shortcut ke semua aksi keuangan: buat invoice, record payment, lihat quotation

---

### 🎫 Support — `/admin/support`

**Untuk role:** `support`, `admin`, `owner`

**Status workflow:** `open` → `in_progress` → `waiting_client` → `resolved` → `closed`

**Halaman list:**
- Semua ticket dengan filter status dan prioritas (`low`/`normal`/`high`/`urgent`)

**Halaman detail ticket (`/admin/support/[id]`):**
- Thread percakapan lengkap
- Balas pesan — pilih visibility:
  - **Client** — terlihat oleh client di portal
  - **Internal** — hanya terlihat oleh staff (catatan internal)
- Ubah status dan prioritas
- SLA tracking (waktu first response, waktu resolved)

---

### ⚙️ Automation — `/admin/automation`

**Untuk role:** `admin`, `owner`

Monitor background jobs yang berjalan secara otomatis:

| Job Type | Trigger |
|----------|---------|
| Lead acknowledgment | Lead baru masuk dari form publik |
| Quotation alert | Quote dikirim ke client |
| Invoice due reminder | H-3 sebelum jatuh tempo invoice |
| Approval request | Admin buat approval request di project |
| Support update | Status ticket berubah |
| Route revalidation | Konten dipublish |

Halaman ini **read-only** — untuk monitoring saja. Jobs diproses via `POST /api/automation/run`.

---

### 🔧 Settings — `/admin/settings`

**Untuk role:** `admin`, `owner`

Konfigurasi website:
- Teks homepage (tagline, deskripsi, CTA)
- Navigation links
- Info kontak (email, telepon, alamat)
- Site metadata

---

### 👥 Users & Roles — `/admin/users`

**Untuk role:** Semua active staff

**Halaman ini menampilkan:**
- Tabel semua user dengan: username, nama, email (dari auth system), role, status, tanggal dibuat

**Buat user baru:**
- Klik "Buat user baru"
- Isi: username, nama lengkap, email, password (min 8 karakter), role, status
- User **langsung bisa login** — tidak perlu konfirmasi email

**Edit user (inline):**
- Username, nama, email, password (kosongkan jika tidak ingin ganti)
- Role: `editor` / `sales` / `project_member` / `finance` / `support` / `admin` / `owner`
- Status: `active` / `invited` / `suspended`

**Hapus user:**
- Tombol delete dengan konfirmasi
- Minimal 1 owner aktif harus selalu ada

---

### 📋 Activity Log — `/admin/audit`

**Untuk role:** `admin`, `owner`

Audit trail lengkap semua aksi di platform:
- Siapa yang melakukan aksi (actor)
- Pada entitas apa (lead, client, project, invoice, dll)
- Aksi apa yang dilakukan (created, updated, status_changed, deleted, dll)
- Kapan (timestamp)

---

### 📡 System Activity — `/admin/activity`

**Untuk role:** `admin`, `owner`

Feed real-time aktivitas sistem — background jobs, automation events, system events.

---

## 8. Client Portal — Panduan Lengkap

Akses di `/portal` — **khusus client/pelanggan** yang sudah di-assign ke client membership.

> Staff LOGIKAin juga bisa masuk `/portal`, tapi lihat tampilan "Gunakan admin panel".

---

### 🏠 Dashboard Portal — `/portal`

**Tampil:**
- Jumlah proyek, invoice, dan support ticket aktif
- Daftar proyek dengan status dan file yang bisa didownload
- Daftar invoice terbaru
- Daftar support ticket terbuka
- Approval yang menunggu keputusan client

**Aksi:**
- Submit support ticket baru
- Approve/reject approval request
- Logout dari portal melalui tombol **Logout**

---

### 📁 Projects — `/portal/projects`

- Daftar semua proyek yang terhubung ke client
- Status proyek (planned/active/on_hold/review/completed)
- Target tanggal selesai

**Detail project (`/portal/projects/[id]`):**
- Milestones dan tasks yang `client_visible = true`
- File deliverable yang `client_visible = true` + tombol download
- Approval requests — bisa approve/reject/minta revisi
- Submit feedback ke tim LOGIKAin

---

### 🧾 Invoices — `/portal/invoices`

- Daftar semua invoice dengan status dan jumlah
- Filter: paid, partially_paid, issued, overdue

**Detail invoice (`/portal/invoices/[id]`):**
- Header invoice (nomor, tanggal, jatuh tempo)
- Line items (rincian pekerjaan)
- Payment history
- Download PDF snapshot (kalau sudah di-snapshot admin)

---

### 📋 Quotations — `/portal/quotations`

- Daftar semua quotation yang dikirim ke client
- Status: draft/sent/viewed/accepted/rejected
- Detail line items dan total

---

### 🎫 Support — `/portal/support`

- Daftar semua ticket support client
- Form client menerima subject dan deskripsi; priority awal otomatis `normal` dan dapat diproses staff melalui Admin Support.
- **Buat ticket baru** — subject, deskripsi, prioritas

**Detail ticket (`/portal/support/[id]`):**
- Thread percakapan
- Hanya pesan `client-visible` yang tampil (catatan internal staff tidak terlihat)
- Reply ke ticket

Ticket baru dibuat dari dashboard atau halaman Support dengan subject dan deskripsi. Status awalnya `open` dan prioritas default `normal`.

> Jika ticket gagal dibuat, cek bahwa akun mempunyai `client_memberships` aktif dan policy RLS client sudah dijalankan di Supabase.

---

### ✅ Approvals — `/portal/approvals`

- Semua approval request dari semua proyek
- Status: pending / approved / rejected / revision_requested
- Approve, reject, atau minta revisi dengan komentar

---

### 📥 Files — `/portal/files`

- Semua file deliverable yang sudah dishare dari semua proyek
- Tombol download (link temporary dari Supabase Storage)

---

## 9. Cara Onboard Client Baru

Urutan yang benar — **ikuti langkah ini secara berurutan:**

```
Step 1: Lead masuk
  /admin/leads → lead baru dari form website ATAU buat manual
  → Proses lead: new → contacted → qualified → proposal → won
  → Saat "won" → klik "Convert to Client"

Step 2: Siapkan akun client
  Client dapat mendaftar melalui /register, atau staff dapat membuat
  user baru dengan role Client di /admin/users.

Step 3: Assign user ke client membership
  /admin/clients → pilih client → bagian "Members"
  → Assign user yang baru dibuat
  → Portal role: client_member (atau client_owner jika dia PIC)

Step 4: Client login
  /login → masuk /portal → lihat semua data mereka
```

> ❗ Tanpa **Step 3** (assign membership), client **tidak bisa masuk portal** — akan di-redirect ke login dengan error `membership_required`.

> Form `/admin/users` menyediakan role `client` dan role staff. Setelah akun client dibuat, staff tetap wajib melakukan Step 3 agar project, invoice, dan ticket dapat terlihat di portal.

---

## 10. Automation & Cron Jobs

**Endpoint:** `POST /api/automation/run`

**Header wajib:** `Authorization: Bearer {AUTOMATION_CRON_SECRET}`

**Setup di Vercel:**
1. Tambah environment variable `AUTOMATION_CRON_SECRET` (generate random string)
2. Di Vercel Dashboard → Settings → Cron Jobs
3. Tambah cron: `POST /api/automation/run` setiap 5 menit (`*/5 * * * *`)

**Jobs yang diproses:**
- Lead acknowledgment email
- Quotation sent notification
- Invoice due date reminder (H-3)
- Approval request notification
- Support ticket update notification
- SEO route revalidation setelah publish konten

---

## 11. Seed Demo Client Portal

Untuk mengisi portal dengan data pengujian, buat/login akun client terlebih dahulu. Salin `supabase/seed_portal_demo.sql`, ganti nilai `target_email` dengan email akun tersebut, lalu jalankan di Supabase SQL Editor. Seed ini membuat client membership `client_owner`, project, milestone, task, quotation, invoice, invoice snapshot, approval, feedback, support ticket, dan support message secara idempotent.

Setelah SQL berhasil:

1. Logout dari aplikasi.
2. Login kembali menggunakan email client.
3. Buka `/portal`.
4. Coba menu Projects, Quotations, Invoices, Approvals, Files, dan Support.
5. Untuk menguji download file, upload satu file dari `/admin/projects/[id]` dan tandai `client_visible`.

Seed tidak membuat password atau user Auth. User harus sudah dibuat melalui `/register` atau Supabase Auth.

## 12. QA & Release

```powershell
# Type checking
npm run typecheck

# Linting
npm run lint

# Unit tests
npm test

# E2E tests (butuh browser)
npm run test:e2e

# Production build
npm run build
```

**Checklist sebelum deploy:**
- [ ] Semua halaman publik accessible (/, /services, /projects, /insights, /start-project)
- [ ] Login dengan role owner/admin → akses admin panel
- [ ] Login dengan role editor → hanya bisa akses CMS
- [ ] Login sebagai client (dengan membership) → akses portal
- [ ] Form `/start-project` → lead masuk di `/admin/leads`
- [ ] Upload media di `/admin/media`
- [ ] Buat dan publish konten di `/admin/content`
- [ ] Cek sitemap di `/sitemap.xml`
- [ ] Cek robots di `/robots.txt`

---

## 12. Deployment Vercel

1. Push repository ke GitHub sebagai repository private.
2. Di Vercel pilih **Add New Project** lalu import repository tersebut.
3. Tambahkan environment variables dari `.env.example` pada Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` ke URL Vercel atau domain production.
5. Deploy menggunakan preset Next.js.

Variable berikut wajib server-only dan tidak boleh diberi prefix `NEXT_PUBLIC_`: `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `AUTOMATION_CRON_SECRET`, `PAYMENT_WEBHOOK_SECRET`, dan `RESEND_API_KEY`.

Tambahkan URL production di Supabase Dashboard → Authentication → URL Configuration:

```text
https://domain-anda.vercel.app
https://domain-anda.vercel.app/**
```

Jalankan schema dan policy `supabase/LOGIKAin.sql` pada database production setelah backup. Untuk branch, gunakan `main` sebagai production, `develop` sebagai staging, dan Preview Deployment Vercel untuk setiap Pull Request. Jangan commit `.env` atau secret ke repository.

## 13. Kolaborasi GitHub

Panduan lengkap kontribusi tim tersedia di [`CONTRIBUTING.md`](CONTRIBUTING.md). Branch yang digunakan:

```text
main                 production
develop              staging/testing
feature/nama-fitur   fitur baru
fix/nama-masalah     perbaikan bug
chore/nama-pekerjaan pekerjaan teknis/dokumentasi
```

Alur standar: ambil branch `develop`, buat branch pekerjaan, jalankan validasi, push branch, buat Pull Request ke `develop`, minta review, lalu merge ke `main` hanya setelah staging stabil. Aktifkan branch protection pada `main` agar tidak ada push langsung.

## 14. Troubleshooting

### ❌ "Akun belum memiliki akses staff aktif" saat login ke admin

**Penyebab:** Profile tidak ditemukan atau `status` bukan `active`.

**Solusi:** Cek di Supabase → Table Editor → `profiles`. Pastikan row Anda ada dengan `status = 'active'` dan `role` yang valid.

---

### ❌ Login pakai username tidak bisa

**Penyebab:** `SUPABASE_SERVICE_ROLE_KEY` tidak ada di `.env`.

**Solusi:** Tambahkan key di `.env` → restart dev server.

---

### ❌ "Akun belum dihubungkan ke client portal"

**Penyebab:** User tidak punya `client_memberships` yang active.

**Solusi (untuk staff):** Gunakan `/admin` bukan `/portal`.

**Solusi (untuk client):** Admin perlu assign di `/admin/clients` → pilih client → assign user.

### ❌ `profiles_role_check` saat memilih role Client

Database lama belum menjalankan perubahan schema role `client`. Jalankan sekali di Supabase SQL Editor, lalu ulangi perubahan role:

```sql
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('client','editor','sales','project_member','finance','support','admin','owner'));
```

Untuk database baru, jalankan ulang `supabase/LOGIKAin.sql` pada project yang sudah dibackup atau jalankan SQL di atas secara langsung.

---

### ❌ Self-register atau buat user gagal

**Penyebab:** `SUPABASE_SERVICE_ROLE_KEY` tidak ada di `.env`.

**Solusi:** Isi key di `.env` → restart server.

---

### ❌ Automation jobs tidak berjalan

**Penyebab:** `AUTOMATION_CRON_SECRET` tidak di-set atau cron tidak terkonfigurasi.

**Solusi:** Set env variable dan jadwalkan cron di Vercel/scheduler.

---

### ❌ Gambar tidak ter-optimize (lambat)

**Penyebab:** Next.js image optimization butuh server (tidak bisa di static export).

**Solusi:** Deploy ke Vercel (bukan static hosting). Konfigurasi sudah benar di `next.config.ts`.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Components) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + custom design system |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Authorization | Postgres RLS + Server Guards |
| Validation | Zod |
| Hosting | Vercel + Supabase Cloud |

**Brand colors:** `#171717` (charcoal) · `#B36F43` (copper) · `#F3F0EA` (cream)
