export const fontOptions = [
  ["", "Font bawaan"],
  ["script", "Script"],
  ["serif", "Serif"],
  ["sans", "Sans Serif"],
  ["mono", "Monospace"],
];
export const styleOptions = [
  ["", "Gaya bawaan"],
  ["normal", "Normal"],
  ["bold", "Bold"],
  ["italic", "Italic"],
  ["bolditalic", "Bold Italic"],
];
export const sizeOptions = [
  ["", "Ukuran bawaan"],
  ["small", "Kecil"],
  ["normal", "Normal"],
  ["large", "Besar"],
  ["xlarge", "Sangat besar"],
];

export const emptyCustomization = {
  ucapan_selamat: "",
  tambahan: "",
  pesan: "",
  kepada: "",
  dari: "",
  atribut: "",
  posisi: "",
  ...Object.fromEntries(
    ["ucapan_selamat", "tambahan", "pesan", "kepada", "dari"].flatMap((name) =>
      ["font", "style", "size"].map((kind) => [`${name}_${kind}`, ""]),
    ),
  ),
};

export function validateCustomization({ methodType, fields, file, variant }) {
  if (!variant?.imageUrl)
    throw new Error("Pilih varian papan terlebih dahulu.");
  if (methodType === "IMAGE_UPLOAD") {
    if (!file) throw new Error("Pilih gambar desain terlebih dahulu.");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      throw new Error("Gunakan gambar PNG, JPG, atau WebP.");
    }
    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      throw new Error("Ukuran gambar harus antara 1 byte dan 10 MB.");
    }
    return;
  }
  if (methodType !== "FORM")
    throw new Error("Pilih metode kustomisasi yang valid.");
  const required = {
    ucapan_selamat: "Ucapan / Selamat",
    pesan: "Pesan",
    kepada: "Kepada",
    dari: "Dari",
  };
  for (const [field, label] of Object.entries(required)) {
    if (!fields?.[field]?.trim()) throw new Error(`${label} wajib diisi.`);
  }
}
const labelOf = (options, value) => options.find(([key]) => key === value)?.[1];

// Baris isi papan (ucapan, pesan, nama, gaya); dipakai pesan WhatsApp dan catatan pesanan di admin.
export function boardLines(fields) {
  const lines = [];
  for (const [name, title] of [
    ["ucapan_selamat", "Ucapan"],
    ["tambahan", "Tambahan"],
    ["pesan", "Pesan"],
    ["kepada", "Kepada"],
    ["dari", "Dari"],
  ]) {
    if (!fields[name]?.trim()) continue;
    const style = [
      ["font", fontOptions],
      ["style", styleOptions],
      ["size", sizeOptions],
    ]
      .map(
        ([kind, options]) =>
          fields[`${name}_${kind}`] &&
          labelOf(options, fields[`${name}_${kind}`]),
      )
      .filter(Boolean)
      .join(", ");
    lines.push(
      `- ${title}: ${fields[name].trim()}${style ? ` [${style}]` : ""}`,
    );
  }
  if (fields.atribut) lines.push(`Atribut: ${fields.atribut}`);
  if (fields.posisi) lines.push(`Posisi: ${fields.posisi}`);
  return lines;
}

export function buildOrderMessage({
  product,
  variant,
  fields,
  resultUrl,
  customer,
  formatPrice,
  orderType,
  unitPrice = product.price,
}) {
  const quantity = Number(customer.quantity);
  const lines = [
    "Halo Dipi Floriest, saya ingin memesan papan akrilik:",
    "",
    `Produk: ${product.name} (${variant.code} - ${variant.label})`,
  ];
  if (orderType) lines.push(`Jenis: ${orderType.label}`);
  lines.push(
    `Harga: ${formatPrice(unitPrice)} x ${quantity} = ${formatPrice(unitPrice * quantity)}`,
  );
  if (!orderType || orderType.needsText)
    lines.push("", "Isi papan:", ...boardLines(fields));
  if (customer.rentStart)
    lines.push("", `Sewa: ${customer.rentStart} sampai ${customer.rentEnd}`);
  if (resultUrl) lines.push("", `Hasil Try On: ${resultUrl}`);
  lines.push(
    "",
    `Nama: ${customer.name.trim()}`,
    `WhatsApp: ${customer.phone.trim()}`,
    `Alamat: ${customer.address.trim()}`,
  );
  if (customer.note?.trim()) lines.push(`Catatan: ${customer.note.trim()}`);
  return lines.join("\n");
}
