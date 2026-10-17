# Dokumentasi UI / Struktur Halaman Detail Produk & AI Try On - Dipi Floriest

Dokumentasi komponen layout halaman Detail Produk yang dilengkapi fitur simulasi visual menggunakan AI Try On.

---

## 1. Header & Navigation Bar
- **Logo:** `assets/flower-logo.png`
- **Menu Navigasi:** Home, Services, Category, Best Seller, About Us
- **Action Icons:** Search Bar, Cart Icon, User Profile

---

## 2. Main Product Section

Bagian informasi detail produk beserta galeri gambar pilihan kategori/varian.

### Layout Grid (2 Column)

#### Left Column: Main Preview & Category Selector
- **Main Image Display:** Display gambar produk berukuran besar.
- **Thumbnail Selector (Kategori P1 - Pn):** 
  - Thumbnail gambar produk dari varian/kategori yang tersedia (`assets/products/p1.png`, `assets/products/p2.png`, `assets/products/p3.png`, dst.).
  - Berfungsi untuk mengganti preview gambar utama sekaligus memilih acuan sampel untuk fitur **Try On**.

#### Right Column: Product Info & Actions
- **Judul Produk:** "PAPAN AKRILIK WARNA MERAH"
- **Harga Produk:** `Rp 120.000,00`
- **Deskripsi Produk:** Penjelasan detail mengenai material akrilik, jenis bunga, pilihan warna, serta estetika perangkaian.
- **Kategori Produk:** `Akrilik / Flower Board`
- **Variasi Kategori Thumbnail:** Opsi pilihan varian visual (`P1`, `P2`, `P3`).
- **Call-to-Action:** Button "Pesan Sekarang" *(Direct Checkout / Add to Cart)*.

---

## 3. Section AI Try On Product

Sistem simulasi kustomisasi produk menggunakan Backend AI Generation.

### Section Header
- **Title:** "TRY ON PRODUCT"
- **Subtitle / Description:** AI Image Review - "Kami siap membantu Anda! Silakan isi form di bawah ini sesuai dengan board yang dipilih."

### Layout Section (2 Column)

#### Left Column: Preview Area (AI Generated Result Display)
- **Tampilan Utama:** Menggunakan posisi/frame yang sama dengan tempat preview gambar produk di atas.
- **Initial State:** Menampilkan gambar sampel produk/kategori pilihan (`P1` - `Pn`).
- **Generated State:** Menampilkan hasil gambar yang telah digenerate oleh AI melalui endpoint Backend.
- **Label Status:** "Pilih Gambar dan Lihat Hasil Di sini"

#### Right Column: Try On Form Input
Formulir konfigurasi data kustomisasi produk:

- **Input 1 (Text):** Ucapan / Selamat (contoh: *Congraduation / Happy Wedding*)
- **Input 2 (Textarea):** Pesan / Text Tambahan (contoh: *Input Pesan / Quote*)
- **Input 3 (Text):** Kepada (Nama) (contoh: *Rizki Alfian*)
- **Input 4 (Dropdown Select):** Atribut (Opsional) (contoh: *Pilih Atribut*)
- **Input 5 (Option Media Input):**
  - **Opsi A (Pilih dari Kategori):** Terhubung otomatis dari thumbnail pilihan kategori produk (`P1`, `P2`, `P3`, dst.).
  - **Opsi B (Upload File):** Component `Choose File` / Drag & Drop untuk mengunggah gambar kustom dari lokal pengguna.
- **Action Button:** Button **"Generate Image"**
  - **Trigger:** Mengirim seluruh payload form dan media ke API Backend Endpoint AI.
  - **Response:** Mengubah tampilan pada *Left Column Preview Area* dengan gambar hasil generasi AI.

---

## 4. Footer Section
- **Informasi Toko & Kontak**
- **Social Media Links**
- **Copyright:** `© 2026 Dipi Floriest. All rights reserved.`