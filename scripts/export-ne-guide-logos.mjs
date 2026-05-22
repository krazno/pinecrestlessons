/**
 * One crisp icon logo per sister site — no composited wordmarks.
 * Farm: canonical 1024px mark from the farm-guide repo.
 * Swim: pure SVG → PNG (vector, not upscaled raster).
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

const OUT_DIR = path.join(__dirname, "../brand-assets/ne-guide-logos");
const FARM_SRC = path.resolve(
  __dirname,
  "../../new-england-farm-guide/public/images/branding/new-england-farm-guide-icon-red-white.png",
);

const SIZE = 1024;

/** Pin + water — matches nav mark proportions (96×96 artboard). */
const SWIM_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="17.28" fill="#8EB4D4"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M48 19.5c-9.4 0-17 7.6-17 17 0 12.1 17 33.5 17 33.5s17-21.4 17-33.5c0-9.4-7.6-17-17-17z"/>
    <circle cx="48" cy="34.5" r="5.8"/>
    <path d="M27.5 66.5c5.2-3.2 10.5-3.2 20.5 0s15.3 3.2 20.5 0"/>
    <path d="M23.5 72.5c5.2-3.2 10.5-3.2 20.5 0s15.3 3.2 20.5 0"/>
    <path d="M19.5 78.5c5.2-3.2 10.5-3.2 20.5 0s15.3 3.2 20.5 0"/>
  </g>
</svg>`;

async function cleanOutputDir() {
  const entries = await fs.readdir(OUT_DIR).catch(() => []);
  for (const name of entries) {
    if (name.endsWith(".png") || name === "README.md") {
      await fs.unlink(path.join(OUT_DIR, name));
    }
  }
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await cleanOutputDir();

  const farmOut = path.join(OUT_DIR, "new-england-farm-guide-logo.png");
  await fs.copyFile(FARM_SRC, farmOut);

  const swimOut = path.join(OUT_DIR, "new-england-swimming-holes-logo.png");
  await sharp(Buffer.from(SWIM_SVG))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(swimOut);

  await fs.writeFile(
    path.join(OUT_DIR, "README.md"),
    `# NE guide logos (icon only)

- \`new-england-farm-guide-logo.png\` — canonical 1024×1024 barn mark from the farm-guide repo
- \`new-england-swimming-holes-logo.png\` — 1024×1024 vector pin-on-water mark (light blue tile)

Regenerate: \`node scripts/export-ne-guide-logos.mjs\`
`,
  );

  for (const file of [farmOut, swimOut]) {
    const meta = await sharp(file).metadata();
    const stat = await fs.stat(file);
    console.log(`${path.basename(file)}  ${meta.width}×${meta.height}  ${Math.round(stat.size / 1024)}kb`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
