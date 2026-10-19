export const orderTypes = [
  { value: "beli_papan", label: "Beli papan dihias", needsText: false },
  {
    value: "beli_tulisan",
    label: "Beli papan dihias + tulisan",
    needsText: true,
  },
  {
    value: "sewa_tulisan",
    label: "Sewa papan dihias + tulisan",
    needsText: true,
    rent: true,
  },
];

// Ketiga kategori order selalu ditampilkan; yang belum punya harga di produk ditandai tidak tersedia.
export function orderCategories(product) {
  return orderTypes.map((type) => {
    const price = product[`price_${type.value}`] ?? null;
    return { ...type, price, available: price !== null };
  });
}

export function validateOrder({ type, resultUrl, customer }) {
  if (!type) throw new Error("Pilih kategori order.");
  if (type.needsText && !resultUrl)
    throw new Error("Buat gambar Try On dulu agar tulisan Anda tercatat.");
  if (type.rent) {
    if (!customer.rentStart || !customer.rentEnd)
      throw new Error("Isi tanggal mulai dan selesai sewa.");
    if (customer.rentEnd < customer.rentStart)
      throw new Error("Tanggal selesai sewa harus setelah tanggal mulai.");
  }
}
