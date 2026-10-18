import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../src/data/products.js";

const publicFolder = fileURLToPath(new URL("../public/", import.meta.url));
const assets = new Set([
  ...products.flatMap((product) => [
    product.imageUrl,
    ...product.variants.map((variant) => variant.imageUrl),
  ]),
  "/assets/images/flower-logo.png",
  "/assets/images/flower.png",
  "/assets/images/example.jpg",
  "/assets/images/car-flower.png",
  "/assets/background/Vector-bg-left.png",
  "/assets/background/Vector-bg-right.png",
  "/assets/background/flowers-background.png",
  ...["baby", "birthday", "card", "flower", "merried"].map(
    (service) => `/assets/icons/service-${service}.png`,
  ),
]);
for (const asset of assets) {
  await access(path.join(publicFolder, asset));
}
console.log(
  `Aset public terverifikasi: ${assets.size} file; tidak ada aset yang ditimpa.`,
);
