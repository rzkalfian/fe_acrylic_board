const colors = [
  ['merah', 'Merah'], ['merah-putih', 'Merah Putih'], ['pink-putih-krem', 'Pink Putih Krem'],
  ['kuning-navy', 'Kuning Navy'], ['hijau-sage', 'Hijau Sage'], ['biru-putih', 'Biru Putih'],
  ['peach', 'Peach'], ['ungu-putih', 'Ungu Putih'], ['sage-krem', 'Sage Krem'],
  ['red-rose-peach-pink', 'Red Rose Peach Pink'], ['raseberry', 'Raspberry'], ['pink-red-rose', 'Pink Red Rose'],
  ['oren-putih', 'Oranye Putih'], ['kuning-krem', 'Kuning Krem'], ['krem-cokelat', 'Krem Cokelat'],
  ['hijau-tosca', 'Hijau Tosca'], ['gold-krem', 'Gold Krem'], ['cokelat-susu', 'Cokelat Susu'],
  ['cokelat-susu-kuning', 'Cokelat Susu Kuning'], ['biru-muda', 'Biru Muda'], ['biru-krem', 'Biru Krem'],
];

export const dummyProductDetail = {
  id: 'prod-001',
  name: 'PAPAN AKRILIK WARNA MERAH',
  category: 'Akrilik / Flower Board',
  price: 120000,
  description: 'Papan akrilik dengan desain bunga di bagian atas dan bagian bawah dengan perpaduan kombinasi 2 warna, warna bisa dipilih di bagian kategori yang disediakan.',
  variants: colors.slice(0, 8).map(([slug, label], index) => ({
    code: `P${index + 1}`, label, slug, imageUrl: `/assets/products/p${index + 1}.webp`,
  })),
};

export const products = colors.map(([slug, color], index) => ({
  ...dummyProductDetail,
  id: index === 0 ? dummyProductDetail.id : slug,
  name: `PAPAN AKRILIK WARNA ${color.toUpperCase()}`,
  color,
  imageUrl: `/assets/products/${slug}.webp`,
  variants: index === 0 ? dummyProductDetail.variants : [colors[index], ...colors.filter(([variantSlug]) => variantSlug !== slug)].slice(0, 8).map(([variantSlug, label], variantIndex) => ({
    code: `P${variantIndex + 1}`, label, slug: variantSlug, imageUrl: `/assets/products/${variantSlug}.webp`,
  })),
}));