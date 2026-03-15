# PPDB Backend

Backend PPDB Online menggunakan Laravel 12.

## Cara Menjalankan
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## Package Tambahan
- Laravel Sanctum — autentikasi API
- Spatie Laravel Permission — manajemen role

## API
Base URL: `http://127.0.0.1:8000/api`
