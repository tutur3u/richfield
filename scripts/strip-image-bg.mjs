#!/usr/bin/env node
// Strip near-white backgrounds from brand/product/retailer logos so they
// composite cleanly on cream and paper surfaces.
//
// Strategy: read each PNG/webp, sample its 4 corners. If all four corners are
// near-white (≥ threshold per channel) the image has a flat backdrop we can
// remove. For each pixel, if it's near-white, set alpha = 0; otherwise feather
// the alpha by how far it is from white so we don't leave a halo around the
// subject.
//
// Skips files whose corners aren't uniform white (likely lifestyle / on-set
// photography that should keep its backdrop).
//
// Run with: bun scripts/strip-image-bg.mjs

import { readdir } from "node:fs/promises";
import { dirname, join, resolve, parse } from "node:path";
import { fileURLToPath } from "node:url";

const sharp = (await import("sharp")).default;

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const TARGETS = [
  join(root, "public/photos/logos"),
  join(root, "public/photos/products"),
  join(root, "public/photos/retailers"),
];

// Skip these — they're not flat-bg catalog shots
const KEEP_BG = new Set([
  // Add filenames here if a particular file gets mangled by thresholding
  "amos-amos-background.webp",
]);

const NEAR_WHITE = 240; // 0-255. lower = more aggressive removal
const FEATHER = 18;     // alpha rampdown range above NEAR_WHITE-FEATHER

function isNearWhite(r, g, b) {
  return r >= NEAR_WHITE && g >= NEAR_WHITE && b >= NEAR_WHITE;
}

function cornerSamples(buffer, info) {
  const { width, height, channels } = info;
  const at = (x, y) => {
    const idx = (y * width + x) * channels;
    return [buffer[idx], buffer[idx + 1], buffer[idx + 2]];
  };
  return [
    at(0, 0),
    at(width - 1, 0),
    at(0, height - 1),
    at(width - 1, height - 1),
  ];
}

function shouldStrip(corners) {
  // All four corners must be near-white for us to assume a flat white bg.
  return corners.every(([r, g, b]) => isNearWhite(r, g, b));
}

async function stripFile(file) {
  const base = parse(file).base;
  if (KEEP_BG.has(base)) return { skipped: "keep-bg" };

  const img = sharp(file).ensureAlpha();
  const meta = await img.metadata();
  if (!meta.width || !meta.height) return { skipped: "no-meta" };

  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.channels < 3) return { skipped: "not-rgb" };

  const corners = cornerSamples(data, info);
  if (!shouldStrip(corners)) return { skipped: "non-uniform-corners" };

  // Walk the raw buffer and rewrite alpha based on each pixel's brightness.
  const px = info.width * info.height;
  for (let i = 0; i < px; i += 1) {
    const o = i * info.channels;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const minRGB = Math.min(r, g, b);
    if (minRGB >= NEAR_WHITE) {
      data[o + 3] = 0;
    } else if (minRGB >= NEAR_WHITE - FEATHER) {
      // Linear ramp from full-alpha at (NEAR_WHITE - FEATHER) → 0 at NEAR_WHITE
      const t = (NEAR_WHITE - minRGB) / FEATHER;
      data[o + 3] = Math.round(255 * t);
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(file);

  return { stripped: true, width: info.width, height: info.height };
}

let touched = 0;
let kept = 0;
for (const dir of TARGETS) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    if (!/\.(webp|png)$/i.test(ent.name)) continue;
    const full = join(dir, ent.name);
    try {
      const res = await stripFile(full);
      if (res.stripped) {
        touched += 1;
        console.log(`  ✂︎ ${full.replace(root + "/", "")}`);
      } else {
        kept += 1;
      }
    } catch (err) {
      console.warn(`  ✗ ${full.replace(root + "/", "")} — ${err.message}`);
    }
  }
}

console.log(`\n✓ stripped ${touched}  ·  left ${kept} untouched`);
