# Frontend Agent & Architecture Specification - Dipi Floriest (React JS)

Dokumentasi spesifikasi alur kerja komponen Frontend React JS untuk halaman **Detail Produk & AI Try On** berdasarkan desain Figma.

---

## 1. Tech Stack & State Management

- **Framework:** React.js (Vite / Next.js Client Component)
- **Styling:** Tailwind CSS
- **State Management:** React `useState` / `useReducer`
- **Asset Format:** WebP (`.webp`) untuk performa rendering optimal
- **Architecture:** Clean Architecture dengan lapisan Domain, Application, Infrastructure, dan Presentation.

---

## 2. Struktur Komponen & Static Data Mock

### Static Mock Data (`src/data/products.js`)

```javascript
export const dummyProductDetail = {
  id: "prod-001",
  name: "PAPAN AKRILIK WARNA MERAH",
  category: "Akrilik / Flower Board",
  price: 120000,
  description:
    "Papan akrilik dengan desain bunga di bagian atas dan bagian bawah dengan perpaduan kombinasi 2 warna, warna bisa dipilih di bagian kategori yang disediakan.",
  variants: [
    { code: "P1", imageUrl: "/assets/products/p1.webp" },
    { code: "P2", imageUrl: "/assets/products/p2.webp" },
    { code: "P3", imageUrl: "/assets/products/p3.webp" },
    { code: "P4", imageUrl: "/assets/products/p4.webp" },
    { code: "P5", imageUrl: "/assets/products/p5.webp" },
    { code: "P6", imageUrl: "/assets/products/p6.webp" },
    { code: "P7", imageUrl: "/assets/products/p7.webp" },
    { code: "P8", imageUrl: "/assets/products/p8.webp" },
  ],
};
```

---

## 3. Step-by-Step UI Execution Flow

### Step 1: Initial Page Load

- Aplikasi memuat `dummyProductDetail`.
- Varian pertama (`P1`) diset sebagai varian aktif awal secara _default_.
- Gambar di **Main Product Preview** (atas) dan **Try On Preview Area** (bawah) menampilkan aset `p1.webp`.
- Status `generatedResultUrl` bernilai `null` dan teks penanda _"Pilih Gambar dan Lihat Hasil Disini"_ tampil di bawah preview Try On.

### Step 2: Selecting Category/Variant (P1 - P8)

- Pengguna mengklik salah satu thumbnail varian (misal `P3`).
- State `selectedVariant` terbarui ke `P3`.
- **Main Product Image** dan **Try On Preview Image** langsung berganti mengikuti gambar `p3.webp`.
- Jika sebelumnya sudah ada gambar hasil AI, `generatedResultUrl` di-reset kembali ke `null` untuk menampilkan gambar sampel varian yang baru dipilih.

### Step 3: Choosing Customization Method

- **Metode A (Form Input):** Pengguna mengisikan field `Ucapan/Selamat*`, `Tambahan (Opsional)`, `Pesan*`, `Kepada (Nama)*`, `Dari*`, serta memilih dropdown `Atribut (Opsional)` dan `Posisi (Opsional)`.
- **Metode B (Upload Image):** Pengguna memilih file dari perangkat lokal via komponen `Choose File`.
- State `methodType` akan otomatis terdeteksi berdasarkan input yang diisi oleh pengguna (`FORM` atau `IMAGE_UPLOAD`).

### Step 4: Triggering AI Generation

- Pengguna mengklik tombol **"Generate Image"**.
- State `isLoading` berubah menjadi `true`.
- UI menampilkan _loading spinner_ / _skeleton animation_ pada **Try On Preview Area** dan tombol `Generate Image` menjadi _disabled_.
- Hook presentation memanggil use case `generateTryOn` dengan input kustomisasi dan varian aktif.
- Use case memvalidasi input dan memanggil kontrak repository. Implementasi repository di infrastructure membuat payload `FormData` dan melakukan HTTP POST ke Endpoint AI Backend.

### Step 5: Rendering AI Result

- Backend mengembalikan _response_ sukses berisi URL gambar WebP baru (`generated_image_url`).
- State `generatedResultUrl` terisi dengan URL tersebut dan `isLoading` berubah menjadi `false`.
- **Try On Preview Area** secara halus _(fade-in transition)_ mengganti gambar sampel produk dengan hasil visualisasi AI di posisi frame/papan yang sama.

---

## 4. Clean Architecture

### Pembagian Tanggung Jawab

| Lapisan        | Tanggung Jawab                                                                                                                                                           | Batasan                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Domain         | Model produk, varian, aturan kustomisasi, dan kontrak repository produk serta AI Try On.                                                                                 | Tidak bergantung pada React, HTTP, `FormData`, atau lapisan luar.                                                 |
| Application    | Use case `getProductDetail` dan `generateTryOn`; validasi input berdasarkan aturan domain dan koordinasi repository.                                                     | Hanya bergantung pada domain; repository diterima melalui parameter, bukan mengimpor implementasi infrastructure. |
| Infrastructure | Implementasi repository untuk mock produk dan API AI; pembuatan `FormData`, HTTP POST, validasi response, dan pemetaan `generated_image_url` menjadi URL hasil use case. | Mengimplementasikan kontrak domain; tidak mengatur state atau rendering React.                                    |
| Presentation   | Halaman, komponen, dan hook React; state `selectedVariant`, `methodType`, `generatedResultUrl`, `isLoading`, serta pesan error dan transisi preview.                     | Memanggil use case; tidak melakukan request HTTP atau membuat `FormData` langsung.                                |

### Struktur Folder

```text
src/
  app/                 # Composition root: merangkai repository dan use case
  domain/              # Model, aturan bisnis, dan kontrak repository
  application/         # Use case getProductDetail dan generateTryOn
  infrastructure/      # Repository mock produk dan API AI
  presentation/        # Halaman, komponen, dan hook React
  data/products.js      # dummyProductDetail yang dipakai repository mock
```

- Arah dependensi: `Presentation -> Application -> Domain` dan `Infrastructure -> Domain`.
- `app` menjadi tempat perakitan dependensi: membuat repository konkret, memasukkannya ke use case, lalu menyediakan use case ke presentation.
- `dummyProductDetail` tetap berada di `src/data/products.js` dan hanya diakses melalui repository mock. Halaman menerima data dari `getProductDetail` agar pergantian mock ke API tidak mengubah komponen.
- Kontrak repository cukup berupa operasi fungsi JavaScript sesuai kebutuhan use case; tidak perlu base class atau dependency injection framework.

### Alur Generate dan Pengujian

1. Hook React mengirim input ke `generateTryOn`, mengatur loading, dan menampilkan error jika proses gagal.
2. Use case memvalidasi field wajib untuk metode `FORM` atau keberadaan file untuk `IMAGE_UPLOAD`, lalu memanggil repository AI.
3. Repository AI mengubah input menjadi `FormData`, mengirim request, dan menolak response gagal atau URL hasil yang tidak valid.
4. Use case mengembalikan URL hasil ke hook; hook memperbarui `generatedResultUrl` dan selalu mematikan loading setelah proses selesai, baik sukses maupun gagal.

- Uji aturan domain dan use case dengan repository palsu tanpa React atau jaringan.
- Uji repository API untuk payload `FormData`, pemetaan response sukses, dan response gagal.
- Uji presentation untuk varian awal P1, perubahan kedua preview saat memilih varian, reset hasil AI, serta state loading, sukses, dan error.
