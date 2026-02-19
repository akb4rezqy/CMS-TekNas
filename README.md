# Panduan Proyek Website Teknas

Selamat datang di proyek **Website Teknas**. Dokumen ini memberikan gambaran umum tentang struktur folder, logika, dan fungsi dari setiap bagian di dalam proyek ini untuk membantu Anda memahami cara kerja sistem ini.

## 🚀 Teknologi Utama
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **Database & Auth**: Supabase
- **State Management**: SWR (untuk fetching data)

---

## 📁 Struktur Folder Utama

### 1. `app/` (Routing & API)
Folder ini menggunakan Next.js App Router. Setiap sub-folder di sini mewakili rute URL.
- **`app/page.tsx`**: Halaman utama (Landing Page).
- **`app/login/`**: Halaman masuk untuk admin/staf.
- **`app/dashboard/`**: Area panel kontrol untuk mengelola konten (berita, galeri, data guru, dll).
- **`app/api/`**: Berisi *API Routes* yang menangani permintaan data dari frontend ke database Supabase.
  - `api/auth/`: Logika login dan sesi.
  - `api/announcements/`: Pengelolaan pengumuman.
  - `api/school/`: Pengelolaan data akademik seperti jadwal dan mata pelajaran.

### 2. `components/` (Komponen UI)
Bagian-bagian kecil dari tampilan web yang dipisahkan agar mudah dikelola.
- **`components/ui/`**: Komponen dasar seperti tombol (button), input, kartu (card), dan dialog (menggunakan Radix UI).
- **`components/landing/`**: Komponen khusus untuk halaman depan, seperti bagian berita, galeri, dan profil staf.
- **`components/layout/`**: Komponen kerangka seperti Header, Footer, dan Sidebar untuk dashboard.

### 3. `lib/` (Logika & Utilitas)
Tempat penyimpanan fungsi-fungsi bantuan dan konfigurasi backend.
- **`lib/supabase/`**: Konfigurasi klien Supabase untuk interaksi database.
- **`lib/services/`**: Berisi logika bisnis (misal: `announcements-service.ts`) untuk memisahkan kode pemanggilan API dari komponen.
- **`lib/auth.ts`**: Fungsi pembantu untuk mengecek status login.

### 4. `hooks/` (Custom Hooks)
Fungsi khusus React untuk menyederhanakan logika di dalam komponen.
- **`useApi.ts`**: Hook untuk memudahkan pemanggilan API internal.
- **`use-supabase-realtime.ts`**: Menangani pembaruan data secara langsung (real-time).

### 5. `public/` (Aset Statis)
Tempat penyimpanan gambar, logo, dan ikon yang digunakan di website.

### 6. `scripts/` (Database Setup)
Berisi file-file SQL (`.sql`) yang digunakan untuk membuat tabel, kebijakan keamanan (RLS), dan data awal di Supabase.

---

## 💡 Logika Alur Kerja

1. **Autentikasi**: Pengguna login melalui `app/login`, kredensial diperiksa di `app/api/auth`, dan jika berhasil, sesi disimpan di cookie/Supabase.
2. **Manajemen Data**: Admin masuk ke `app/dashboard` untuk menambah atau mengubah data. Setiap aksi di dashboard akan memanggil fungsi di `lib/services` yang kemudian menghubungi `app/api`.
3. **Tampilan Publik**: Pengunjung melihat halaman utama yang mengambil data terbaru (seperti pengumuman atau galeri) melalui API secara dinamis.

---

## 🛠️ Cara Pengembangan
- Pastikan variabel lingkungan (Environment Variables) untuk Supabase sudah terkonfigurasi.
- Gunakan `npm run dev` untuk menjalankan server pengembangan di port 5000.
- Gunakan `npm run build` sebelum melakukan publikasi ke produksi.
