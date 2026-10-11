# Portofolio Andrian — Digital Product Designer & Creative Developer

Website portofolio editorial personal dengan pengelolaan proyek dinamis, artikel blog Markdown, dan panel admin terintegrasi sesuai spesifikasi PRD.

---

## ✦ Identitas Visual & Arahan Desain

Sesuai arahan PRD Bagian 8, website ini dibangun dengan prinsip:
- **Identitas Tipografis:** Menggunakan kombinasi font display berkarakter (`Space Grotesk`) dan teks isi dengan legibilitas tinggi (`Plus Jakarta Sans`).
- **Warna Aksen Berkarakter:** Aksen utama *Terracotta Burnt Orange* (`#D84315` / `#FF6E40`) dipadukan dengan netral hangat (*Soft Alabaster* & *Deep Obsidian*), bukan gradien ungu-biru generik.
- **Tata Letak Asimetris:** Grid proyek editorial dengan perbandingan lebar dinamis (7/5), whitespace lega, dan fokus pada materi visual proyek.
- **Karya Berbasis Masalah Nyata:** Setiap studi kasus membedah latar belakang masalah, pendekatan/proses, dan hasil terukur.
- **Dukungan Dark / Light Mode:** Menggunakan token warna semantik dan transisi halus dengan tombol toggle persisten.

---

## ✦ Fitur Utama

### 1. Halaman Publik
- **Beranda (`/`):** Hero statement yang deliberate, kurasi proyek unggulan asimetris, prinsip metodologi kerja, 3 artikel terbaru, dan ajakan kolaborasi.
- **Koleksi Karya (`/projects`):** Grid proyek lengkap dengan filter dinamis per kategori (Web App, Desain Web, UI/UX, Identitas Visual) dan pencarian instan.
- **Detail Proyek (`/projects/[slug]`):** Studi kasus naratif lengkap (Masalah, Proses, Hasil), spesifikasi peran & alat, tautan live demo & GitHub repo, galeri interaktif dengan lightbox layar penuh, serta navigasi proyek terkait.
- **Artikel Blog (`/blog`):** Arsip esai desain dan rekayasa web, filter tag/topik, pencarian instan, dan kalkulasi waktu baca otomatis.
- **Detail Artikel (`/blog/[slug]`):** Tampilan membaca editorial, rendered Markdown dengan syntax highlight, metadata penulis, dan rekomendasi artikel terkait.
- **Tentang (`/about`):** Profil naratif Andrian, lini masa karier, matriks keahlian produk & rekayasa, dan tombol unduh CV PDF.
- **Kontak (`/contact`):** Formulir kontak validasi ganda yang langsung tersimpan ke database, SLA respons 1x24 jam, dan kanal sosial.

### 2. Panel Admin (`/admin`)
- **Autentikasi Terproteksi:** Login sesi berbasis cookie JWT aman dan middleware route guard untuk `/admin/*`.
- **Dashboard Ringkasan (`/admin`):** Metrik proyek aktif/draft, total artikel, jumlah kategori, notifikasi pesan baru yang belum dibaca, dan pintasan aksi cepat.
- **Kelola Proyek (`/admin/projects`):** Tambah, edit, hapus, urutkan nomor, atur status (Publik/Draft), tandai unggulan, unggah gambar cover & galeri foto dengan caption.
- **Kelola Kategori (`/admin/categories`):** Tambah, edit nama/slug/tipe kelompok kategori secara dinamis tanpa menyentuh kode.
- **Kelola Blog (`/admin/posts`):** Editor Markdown dengan tab pratinjau langsung, unggah cover, estimasi waktu baca otomatis, dan status publikasi.
- **Pustaka Media (`/admin/media`):** Unggah file gambar lokal ke `/public/uploads`, pratinjau resolusi asli, salin tautan URL gambar ke clipboard dengan satu klik, dan hapus file.
- **Kotak Pesan (`/admin/messages`):** Baca pesan lengkap formulir kontak, tandai status dibaca/belum dibaca, balas langsung ke email pengirim (`mailto:`), dan hapus pesan.

---

## ✦ Kredensial Akun Admin

Untuk masuk ke Panel Admin (`http://localhost:3000/admin/login`):

- **Email:** `admin@andrian.design`
- **Kata Sandi:** `Admin12345!`

---

## ✦ Menjalankan Proyek Secara Lokal

### Prasyarat
- Node.js versi 18+ (direkomendasikan v20 / v22 / v24)
- npm

### 1. Masuk ke direktori & instal dependensi:
```bash
npm install
```

### 2. Inisialisasi Database SQLite & Seed Data:
```bash
npx prisma db push
node prisma/seed.js
```

### 3. Jalankan server pengembangan (Development):
```bash
npm run dev
```
Akses di browser pada: `http://localhost:3000`

### 4. Build & Jalankan Mode Produksi:
```bash
npm run build
npm run start
```

---

## ✦ Struktur Kode

```
├── app/
│   ├── about/page.tsx               # Halaman Tentang
│   ├── admin/
│   │   ├── categories/page.tsx      # CRUD Kategori
│   │   ├── login/page.tsx           # Halaman Login Admin
│   │   ├── media/page.tsx           # Pustaka Media & Unggah
│   │   ├── messages/page.tsx        # Kotak Pesan Masuk
│   │   ├── posts/                   # CRUD Artikel Blog (list, new, edit)
│   │   ├── projects/                # CRUD Proyek (list, new, edit)
│   │   ├── layout.tsx               # Admin Sidebar Layout
│   │   └── page.tsx                 # Dashboard Admin
│   ├── api/                         # Endpoint API (Auth, Projects, Posts, dll.)
│   ├── blog/                        # Listing & Detail Artikel
│   ├── contact/page.tsx             # Halaman Kontak
│   ├── projects/                    # Listing & Detail Proyek
│   ├── globals.css                  # Token Desain & Dark Mode
│   ├── layout.tsx                   # Root Layout & Typography
│   └── page.tsx                     # Halaman Beranda
├── components/                      # Komponen UI (Navbar, Footer, Lightbox, Cards)
├── lib/
│   ├── auth.ts                      # JWT & Session helpers
│   ├── prisma.ts                    # Prisma singleton
│   └── utils.ts                     # Format tanggal, slugify, reading time
├── prisma/
│   ├── schema.prisma                # Skema Database (Project, Category, Post, Message)
│   └── seed.js                      # Script seeder data awal
└── public/
    ├── cv-andrian-resume.pdf        # Berkas resume contoh
    └── uploads/                     # Direktori penyimpanan unggahan media
```

