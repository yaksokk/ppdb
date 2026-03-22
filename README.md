# PPDB Online

Sistem Penerimaan Peserta Didik Baru berbasis web untuk SMP Negeri.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS v3
- **Backend**: Laravel 12 + Sanctum + Spatie Permission
- **Database**: MySQL

## Struktur Project
```
ppdb/
├── frontend/   → React + Vite
└── backend/    → Laravel 12
```

## Cara Menjalankan

### Persiapan
1. Pastikan XAMPP sudah aktif (Apache + MySQL)
2. Buat database `ppdb` di phpMyAdmin

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

## Akun Default
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smpn1tumpaan.sch.id | Admin@1234 |

## Role User
- **Admin** — kelola sistem, akun operator, info & jadwal, kriteria SAW
- **Operator** — verifikasi dokumen, input nilai SAW, hasil seleksi
- **Pendaftar** — daftar, isi formulir, upload dokumen, cek status & hasil

## Fitur Utama
- **Multi-role Access** — Admin, Operator, dan Pendaftar dengan hak akses berbeda (RBAC)
- **Pendaftaran Online** — Isi formulir, upload dokumen, dan pantau status real-time
- **Verifikasi Dokumen** — Operator bisa verifikasi, tolak, atau minta perbaikan dokumen
- **Seleksi Otomatis (SAW)** — Ranking pendaftar menggunakan metode Simple Additive Weighting per jalur
- **Export & Cetak** — Export hasil seleksi ke Excel dan download bukti kelulusan PDF
- **Manajemen Konten** — Admin kelola jadwal, info sekolah, kuota, dan status PPDB
- **Keamanan** — Token-based auth (Sanctum), session persist, auto logout