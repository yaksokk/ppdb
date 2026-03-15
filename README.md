# PPDB Online 

Sistem Penerimaan Peserta Didik Baru berbasis web.

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

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

### Backend
```bash
cd backend
composer install
php artisan serve
```

## Role User
- **Admin** — kelola sistem, verifikasi, pengumuman
- **Operator** — input nilai & hasil seleksi
- **Pendaftar** — daftar, upload dokumen, cek status

