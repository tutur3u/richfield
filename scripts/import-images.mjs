#!/usr/bin/env node
// One-shot image migrator: takes the client-doc/RF Website OneDrive May (15|18)
// product images, modern-trade retailer logos, and selected photos, normalises
// names, downsamples to a sensible web width, and writes webp into
// public/photos/{products,retailers,people}/.
//
// Run with: bun scripts/import-images.mjs

import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve, parse } from "node:path";
import { fileURLToPath } from "node:url";

const sharp = (await import("sharp")).default;

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const oneDrive15 = join(root, "client-doc/RF Website OneDrive May 15 2026");
const oneDrive18 = join(root, "client-doc/RF Website OneDrive May 18 2026");

const outProducts = join(root, "public/photos/products");
const outRetailers = join(root, "public/photos/retailers");
const outPeople = join(root, "public/photos/people");

await mkdir(outProducts, { recursive: true });
await mkdir(outRetailers, { recursive: true });
await mkdir(outPeople, { recursive: true });

const toKebab = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

async function convert(srcPath, destPath, { maxWidth = 1400, quality = 86 } = {}) {
  if (existsSync(destPath)) return { skipped: true };
  const img = sharp(srcPath);
  const meta = await img.metadata();
  const width = meta.width ?? maxWidth;
  const targetWidth = Math.min(width, maxWidth);
  await img
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(destPath);
  return { width: targetWidth };
}

async function walk(dir, predicate) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(p, predicate)));
    } else if (predicate(p)) {
      out.push(p);
    }
  }
  return out;
}

const imageFilter = (p) => /\.(png|jpg|jpeg|webp)$/i.test(p);

const PRODUCT_MAPPING = {
  Mars: "mars",
  Glico: "glico-pocky",
  Amos: "amos",
  "New Choice": "newchoice",
  "Red Bull": "redbull",
};

console.log("• Products");
for (const [folder, prefix] of Object.entries(PRODUCT_MAPPING)) {
  const dir = join(oneDrive15, "Product Images", folder);
  if (!existsSync(dir)) continue;
  for (const src of await walk(dir, imageFilter)) {
    const { name } = parse(src);
    const slug = toKebab(name);
    const dest = join(outProducts, `${prefix}-${slug}.webp`);
    // Product packshots can be displayed large in the §05 mosaic; keep enough
    // resolution for retina (was 800px, which looked soft at box size).
    const res = await convert(src, dest, { maxWidth: 1400, quality: 86 });
    if (res.skipped) continue;
    console.log(`  → ${prefix}-${slug}.webp`);
  }
}

// BIC has Lighters/ and Shavers/ subfolders.
const bicDir = join(oneDrive15, "Product Images/BIC");
if (existsSync(bicDir)) {
  for (const sub of ["Lighters", "Shavers"]) {
    const subDir = join(bicDir, sub);
    if (!existsSync(subDir)) continue;
    const files = (await readdir(subDir)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
    files.sort();
    let idx = 0;
    for (const f of files) {
      idx += 1;
      // Many BIC originals are square 1080×1080 social posts. Keep the first 4
      // of each subcategory, more than enough for the SKU grid.
      if (idx > 4) break;
      const dest = join(outProducts, `bic-${sub.toLowerCase()}-${idx}.webp`);
      const res = await convert(join(subDir, f), dest, { maxWidth: 1400, quality: 86 });
      if (res.skipped) continue;
      console.log(`  → bic-${sub.toLowerCase()}-${idx}.webp`);
    }
  }
}

console.log("• Modern Trade retailer logos");
const mtDir = join(oneDrive18, "Logo MT");
if (existsSync(mtDir)) {
  for (const src of await walk(mtDir, imageFilter)) {
    const { name } = parse(src);
    const slug = toKebab(name);
    const dest = join(outRetailers, `${slug}.webp`);
    // Retailer logos are usually wide rectangles; cap at 320w and keep alpha.
    const res = await convert(src, dest, { maxWidth: 320, quality: 88 });
    if (res.skipped) continue;
    console.log(`  → ${slug}.webp`);
  }
}

console.log("• Selected photos May 18");
const photoDir = join(oneDrive18, "Selected Photos May 18 2026");
if (existsSync(photoDir)) {
  let idx = 0;
  for (const src of await walk(photoDir, imageFilter)) {
    idx += 1;
    const dest = join(outPeople, `selected-2026-05-${String(idx).padStart(2, "0")}.webp`);
    const res = await convert(src, dest, { maxWidth: 1600, quality: 82 });
    if (res.skipped) continue;
    const meta = await sharp(dest).metadata();
    console.log(`  → ${parse(dest).base}  ${meta.width}×${meta.height}`);
  }
}

console.log("✓ done");
void stat;
