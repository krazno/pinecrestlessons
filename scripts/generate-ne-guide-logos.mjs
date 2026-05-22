/**
 * Generates landscape (pill) and square wordmark PNGs for sister NE guide brands.
 * Run: node scripts/generate-ne-guide-logos.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(
  path.resolve(__dirname, "../../new-england-farm-guide/package.json"),
);
const sharp = require("sharp");
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, "brand-assets", "ne-guide-logos");

const FARM_ICON = path.resolve(
  REPO_ROOT,
  "../new-england-farm-guide/public/images/branding/new-england-farm-guide-icon-red-white.png",
);
const SWIM_ICON = path.resolve(
  REPO_ROOT,
  "../new-england-swimming-holes/public/media/site/nav-icons/new-england-swimming-holes-home-pin-water-mark.png",
);

/** @type {const} */
const BRANDS = {
  farm: {
    slug: "new-england-farm-guide",
    line1: "New England",
    line2: "Farm Guide",
    iconPath: FARM_ICON,
    iconTile: "#B35C44",
    textBg: "#1E4E5F",
    iconCropRatio: 0.1,
  },
  swim: {
    slug: "new-england-swimming-holes",
    line1: "New England",
    line2: "Swimming Holes",
    iconPath: SWIM_ICON,
    iconTile: "#8EB4D4",
    textBg: "#183B56",
    iconCropRatio: 0,
  },
};

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function landscapeSvg({ line1, line2, iconTile, textBg, width, height }) {
  const r = height / 2;
  const iconSize = height;
  const padX = Math.round(height * 0.22);
  const line1Size = Math.round(height * 0.31);
  const line2Size = Math.round(height * 0.27);
  const line1Y = Math.round(height * 0.43);
  const line2Y = Math.round(height * 0.74);
  const textX = iconSize + padX;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <clipPath id="pill">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${r}" ry="${r}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#pill)">
    <rect x="0" y="0" width="${iconSize}" height="${height}" fill="${iconTile}"/>
    <rect x="${iconSize}" y="0" width="${width - iconSize}" height="${height}" fill="${textBg}"/>
    <text x="${textX}" y="${line1Y}" fill="#FFFFFF" font-family="Georgia, 'Times New Roman', serif" font-size="${line1Size}" font-weight="600" letter-spacing="-0.02em">${escapeXml(line1)}</text>
    <text x="${textX}" y="${line2Y}" fill="#FFFFFF" font-family="Georgia, 'Times New Roman', serif" font-size="${line2Size}" font-weight="600" letter-spacing="-0.02em">${escapeXml(line2)}</text>
  </g>
</svg>`;
}

function squareSvg({ line1, line2, iconTile, textBg, size }) {
  const iconZone = Math.round(size * 0.56);
  const pad = Math.round(size * 0.1);
  const line1Size = Math.round(size * 0.11);
  const line2Size = Math.round(size * 0.095);
  const line1Y = iconZone + Math.round(size * 0.17);
  const line2Y = iconZone + Math.round(size * 0.29);
  const cx = size / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.14)}" fill="${textBg}"/>
  <rect x="0" y="0" width="${size}" height="${iconZone}" fill="${iconTile}"/>
  <text x="${cx}" y="${line1Y}" text-anchor="middle" fill="#FFFFFF" font-family="Georgia, 'Times New Roman', serif" font-size="${line1Size}" font-weight="600" letter-spacing="-0.02em">${escapeXml(line1)}</text>
  <text x="${cx}" y="${line2Y}" text-anchor="middle" fill="#FFFFFF" font-family="Georgia, 'Times New Roman', serif" font-size="${line2Size}" font-weight="600" letter-spacing="-0.02em">${escapeXml(line2)}</text>
</svg>`;
}

async function iconBuffer(iconPath, box, cropRatio = 0) {
  const inset = Math.round(box * 0.18);
  const inner = box - inset * 2;
  let pipeline = sharp(iconPath);
  if (cropRatio > 0) {
    const meta = await pipeline.metadata();
    const crop = Math.round(Math.min(meta.width, meta.height) * cropRatio);
    pipeline = sharp(iconPath).extract({
      left: crop,
      top: crop,
      width: meta.width - crop * 2,
      height: meta.height - crop * 2,
    });
  }
  return pipeline
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: inset,
      bottom: inset,
      left: inset,
      right: inset,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function renderLandscape(brand, scale) {
  const height = 52 * scale;
  const width = Math.round(height * (320 / 52));
  const baseSvg = landscapeSvg({
    line1: brand.line1,
    line2: brand.line2,
    iconTile: brand.iconTile,
    textBg: brand.textBg,
    width,
    height,
  });
  const base = await sharp(Buffer.from(baseSvg)).png().toBuffer();
  const icon = await iconBuffer(brand.iconPath, height, brand.iconCropRatio ?? 0);
  const out = path.join(OUT_DIR, `${brand.slug}-landscape@${scale}x.png`);
  await sharp(base)
    .composite([{ input: icon, left: 0, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  return out;
}

async function renderSquare(brand, size) {
  const baseSvg = squareSvg({
    line1: brand.line1,
    line2: brand.line2,
    iconTile: brand.iconTile,
    textBg: brand.textBg,
    size,
  });
  const base = await sharp(Buffer.from(baseSvg)).png().toBuffer();
  const iconZone = Math.round(size * 0.56);
  const icon = await iconBuffer(brand.iconPath, iconZone, brand.iconCropRatio ?? 0);
  const out = path.join(OUT_DIR, `${brand.slug}-square-${size}.png`);
  await sharp(base)
    .composite([{ input: icon, left: 0, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  return out;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const written = [];
  for (const brand of Object.values(BRANDS)) {
    written.push(await renderLandscape(brand, 1));
    written.push(await renderLandscape(brand, 2));
    written.push(await renderLandscape(brand, 3));
    written.push(await renderSquare(brand, 512));
    written.push(await renderSquare(brand, 1024));
  }

  // Default filenames (2x landscape + 512 square) for drop-in use
  const aliases = [
    ["new-england-farm-guide-landscape@2x.png", "new-england-farm-guide-landscape.png"],
    ["new-england-farm-guide-square-512.png", "new-england-farm-guide-square.png"],
    ["new-england-swimming-holes-landscape@2x.png", "new-england-swimming-holes-landscape.png"],
    ["new-england-swimming-holes-square-512.png", "new-england-swimming-holes-square.png"],
  ];
  for (const [from, to] of aliases) {
    await fs.copyFile(path.join(OUT_DIR, from), path.join(OUT_DIR, to));
    written.push(path.join(OUT_DIR, to));
  }

  console.log("Wrote logos to:", OUT_DIR);
  for (const file of [...new Set(written)].sort()) {
    const stat = await fs.stat(file);
    const img = sharp(file);
    const meta = await img.metadata();
    console.log(`  ${path.basename(file)}  ${meta.width}x${meta.height}  ${Math.round(stat.size / 1024)}kb`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
