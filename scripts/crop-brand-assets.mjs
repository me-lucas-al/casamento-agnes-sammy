import { createRequire } from "node:module";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pnpmStore = join(root, "node_modules", ".pnpm");
const sharpFolder = readdirSync(pnpmStore).find((name) => name.startsWith("sharp@"));
const sharp = createRequire(import.meta.url)(join(pnpmStore, sharpFolder, "node_modules", "sharp"));

const SOURCE = join(root, ".scratch", "invite.png");
const OUTPUT = join(root, "public", "brand");
const ROSE = [209, 77, 128];

const FLOWER_REGIONS = {
  "flowers-top-left": { left: 0, top: 0, width: 235, height: 300 },
  "flowers-top-right": { left: 665, top: 0, width: 235, height: 310 },
  "flowers-bottom-left": { left: 0, top: 1428, width: 122, height: 112 },
  "flowers-bottom-right": { left: 755, top: 1408, width: 145, height: 132 },
};

function saturationOf(red, green, blue) {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  return max === 0 ? 0 : (max - min) / max;
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

async function extractRaw(region) {
  const { data, info } = await sharp(SOURCE)
    .extract(region)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

async function writePng(raw, fileName) {
  await sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(join(OUTPUT, `${fileName}.png`));
}

function keyBySaturation(raw, { low, high, tint }) {
  for (let offset = 0; offset < raw.data.length; offset += 4) {
    const [red, green, blue] = [raw.data[offset], raw.data[offset + 1], raw.data[offset + 2]];
    const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
    const darkPenalty = tint ? clamp01((luminance - 60) / 40) : 1;
    const alpha = clamp01((saturationOf(red, green, blue) - low) / (high - low)) * darkPenalty;
    if (tint) [raw.data[offset], raw.data[offset + 1], raw.data[offset + 2]] = tint;
    raw.data[offset + 3] = Math.round(alpha * 255);
  }
  return raw;
}

function clearBand(raw, { fromY, toY, keepFromX, keepToX }) {
  for (let y = fromY; y < toY; y += 1) {
    for (let x = 0; x < raw.width; x += 1) {
      if (x >= keepFromX && x < keepToX) continue;
      raw.data[(y * raw.width + x) * 4 + 3] = 0;
    }
  }
  return raw;
}

async function buildMonogram() {
  const region = { left: 372, top: 272, width: 168, height: 300 };
  const keyed = keyBySaturation(await extractRaw(region), { low: 0.2, high: 0.4, tint: ROSE });
  const cleaned = clearBand(keyed, { fromY: 112, toY: 182, keepFromX: 12, keepToX: 136 });
  await writePng(cleaned, "monogram");
}

async function buildSaveTheDate() {
  const region = { left: 70, top: 805, width: 290, height: 350 };
  const keyed = keyBySaturation(await extractRaw(region), { low: 0.2, high: 0.4, tint: ROSE });
  await writePng(keyed, "save-the-date");
}

async function buildFlowers() {
  for (const [fileName, region] of Object.entries(FLOWER_REGIONS)) {
    const keyed = keyBySaturation(await extractRaw(region), { low: 0.12, high: 0.26 });
    await writePng(keyed, fileName);
  }
}

async function buildPaperStrip() {
  const width = 1400;
  const height = 360;
  let edge = `M0 0 L${width} 0 L${width} 250`;
  for (let x = width; x >= 0; x -= 28) {
    const wobble = 250 + Math.sin(x / 55) * 14 + Math.sin(x / 13) * 6 + ((x * 7919) % 11);
    edge += ` L${x} ${wobble.toFixed(1)}`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path d="${edge} Z" fill="#E6DCD0"/></svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(join(OUTPUT, "paper-strip.png"));
}

await buildMonogram();
await buildSaveTheDate();
await buildFlowers();
await buildPaperStrip();
