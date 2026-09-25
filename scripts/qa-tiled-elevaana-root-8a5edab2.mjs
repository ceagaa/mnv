import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

// Tiled full-page capture: scroll to each tile, wait for reveals, capture viewport, stitch.
// Usage: node scripts/qa-tiled-elevaana-root-8a5edab2.mjs <url> <out.png> <hideWidget:0|1> [marquee:log|<px>]
// Env: QA_W (default 1440), QA_H (default 900), QA_VIDEO_T (freeze video currentTime)

const [url, out, hideWidget = "0", marquee = ""] = process.argv.slice(2);
const W = Number(process.env.QA_W ?? 1440);
const VH = Number(process.env.QA_H ?? 900);
const VIDEO_T = process.env.QA_VIDEO_T ?? "";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: W, height: VH } });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(2000);

// Guard: make sure we are looking at the Elevana site, not some other app on this port
const marker = await page.evaluate(() => document.body.innerText.includes("Our Renovation Services"));
if (!marker) {
  const title = await page.title();
  console.error(`WRONG CONTENT at ${url} (title="${title}") — expected Elevana marker. Aborting.`);
  await browser.close();
  process.exit(1);
}

if (hideWidget === "1") {
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const t = el.textContent || "";
      if (
        (t.includes("Unlock 100+ Templates") || t.includes("Get This Template") || t.includes("Access 4200+ Components")) &&
        el.children.length <= 6
      ) {
        let node = el;
        while (
          node.parentElement &&
          node.parentElement.children.length <= 3 &&
          ["Unlock 100+ Templates", "Get This Template", "Access 4200+ Components"].some((n) =>
            (node.parentElement.textContent || "").includes(n),
          )
        ) {
          node = node.parentElement;
        }
        node.style.setProperty("display", "none", "important");
        return;
      }
    }
  });
}

const dir = path.dirname(out);
const base = path.basename(out);

// Warm-up: scroll through the page once so lazy content loads, then wait for
// scrollHeight to stabilize (the live site grows 9556 -> 9808 while loading).
for (const sy of [Math.floor((await page.evaluate(() => document.documentElement.scrollHeight)) / 2), 999999, 0]) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), sy);
  await page.waitForTimeout(600);
}
let stableH = 0;
let lastH0 = 0;
for (let i = 0; i < 30; i++) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  if (h === lastH0) stableH++;
  else stableH = 0;
  lastH0 = h;
  if (stableH >= 3) break;
  await page.waitForTimeout(1000);
}
console.log("stabilized pageH", lastH0);

const tiles = [];
let y = 0;
let guard = 0;
let lastH = 0;
let stable = 0;

const MARQUEE_SEL =
  ".elevaana-top-label-marquee, [class*='top-label-text-block']";
async function applyMarquee() {
  if (!marquee || marquee === "log") return;
  await page.evaluate(
    ({ sel, px }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.setProperty("animation", "none", "important");
      el.style.setProperty("transform", `translateX(${px}px)`, "important");
    },
    { sel: MARQUEE_SEL, px: marquee },
  );
}
async function applyVideo() {
  if (!VIDEO_T) return;
  await page.evaluate((t) => {
    for (const v of document.querySelectorAll("video")) {
      try {
        v.pause();
        if (Math.abs(v.currentTime - Number(t)) > 0.01) v.currentTime = Number(t);
      } catch {
        /* ignore */
      }
    }
  }, VIDEO_T);
}
async function logMarquee() {
  if (marquee !== "log") return "";
  const t = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).transform : "none";
  }, MARQUEE_SEL);
  return " marquee=" + t;
}

while (guard++ < 80) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
  await applyVideo();
  await page.waitForTimeout(2600);
  await applyMarquee();
  await applyVideo();
  const state = await page.evaluate(() => ({
    scrollY: Math.round(window.scrollY),
    fullH: document.documentElement.scrollHeight,
  }));
  const mlog = await logMarquee();
  const file = path.join(dir, `.tile-${base}-${y}.png`);
  await page.screenshot({ path: file });
  tiles.push({ y: state.scrollY, file });
  console.log("tile at scrollY", state.scrollY, "pageH", state.fullH + mlog);
  if (state.fullH === lastH) stable++;
  else stable = 0;
  lastH = state.fullH;
  if (state.scrollY >= state.fullH - VH && stable >= 1) break;
  y = state.scrollY + VH;
}
const fullH = lastH;

await browser.close();

// Crop each tile to the non-overlapping region below the previous tile, then stitch
const composites = [];
let covered = 0;
for (const t of tiles) {
  const buf = fs.readFileSync(t.file);
  const meta = await sharp(buf).metadata();
  const cropTop = Math.max(0, covered - t.y); // already-covered part of this tile
  const height = Math.min(meta.height - cropTop, fullH - (t.y + cropTop));
  if (height <= 0) {
    fs.unlinkSync(t.file);
    continue;
  }
  const cropped = await sharp(buf)
    .extract({ left: 0, top: cropTop, width: Math.min(W, meta.width), height })
    .toBuffer();
  const cfile = `${t.file}.c.png`;
  fs.writeFileSync(cfile, cropped);
  composites.push({ input: cfile, top: t.y + cropTop, left: 0 });
  covered = t.y + cropTop + height;
  fs.unlinkSync(t.file);
}

await sharp({ create: { width: W, height: fullH, channels: 3, background: { r: 255, g: 255, b: 255 } } })
  .composite(composites)
  .png()
  .toFile(out);
for (const c of composites) fs.unlinkSync(c.input);
console.log("saved", out, "covered", covered, "/", fullH);
