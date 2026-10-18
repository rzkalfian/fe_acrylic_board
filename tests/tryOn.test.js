import test from "node:test";
import assert from "node:assert/strict";
import { createUseCases } from "../src/application/useCases.js";
import {
  emptyCustomization,
  validateCustomization,
} from "../src/domain/tryOn.js";
import {
  createTryOnRepository,
  productRepository,
} from "../src/infrastructure/repositories.js";

const input = {
  methodType: "FORM",
  variant: { code: "P1", imageUrl: "https://example.org/p1.webp" },
  fields: {
    ...emptyCustomization,
    ucapan_selamat: "Selamat",
    pesan: "Sukses",
    kepada: "Penerima",
    dari: "Pengirim",
  },
};

test("katalog mock memiliki 21 produk dan varian P1-P8", async () => {
  const products = await productRepository.getAll();
  assert.equal(products.length, 21);
  assert.equal(
    (await productRepository.getById("prod-001")).variants[0].code,
    "P1",
  );
  assert.equal(products[0].variants.length, 8);
  for (const product of products.slice(1)) {
    assert.equal(product.variants[0].code, "P1");
    assert.equal(product.variants[0].imageUrl, product.imageUrl);
    assert.equal(product.variants[0].label, product.color);
  }
  assert.equal(await productRepository.getById("missing"), null);
});

test("field wajib dan varian divalidasi sebelum memanggil repository", async () => {
  let called = false;
  const useCases = createUseCases(productRepository, {
    generate: async () => {
      called = true;
    },
  });
  for (const field of ["ucapan_selamat", "pesan", "kepada", "dari"]) {
    await assert.rejects(
      useCases.generateTryOn({
        ...input,
        fields: { ...input.fields, [field]: " " },
      }),
      /wajib diisi/,
    );
  }
  assert.equal(called, false);
  assert.throws(
    () => validateCustomization({ ...input, variant: null }),
    /varian/,
  );
  assert.throws(
    () => validateCustomization({ ...input, methodType: "UNKNOWN" }),
    /metode/,
  );
});

test("upload memvalidasi tipe, keberadaan, dan ukuran file", () => {
  const upload = { ...input, methodType: "IMAGE_UPLOAD", fields: {} };
  assert.throws(() => validateCustomization(upload), /Pilih gambar/);
  assert.throws(
    () =>
      validateCustomization({
        ...upload,
        file: { type: "image/svg+xml", size: 20 },
      }),
    /PNG/,
  );
  for (const size of [0, 10 * 1024 * 1024 + 1]) {
    assert.throws(
      () =>
        validateCustomization({ ...upload, file: { type: "image/png", size } }),
      /Ukuran/,
    );
  }
  assert.doesNotThrow(() =>
    validateCustomization({ ...upload, file: { type: "image/png", size: 20 } }),
  );
});

test("repository mengirim FormData dan memetakan URL hasil AI", async () => {
  const controller = new AbortController();
  const repository = createTryOnRepository("/ai", async (endpoint, options) => {
    assert.equal(endpoint, "/ai");
    assert.equal(options.method, "POST");
    assert.equal(options.signal, controller.signal);
    assert.equal(options.body.get("variant_code"), "P1");
    assert.equal(options.body.get("base_image_url"), input.variant.imageUrl);
    assert.equal(options.body.get("ucapan_selamat"), "Selamat");
    assert.equal(options.body.get("overlay_image"), null);
    return Response.json({
      generated_image_url: "https://example.org/result.webp",
    });
  });
  assert.equal(
    await repository.generate(input, controller.signal),
    "https://example.org/result.webp",
  );
});

test("repository mengirim file tanpa field form saat metode upload", async () => {
  const file = new File(["test"], "design.png", { type: "image/png" });
  const repository = createTryOnRepository("/ai", async (_, options) => {
    assert.equal(options.body.get("overlay_image").name, "design.png");
    assert.equal(options.body.get("ucapan_selamat"), null);
    return Response.json({
      generated_image_url: "https://example.org/result.webp",
    });
  });
  await repository.generate({ ...input, methodType: "IMAGE_UPLOAD", file });
});

test("repository menolak endpoint kosong, response gagal, dan URL berbahaya", async () => {
  await assert.rejects(
    createTryOnRepository("").generate(input),
    /belum terhubung/,
  );
  await assert.rejects(
    createTryOnRepository(
      "/ai",
      async () => new Response("", { status: 500 }),
    ).generate(input),
    /belum berhasil/,
  );
  for (const url of [
    undefined,
    "invalid",
    "javascript:alert(1)",
    "data:image/png;base64,abc",
  ]) {
    await assert.rejects(
      createTryOnRepository("/ai", async () =>
        Response.json({ generated_image_url: url }),
      ).generate(input),
      /URL/,
    );
  }
});
test("pesan WhatsApp memuat isi try on, hasil gambar, dan data pemesan", async () => {
  const { buildOrderMessage } = await import("../src/domain/tryOn.js");
  const text = buildOrderMessage({
    product: { name: "Papan", price: 1000 },
    variant: { code: "P1", label: "Merah" },
    fields: { ...input.fields, ucapan_selamat_font: "script" },
    resultUrl: "https://x.test/r.webp",
    customer: {
      name: "Budi",
      phone: "0812",
      address: "Jl. A",
      quantity: 2,
      note: "",
    },
    formatPrice: String,
  });
  for (const part of [
    "P1 - Merah",
    "1000 x 2 = 2000",
    "Ucapan: Selamat [Script]",
    "https://x.test/r.webp",
    "Nama: Budi",
  ])
    assert.ok(text.includes(part), part);
  assert.ok(!text.includes("Catatan"));
});
