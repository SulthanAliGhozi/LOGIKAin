# Panduan Kolaborasi LOGIKAin

Dokumen ini menjadi aturan kerja tim untuk repository LOGIKAin.

## Persiapan anggota baru

1. Minta akses repository GitHub sebagai `Write`.
2. Clone repository.
3. Buat `.env` dari `.env.example`; jangan commit secret.
4. Jalankan `npm install` lalu `npm run dev`.

## Branching

- `main`: production. Tidak boleh push langsung.
- `develop`: integrasi dan staging.
- `feature/<nama-fitur>`: fitur baru.
- `fix/<nama-bug>`: perbaikan bug.
- `chore/<nama-pekerjaan>`: dependency, refactor, dokumentasi, atau tooling.

Contoh:

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/client-ticket
```

## Commit

Gunakan commit yang singkat dan spesifik, misalnya `feat: add client support ticket form`, `fix: prevent empty portal after invoice navigation`, atau `docs: update deployment guide`. Satu commit sebaiknya fokus pada satu tujuan.

## Pull Request

Sebelum membuat Pull Request, jalankan:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

Pull Request harus menjelaskan masalah, file yang diubah, cara pengujian, perubahan environment variable, perubahan schema/RLS, dan screenshot jika ada perubahan UI. Minimal satu anggota tim melakukan review sebelum merge ke `develop`. Merge ke `main` dilakukan setelah staging diuji.

## Database dan Supabase

- Jangan mengubah database production tanpa review.
- Perubahan tabel, constraint, RLS policy, trigger, dan seed harus dicatat di `supabase/`.
- Uji SQL di staging terlebih dahulu.
- Jangan memasukkan password, service role key, access token, atau data client asli ke commit.
- Jika `npm run db:push` menampilkan `Cannot find project ref`, jalankan `supabase link` pada project yang benar atau gunakan Supabase SQL Editor.

## Vercel dan keamanan

Vercel membuat Preview Deployment untuk setiap Pull Request. Gunakan Preview untuk menguji UI dan flow sebelum merge. Environment variable production dan preview dikelola di Vercel, bukan di repository.

- Jangan menonaktifkan RLS untuk menyelesaikan error.
- Jangan memakai `SUPABASE_SERVICE_ROLE_KEY` di Client Component.
- Jangan membagikan isi `.env` di issue, Pull Request, chat, atau screenshot.
- Jika secret terlanjur ter-commit, segera revoke/rotate secret di provider.
