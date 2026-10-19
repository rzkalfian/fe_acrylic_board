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

// Hanya jenis yang punya harga di produk yang bisa dipilih.
export function availableTypes(product) {
  return orderTypes
    .filter((type) => product[`price_${type.value}`] != null)
    .map((type) => ({ ...type, price: product[`price_${type.value}`] }));
}

export function validateOrder({ type, resultUrl, customer }) {
  if (!type) throw new Error("Pilih jenis pesanan.");
  if (type.needsText && !resultUrl)
    throw new Error("Buat gambar Try On dulu agar tulisan Anda tercatat.");
  if (type.rent) {
    if (!customer.rentStart || !customer.rentEnd)
      throw new Error("Isi tanggal mulai dan selesai sewa.");
    if (customer.rentEnd < customer.rentStart)
      throw new Error("Tanggal selesai sewa harus setelah tanggal mulai.");
  }
}

// id produk -> { types, from }; `from` adalah harga terendah dari jenis yang dijual.
export function indexPrices(products) {
  return new Map(
    products.map((product) => {
      const types = availableTypes(product);
      return [
        product.id,
        {
          types,
          from: types.length ? Math.min(...types.map((t) => t.price)) : null,
        },
      ];
    }),
  );
}
