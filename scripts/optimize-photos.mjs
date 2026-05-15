#!/usr/bin/env node
// One-off image optimizer: client-doc source -> public/photos/{people,products,logos}/
// Reads from the curated manifest below, converts to WebP at multiple widths.
// Run: node scripts/optimize-photos.mjs

import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const SRC_PEOPLE = path.join(ROOT, "client-doc/Employees Photos");
const SRC_ASSETS = path.join(ROOT, "client-doc/RF Website OneDrive May 15 2026");
const OUT = path.join(ROOT, "public/photos");

const PEOPLE = [
  { src: "Tập thể CTY.JPG", slug: "group-company", widths: [1920, 1280, 800] },
  { src: "Khai trương 2026.JPG", slug: "grand-opening-2026", widths: [1280, 800] },
  { src: "Happy Time 11.2025.JPG", slug: "happy-time-2025-11", widths: [1280, 800] },
  { src: "WS (1).jpg", slug: "workshop-1", widths: [1280, 800] },
  { src: "WS (8).jpg", slug: "workshop-2", widths: [1280, 800] },
  { src: "WS (10).jpg", slug: "workshop-3", widths: [1280, 800] },
  { src: "Đại Hội Công Đoàn 2025.jpg", slug: "union-congress-2025", widths: [1280, 800] },
  { src: "Sinh nhật Sếp Bill 2025.jpg", slug: "celebration", widths: [1280, 800] },
  { src: "Workshop(2).JPG", slug: "workshop-room", widths: [1280, 800] },
  { src: "DSC_1893 (1).jpg", slug: "candid-1", widths: [1280, 800] },
  { src: "DSC_1668 (1).jpg", slug: "candid-2", widths: [1280, 800] },
];

const LOGOS = [
  { src: "Logos/LOGO RICHFIELD.png", slug: "richfield" },
  { src: "Logos/Mars Wrigley Logo RGB (secondary).png", slug: "mars-wrigley" },
  { src: "Logos/BIC logo.png", slug: "bic" },
  { src: "Logos/Red_Bull_Logo.svg.png", slug: "red-bull" },
  { src: "Logos/Pocky-logo.png", slug: "glico-pocky" },
  { src: "Logos/Glico_logo.jpg", slug: "glico" },
  { src: "Logos/Amos logo.png", slug: "amos" },
  { src: "Logos/New Choice logo.png", slug: "newchoice" },
  { src: "Logos/Logo Warrior.png", slug: "warrior" },
  { src: "Logos/Weilong logo.png", slug: "weilong" },
  { src: "Logos/TCP logo.png", slug: "tcp" },
  { src: "Logos/Care Logo.png", slug: "care" },
  { src: "Logos/Kinko Logo.png", slug: "kinko" },
];

const PRODUCTS = [
  // Glico Pocky
  { src: "Product Images/Glico/Pocky_chocolate.png", slug: "glico-pocky-chocolate" },
  { src: "Product Images/Glico/Pocky_strawberry.png", slug: "glico-pocky-strawberry" },
  { src: "Product Images/Glico/Pocky_matcha.png", slug: "glico-pocky-matcha" },
  { src: "Product Images/Glico/Pocky_milk.png", slug: "glico-pocky-milk" },
  // Red Bull / Warrior
  { src: "Product Images/Red Bull/RB đỏ.png", slug: "red-bull-classic" },
  { src: "Product Images/Red Bull/RB chai xanh.png", slug: "red-bull-blue" },
  { src: "Product Images/Red Bull/Warrior nho lon.png", slug: "warrior-grape-can" },
  { src: "Product Images/Red Bull/Warrior dâu.png", slug: "warrior-strawberry" },
  // Mars
  { src: "Product Images/Mars/M&M.png", slug: "mars-mm" },
  { src: "Product Images/Mars/Snickers.png", slug: "mars-snickers" },
  { src: "Product Images/Mars/Doublemint.png", slug: "mars-doublemint" },
  { src: "Product Images/Mars/Cool Air.png", slug: "mars-cool-air" },
  // Amos
  { src: "Product Images/Amos/AMOS.png", slug: "amos-hero" },
  { src: "Product Images/Amos/Bunny Amos.png", slug: "amos-bunny" },
  // BIC
  { src: "Product Images/BIC/Lighters/470120468_595158199861603_1054267305401427985_n.jpg", slug: "bic-lighter-1" },
  { src: "Product Images/BIC/Lighters/471149205_600144846029605_9003584780105978729_n.jpg", slug: "bic-lighter-2" },
  { src: "Product Images/BIC/Shavers/Dao cạo râu BIC Easy Clic - 3.jpg", slug: "bic-shaver-1" },
  { src: "Product Images/BIC/Shavers/Hộp dao cạo râu BIC Hydrid 3 lưỡi 4 đầu -3.jpg", slug: "bic-shaver-2" },
  // New Choice
  { src: "Product Images/New Choice/Rau-cau-Gau-hong-750g---Huong-vi-trai-cay-nhiet-doi-6309.jpg", slug: "newchoice-pink-bear" },
  { src: "Product Images/New Choice/Rau-cau-Gau-vang-750g---Huong-vi-trai-cay-tong-hop-2620.jpg", slug: "newchoice-yellow-bear" },
  { src: "Product Images/New Choice/Thach-rau-cau-DORAEMON-hu-7264.jpg", slug: "newchoice-doraemon" },
  { src: "Product Images/New Choice/Kem-da-huong-trai-cay-2909.jpg", slug: "newchoice-fruit-jelly" },
];

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

async function processPhoto({ srcPath, outDir, slug, widths, fit = "inside" }) {
  const input = sharp(srcPath, { failOn: "none" }).rotate();
  const meta = await input.metadata();
  const baseWidth = meta.width || widths[0];

  for (const w of widths) {
    const targetW = Math.min(w, baseWidth);
    const outName = widths.length > 1 ? `${slug}-${w}.webp` : `${slug}.webp`;
    const outPath = path.join(outDir, outName);
    await sharp(srcPath, { failOn: "none" })
      .rotate()
      .resize({ width: targetW, fit, withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(outPath);
    const s = await stat(outPath);
    console.log(`  ${outName.padEnd(40)} ${(s.size / 1024).toFixed(1).padStart(7)} KB`);
  }
}

async function processLogo({ srcPath, outDir, slug }) {
  const outPath = path.join(outDir, `${slug}.webp`);
  await sharp(srcPath, { failOn: "none" })
    .rotate()
    .resize({ width: 480, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85, effort: 6 })
    .toFile(outPath);
  const s = await stat(outPath);
  console.log(`  ${(slug + ".webp").padEnd(40)} ${(s.size / 1024).toFixed(1).padStart(7)} KB`);
}

async function run() {
  const peopleOut = path.join(OUT, "people");
  const productsOut = path.join(OUT, "products");
  const logosOut = path.join(OUT, "logos");
  await Promise.all([ensureDir(peopleOut), ensureDir(productsOut), ensureDir(logosOut)]);

  console.log("\n[people]");
  for (const p of PEOPLE) {
    const srcPath = path.join(SRC_PEOPLE, p.src);
    if (!existsSync(srcPath)) {
      console.warn(`  MISSING: ${p.src}`);
      continue;
    }
    await processPhoto({ srcPath, outDir: peopleOut, slug: p.slug, widths: p.widths, fit: "cover" });
  }

  console.log("\n[products]");
  for (const p of PRODUCTS) {
    const srcPath = path.join(SRC_ASSETS, p.src);
    if (!existsSync(srcPath)) {
      console.warn(`  MISSING: ${p.src}`);
      continue;
    }
    await processPhoto({ srcPath, outDir: productsOut, slug: p.slug, widths: [600], fit: "inside" });
  }

  console.log("\n[logos]");
  for (const l of LOGOS) {
    const srcPath = path.join(SRC_ASSETS, l.src);
    if (!existsSync(srcPath)) {
      console.warn(`  MISSING: ${l.src}`);
      continue;
    }
    await processLogo({ srcPath, outDir: logosOut, slug: l.slug });
  }

  console.log("\nDone.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
