import { products } from "../data/products.js";

export const productRepository = {
  async getAll() {
    return products;
  },
  async getById(id) {
    return products.find((product) => product.id === id) ?? null;
  },
};

export function createOrderRepository(apiBase, request = fetch) {
  return {
    // null = produk belum ada di backend, jadi belum bisa dipesan.
    async getProduct(id) {
      const response = await request(`${apiBase}/products`);
      if (!response.ok) throw new Error("Harga produk belum berhasil dimuat.");
      const products = await response.json();
      return products.find((product) => product.id === id) ?? null;
    },
    async place(order) {
      const response = await request(`${apiBase}/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(order),
      });
      if (response.status === 400 || response.status === 404) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Data pesanan belum sesuai.");
      }
      if (response.status === 429)
        throw new Error("Terlalu banyak percobaan. Coba lagi sebentar.");
      if (!response.ok)
        throw new Error("Pesanan belum berhasil dikirim. Silakan coba lagi.");
      const result = await response.json();
      if (typeof result.id !== "string")
        throw new Error("Pesanan belum berhasil dikirim. Silakan coba lagi.");
      return result.id;
    },
  };
}

export function createTryOnRepository(endpoint, request = fetch) {
  return {
    async generate({ variant, methodType, fields, file }, signal) {
      if (!endpoint)
        throw new Error(
          "Layanan AI belum terhubung. Silakan coba kembali setelah layanan tersedia.",
        );
      const payload = new FormData();
      payload.append(
        "base_image_url",
        new URL(variant.imageUrl, globalThis.location?.origin).href,
      );
      payload.append("variant_code", variant.code);
      payload.append("method_type", methodType);
      if (methodType === "IMAGE_UPLOAD") payload.append("overlay_image", file);
      else
        for (const [key, value] of Object.entries(fields))
          payload.append(key, value.trim());
      const response = await request(endpoint, {
        method: "POST",
        body: payload,
        signal,
      });
      if (response.status === 404)
        throw new Error(
          "Layanan AI belum terhubung. Silakan coba kembali setelah layanan tersedia.",
        );
      if (!response.ok)
        throw new Error("Gambar belum berhasil dibuat. Silakan coba kembali.");
      const result = await response.json();
      if (typeof result.generated_image_url !== "string")
        throw new Error("Layanan AI tidak mengembalikan URL gambar.");
      let imageUrl;
      try {
        imageUrl = new URL(result.generated_image_url);
      } catch {
        throw new Error("URL gambar dari layanan AI tidak valid.");
      }
      if (!["http:", "https:"].includes(imageUrl.protocol))
        throw new Error("URL gambar dari layanan AI tidak valid.");
      return imageUrl.href;
    },
  };
}
