export const fontOptions = [
  ['', 'Font bawaan'], ['script', 'Script'], ['serif', 'Serif'], ['sans', 'Sans Serif'], ['mono', 'Monospace'],
];
export const styleOptions = [
  ['', 'Gaya bawaan'], ['normal', 'Normal'], ['bold', 'Bold'], ['italic', 'Italic'], ['bolditalic', 'Bold Italic'],
];
export const sizeOptions = [
  ['', 'Ukuran bawaan'], ['small', 'Kecil'], ['normal', 'Normal'], ['large', 'Besar'], ['xlarge', 'Sangat besar'],
];

export const emptyCustomization = {
  ucapan_selamat: '', tambahan: '', pesan: '', kepada: '', dari: '', atribut: '', posisi: '',
  ...Object.fromEntries(['ucapan_selamat', 'tambahan', 'pesan', 'kepada', 'dari'].flatMap((name) => ['font', 'style', 'size'].map((kind) => [`${name}_${kind}`, '']))),
};

export function validateCustomization({ methodType, fields, file, variant }) {
  if (!variant?.imageUrl) throw new Error('Pilih varian papan terlebih dahulu.');
  if (methodType === 'IMAGE_UPLOAD') {
    if (!file) throw new Error('Pilih gambar desain terlebih dahulu.');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      throw new Error('Gunakan gambar PNG, JPG, atau WebP.');
    }
    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      throw new Error('Ukuran gambar harus antara 1 byte dan 10 MB.');
    }
    return;
  }
  if (methodType !== 'FORM') throw new Error('Pilih metode kustomisasi yang valid.');
  const required = { ucapan_selamat: 'Ucapan / Selamat', pesan: 'Pesan', kepada: 'Kepada', dari: 'Dari' };
  for (const [field, label] of Object.entries(required)) {
    if (!fields?.[field]?.trim()) throw new Error(`${label} wajib diisi.`);
  }
}