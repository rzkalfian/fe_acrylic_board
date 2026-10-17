# Dipi Floriest Frontend

React JS, Vite, Tailwind CSS, dan Clean Architecture. Halaman Desktop/Home, Shop, serta Detail Product & AI Try On mengacu pada Figma Dipi Floriest dan spesifikasi Markdown yang disediakan.

## Menjalankan

Gunakan Node.js 22.12+ atau versi LTS yang lebih baru. Jalankan dari folder `fe_acrylic_board`:

```sh
npm install
npm run dev
```

Pada Windows PowerShell yang memblokir `npm.ps1`, gunakan `npm.cmd` untuk perintah yang sama. URL lokal default: `http://127.0.0.1:5173/`. Vite menggunakan port berikutnya bila port tersebut terpakai.

```sh
npm test
npm run build
npm run preview
```

`predev` dan `prebuild` memeriksa keberadaan aset di `public/assets/`, tanpa menyalin atau menimpa file. Folder sumber `assets/` tidak lagi diperlukan. Foto produk WebP, logo, ikon layanan, gambar bunga, foto toko, dan mobil dibaca langsung dari folder publik tersebut. Font Latin Poppins, Nunito Sans, dan Qwigley disajikan lokal dari paket font.

## Halaman

| URL | Isi |
| --- | --- |
| `/` | Home, layanan, About Us, daftar produk, dan tautan ke Shop/Detail. |
| `/shop` | 21 pilihan warna mock, pencarian, filter warna, urutan nama, dan pagination. |
| `/products/prod-001` | Produk utama, varian P1-P8, keranjang, dan form/upload Try On. |
| `/products/:id` | Detail warna yang dipilih dari katalog; P1 mengikuti produk tersebut. |

Harga Rp120.000 berasal dari mock pada spesifikasi, bukan harga katalog produksi. Jumlah produk dihitung dari data mock dan aset yang tersedia. Keranjang hanya tersimpan selama sesi halaman; reload mengosongkannya. Tidak ada pembayaran, pemesanan ke server, atau penyimpanan data personal.

## Clean Architecture

| Folder | Tanggung jawab |
| --- | --- |
| `src/domain/` | Aturan kustomisasi dan kontrak operasi repository. |
| `src/application/` | Use case katalog, detail produk, dan generate Try On dengan repository yang diinjeksi. |
| `src/infrastructure/` | Repository mock dan request API, FormData, serta validasi response. |
| `src/presentation/` | Halaman, komponen, context UI, dan hook React. |
| `src/app/` | Composition root, perakitan repository/use case, routing, dan state keranjang. |
| `src/data/products.js` | Data contoh, hanya diimpor repository mock. |

Application bergantung pada Domain. Presentation menerima use case lewat context; tidak mengimpor Infrastructure atau composition root. Infrastructure mengimplementasikan kontrak domain melalui operasi fungsi JavaScript. Tidak ada base class atau dependency injection framework.

Pemilihan varian memperbarui kedua preview dan mengosongkan hasil AI. Perubahan input/metode/varian membatalkan request aktif menggunakan AbortController agar response lama tidak menimpa pilihan baru. Form mempertahankan nilai saat berpindah metode; input terakhir yang diubah menentukan metode aktif. File yang masih terpilih tidak dikirim ketika metode aktif adalah FORM.

## Integrasi AI

Frontend tidak menyertakan backend AI. Endpoint sementara adalah `/api/try-on`. Atur `VITE_AI_GENERATE_URL` dalam `.env.local` ke endpoint backend yang sebenarnya, lalu restart server Vite. Jangan menaruh API key provider AI dalam variabel `VITE_*`, karena nilainya menjadi publik di browser.

Kontrak sementara yang digunakan frontend, karena URL endpoint dan nama field media belum ditetapkan dalam spesifikasi backend:

| Field FormData | Nilai |
| --- | --- |
| `base_image_url` | URL absolut WebP dari varian yang dipilih. |
| `variant_code` | P1-P8. |
| `method_type` | FORM atau IMAGE_UPLOAD. |
| `ucapan_selamat`, `tambahan`, `pesan`, `kepada`, `dari`, `atribut`, `posisi` | Dikirim hanya untuk FORM. |
| `overlay_image` | File lokal, dikirim hanya untuk IMAGE_UPLOAD. |

Response sukses:

```json
{ "generated_image_url": "https://backend.example/generated/result.webp" }
```

URL di atas adalah contoh kontrak, bukan layanan aktif. Backend perlu menyediakan URL HTTP(S) gambar WebP yang dapat dibuka browser. Frontend menolak URL dengan protokol lain; tidak memeriksa ekstensi URL agar signed URL tetap didukung.

Upload menerima PNG, JPG, dan WebP berukuran 1 byte hingga 10 MB. Backend wajib memvalidasi kembali isi, ukuran, dan MIME file. Nilai atribut `floral`/`minimal` serta posisi `center`/`balanced` adalah pilihan awal frontend yang perlu dicocokkan dengan backend. Pastikan backend dapat mengakses `base_image_url`, mengizinkan origin frontend melalui CORS bila beda origin, dan mempertahankan framing foto saat menghasilkan gambar.

Tanpa endpoint tersedia, tombol Generate Image menampilkan error layanan. Tidak ada generator palsu, hasil hardcoded, atau simulasi API dalam kode aplikasi. Response sukses dalam pengujian browser hanya diberikan melalui interception Playwright.

## Keputusan Visual

- Acuan utama: Figma Dipi Floriest, sesuai persetujuan pengguna. Konten dan layout hotel ResortLux tidak digunakan.
- Pink/blush dan rose berasal dari Figma serta DESIGN.md; latar terang mempertahankan karakter florist dan warna asli foto produk.
- Tombol dibuat lebih gelap daripada token pink utama agar teks putih memiliki kontras 6,32:1. Section layanan memakai rose Figma dengan teks gelap berkontras 4,66:1.
- Poppins untuk hierarki judul, Nunito Sans untuk form/katalog, dan Qwigley hanya untuk frasa dekoratif pendek sesuai DESIGN.md.
- Layout tiga kolom dan foto lengkung mengacu pada Shop Figma; preview detail memakai `object-fit: contain` agar papan utuh terlihat.
- Semua ikon kontrol dan ringkasan hero menggunakan Solar. Gambar kategori layanan menggunakan PNG dari `public/assets/icons/`, sesuai permintaan pengguna.
- Spacing memisahkan galeri, informasi, dan kustomisasi; kartu hanya untuk produk berulang, form Try On, dan dialog keranjang.
- Fade hasil mengomunikasikan pergantian preview, spinner hanya saat request aktif, dan reduced motion dihormati.
- ENERGY 2 / RHYTHM 2 / MOTION 2. Tema terang tetap mengikuti identitas florist; tidak ada toggle tema yang tidak diminta.
- Testimoni, statistik pemasaran, kontak, link sosial, dan autentikasi tidak dibuat tanpa data/layanan asli.

## Revisi Katalog Desktop

- Navbar dibuat mengambang dengan border pill, permukaan pink transparan, `backdrop-filter: blur(16px)`, dan fallback opaque. Hanya navbar yang memakai glass untuk menjaga fokus dan keterbacaan.
- Menu mengikuti frame Desktop: Home, Service, Shop, Contact Us, serta Discuss with Me. Contact Us menuju footer; informasi kontak toko tidak dibuat tanpa data asli. Discuss with Me menuju form kustomisasi, bukan layanan chat palsu.
- Hero memakai judul Hello, Flowriest, dua CTA, serta ringkasan Kotak Kejutan, Cerita Indah, dan Merangkai Cinta dengan glyph Solar yang relevan.
- Background Vector-bg-left/Vector-bg-right dipakai sebagai tekstur pink penuh dari aset Figma. Shop memakai flowers-background dengan scrim pink 85-90% agar pola tetap terlihat tanpa mengganggu teks; gambar utama tidak dimudarkan.
- Gambar layanan: Flower Bouquet, Birthday Flower, Greeting Card, Married, dan Baby Born, semuanya berasal dari folder ikon publik.
- Kontrol pencarian, filter, pengurutan, pagination, keranjang, dan alur Try On tetap dipertahankan. Offset detail disesuaikan agar tidak tertutup navbar baru.
- ENERGY 2 / RHYTHM 2 / MOTION 2 tetap digunakan. Tidak ada aset ilustrasi baru atau testimoni fiktif.

### Verifikasi Revisi

- R-03 PASS: Home, Shop, dan Detail pada 320/390/768/1024/1440/1920 px tanpa overflow atau heading keluar viewport.
- R-04 PASS: box/card/users-group-rounded untuk ringkasan hero; magnifer/bag dan glyph Solar untuk kontrol, tidak ada ikon kontrol PNG atau SVG manual.
- R-10 PASS: satu permukaan glass pada navbar, blur 16 px terdeteksi browser dan fallback tersedia.
- R-24/R-26 PASS: Home/Service/Shop/Contact Us menuju route atau section nyata; CTA navbar dan hero menuju form, Pesan Sekarang hero menuju Shop.
- R-25 PASS: warna dasar hero 5,14:1, teks layanan 4,66:1, script besar 3,23:1, harga/keterangan katalog 6,68:1; pola Shop diberi scrim untuk keterbacaan.
- R-27 PASS: empty pencarian dan reset filter tetap bekerja; state katalog, keranjang, dan request tidak dihapus.
- R-32 PASS: kontrol native dan focus ring dipertahankan, menu mobile membuka Shop lalu menutup otomatis, keranjang dapat dibuka/ditutup.
- R-33 PASS: perubahan JSX/CSS langsung di source; skrip aset hanya memeriksa 41 file publik, tidak mem-patch atau menimpa file.
- R-35 PASS: build produksi dan uji klik selesai, tanpa error runtime JavaScript pada alur revisi.
- R-01/R-06/R-19/R-31 PASS: alasan background, scrim, font, glass, dan motion dicatat; warna/komposisi berasal dari Figma pengguna.
- Click-through PASS: Search navbar menghasilkan Ungu Putih; pencarian tidak cocok menampilkan empty state; Hapus filter mereset; filter Peach, urutan A-Z, pagination, dan keranjang bekerja.
- Asset gate PASS: 41 file publik tersedia dan tidak ada aset pengguna yang ditimpa; public/assets tidak lagi diabaikan oleh git.

Kesamaan pixel-perfect belum dapat diverifikasi. Hibiscus pada frame Figma belum tersedia sebagai aset lokal; hero masih memakai flower.png berupa keranjang bunga. Export PNG/WebP transparan hibiscus dari Figma diperlukan untuk menyamakan gambar utama. Warna teks kecil sengaja lebih gelap agar tetap memenuhi kontras aksesibilitas.

## Bukti Verifikasi Awal

Verifikasi implementasi awal pada 15 Oktober 2026, sebelum revisi katalog desktop di atas. Laporan berikut adalah catatan historis, bukan klaim bahwa styling awal masih digunakan. Bukan sertifikasi aksesibilitas atau bukti integrasi AI produksi.

- Enam tes Node lulus: data katalog/varian, field wajib, file upload, payload form, payload file, dan response/URL gagal.
- Build Vite produksi lulus. Audit npm: 0 kerentanan setelah sharp diperbarui.
- Playwright memeriksa Home, Shop, dan Detail pada lebar 320, 390, 768, 1024, 1440, serta 1920 px: tidak ada horizontal overflow, judul keluar viewport, gambar gagal yang sudah dimuat, atau error runtime JavaScript.
- Screenshot desktop Home, Shop, Detail, dan Try On, serta detail mobile diperiksa. Pasangan input/dropdown memiliki posisi vertikal yang sama.
- Pemeriksaan kontras: body 14,26:1; muted di pink 5,33:1; script 5,71:1; tombol 6,32:1; placeholder 5,59:1; error 6,57:1; border kontrol 3,56:1; focus 7,63:1.

### Click-Through

| Kontrol | Hasil yang diperiksa |
| --- | --- |
| Home, Shop, Services, Best Seller, About Us | Navigasi ke halaman/section yang ada. |
| Shop Now hero, CTA bawah, Lihat semua, link koleksi | Membuka Shop atau Detail sesuai action. |
| Birthday, Wedding, Greeting Card, Baby Born, Flower Bouquet | Membuka Shop. Katalog saat ini hanya papan akrilik mock, bukan inventori tiap layanan. |
| Link footer dan breadcrumb Shop | Navigasi ke halaman/section nyata. |
| Search header dan pencarian Shop | Hasil Ungu Putih, empty state untuk pencarian yang tidak cocok, lalu reset dengan Hapus filter. |
| Filter warna, nama A-Z/Z-A | Filter Peach serta urutan Biru Krem/Ungu Putih yang sesuai. |
| Pagination 2, berikutnya, sebelumnya | Halaman kedua 9 produk, halaman terakhir 3 produk, kembali ke halaman kedua. |
| Kartu katalog | Detail dibuka dengan warna produk yang tepat. |
| P1-P8 dan empat thumbnail galeri | Kedua preview sinkron, default P1. |
| Pesan Sekarang, tambah, kurang, hapus | Dialog terbuka, kuantitas 1-2-1, item hilang dan empty state muncul. |
| Escape pada dialog | Menutup modal, termasuk setelah tombol item yang terfokus dihapus. |
| Menu mobile | Buka dan tutup dengan Escape. |
| Tab dari skip link | Berpindah ke logo dengan outline solid 3 px. |
| Generate, form kosong | Native validation menolak field wajib kosong. |
| Generate, API simulasi sukses | POST multipart, spinner, tombol disabled, lalu generated_image_url ditampilkan. |
| Ganti varian setelah hasil | Hasil dikosongkan, preview kembali ke sampel varian baru. |
| Pilih file lokal | Metode otomatis IMAGE_UPLOAD; POST hanya membawa file overlay dan field dasar. |
| Ubah input form setelah metode upload | Metode otomatis FORM. |
| HTTP 500 dan endpoint belum tersedia | Error terlihat dan loading berakhir; tidak ada hasil palsu. |
| Upload non-gambar | Ditolak sebelum request. |

### Delivery Gate Frontend

- R-02 PASS: copy aplikasi tidak menggunakan em dash.
- R-03 PASS: 18 kombinasi halaman/viewport tanpa overflow; kontrol detail mobile minimal 44 px.
- R-17 PASS: harga ditandai mock; jumlah katalog berasal dari data, tidak ada statistik pemasaran.
- R-18 PASS: tidak ada testimoni atau identitas pelanggan yang dibuat.
- R-23 PASS: aset dari folder pengguna, navigasi dari spesifikasi, tanpa logo/avatar baru.
- R-24 PASS: nav menuju route atau section yang ada dan telah diklik.
- R-25 PASS: kombinasi teks, tombol, placeholder, error, border, dan focus dihitung; teks tidak ditumpuk pada foto produk.
- R-26 PASS: tindakan kontrol tersedia, tercatat pada tabel click-through; checkout tidak disajikan sebagai tombol aktif.
- R-27 PASS: loading katalog/generate, empty pencarian/keranjang, serta error request/gambar tersedia.
- R-28 PASS: tidak ada FAQ tanpa pertanyaan nyata.
- R-32 PASS: kontrol memakai elemen native, focus outline 3 px, Tab dan Escape diperiksa.
- R-33 PASS: UI ditulis langsung di source; skrip hanya menyiapkan aset, tidak mem-patch source/CSS.
- R-34 PASS: hanya tema terang yang disediakan, tanpa toggle tema rusak.
- R-35 PASS: build dan click-through dijalankan; console 404/500 hanya pada pengujian kegagalan API yang disengaja.
- R-36 PASS: tidak ada klaim keamanan, performa, pelanggan, atau sertifikasi yang dibuat.
- R-37 PASS: Figma dipilih pengguna; font/palet DESIGN.md digunakan setelah arah visual disepakati.
- R-38 PASS: katalog ditandai contoh, tidak ada hasil AI palsu di aplikasi.
- R-01 PASS: pink merupakan warna brand, tanpa glow atau gradient dekoratif.
- R-04 PASS: Solar dari arah desain; glyph mewakili tindakan pencarian, tas, galeri, dan upload.
- R-06 PASS: peran tiga font ditetapkan dari DESIGN.md; tanpa monospace atau letter spacing dekoratif.
- R-07 PASS: tidak ada grid, blueprint, dot pattern, atau latar generik.
- R-08 PASS: arrow hanya memberi arah navigasi/link; form dan keranjang memakai ikon tindakan.
- R-09 PASS: label Sampel/Hasil AI adalah state nyata, tanpa badge pemasaran.
- R-10 PASS: tidak ada glassmorphism.
- R-12 PASS: shadow hanya untuk elevasi dialog modal.
- R-13 PASS: tidak ada glow.
- R-14 PASS: layanan berupa deretan kategori, bukan feature cards yang dibuat untuk mengisi template.
- R-19 PASS: fade untuk pergantian hasil dan hover ringan, tanpa motion dekoratif berulang.
- R-22 PASS: gambar bunga, toko, dan mobil berasal dari aset yang relevan; tidak ada ilustrasi generik baru.
- Liveliness/dials PASS: ENERGY 2 / RHYTHM 2 / MOTION 2 dinyatakan sebelum UI dibuat dan dicatat di atas.
- Liveliness/focal point PASS: hero bunga/brand, katalog foto, serta galeri produk menjadi fokus tiap halaman.
- Liveliness/whitespace PASS: spacing mengelompokkan informasi, foto, dan form; screenshot desktop diperiksa.
- Liveliness/accent PASS: warna rose gelap untuk action dan selected state, bukan dekorasi di semua permukaan.
- Liveliness/motif PASS: frasa script pendek, foto lengkung, dan pink florist berulang sesuai Figma.
- Liveliness/Design Read PASS: katalog florist untuk pembeli papan akrilik, mengikuti bahasa visual Figma.
- C-1 PASS: alasan warna, font, layout, spacing, ikon, dan motion dicatat.
- C-2 PASS: kontrol memiliki action; layanan yang belum ada tidak disamarkan sebagai fitur aktif.
- C-3 PASS: section mengikuti spesifikasi florist; testimoni/FAQ/statistik pengisi dihilangkan.
- C-4 PASS: reflow enam lebar serta state form/upload/loading/error diperiksa; keyboard native dipertahankan.
- C-5 PASS: aset berasal dari pengguna, mock diberi label, tanpa social proof fiktif.
- R-05 PASS: halaman mengikuti alur Home, katalog, galeri/detail, dan kustomisasi; bukan dashboard generik.
- R-11 PASS: lengkung foto dari Figma, button pill, input/form radius kecil, dialog 8 px; tidak semua elemen pill.
- R-15 PASS: action memakai Shop Now dari acuan dan label Pesan Sekarang/Generate Image yang diminta.
- R-16 PASS: tanpa buzzword pemasaran; judul AI Image Review berasal dari spesifikasi.
- R-20 PASS: aset asli, palet florist, script, dan foto lengkung membentuk identitas Dipi.
- R-21 PASS: fixed light sesuai Figma; tidak ada dark theme yang dipaksakan.
- R-29 PASS: pink/blush, rose, dan neutral digunakan berdasarkan sistem warna, bukan campuran aksen acak.
- R-30 PASS: mengikuti Figma pengguna, bukan meniru produk lain.
- R-31 PASS: alasan keputusan utama tercatat pada Keputusan Visual.

## Batas Yang Belum Diuji

Backend AI nyata, kualitas render/presisi tulisan AI, autentikasi, checkout, deployment, CORS lintas origin, dan perangkat mobile fisik belum diuji. Implementasi memakai aset lokal yang tersedia; bukan klaim pixel-perfect atau hasil export seluruh frame Figma. Perubahan/penghapusan file lama yang sudah ada pada worktree tidak direvert.