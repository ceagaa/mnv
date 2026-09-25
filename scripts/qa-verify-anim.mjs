import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";

const base = process.env.QA_URL ?? "https://elevaana.webflow.io/";
const tag = process.env.QA_TAG ?? "side";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle", timeout: 90000 });

// --- 1. reveal animation check: scroll to CTA, sample h2 transform over time
await page.evaluate(() => window.scrollTo({ top: 7600, behavior: "instant" }));
await page.waitForTimeout(400);
await page.evaluate(() => window.scrollTo({ top: 8100, behavior: "instant" }));
const samples = [];
for (let i = 0; i < 14; i++) {
  samples.push(
    await page.evaluate(() => {
      const h2 = [...document.querySelectorAll("h2")].find((h) =>
        (h.textContent || "").includes("Renovation You Can Trust"),
      );
      if (!h2) return "?";
      const cs = getComputedStyle(h2);
      return `${cs.transform}|${cs.opacity}`;
    }),
  );
  await page.waitForTimeout(150);
}
console.log("CTA reveal samples:");
samples.forEach((s, i) => console.log(`  t+${i * 150}ms ${s}`));

// --- 2. hero load-reveal check (fresh nav)
await page.goto(base, { waitUntil: "domcontentloaded", timeout: 90000 });
const hero = [];
for (let i = 0; i < 10; i++) {
  hero.push(
    await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      if (!h1) return "?";
      const cs = getComputedStyle(h1);
      return `tf=${cs.transform}|op=${cs.opacity}|cls=${h1.className.slice(0, 120)}`;
    }),
  );
  await page.waitForTimeout(120);
}
console.log("hero reveal samples:");
hero.forEach((s, i) => console.log(`  t+${i * 120}ms ${s}`));

// --- 3. expertise h2 element screenshot (settled, viewport-relative clip)
await page.evaluate(() => window.scrollTo({ top: 7200, behavior: "instant" }));
await page.waitForTimeout(3000);
const clip = { x: 680, y: 7276 - 7200, width: 610, height: 180 };
await page.screenshot({ path: `docs/design-references/comparison/h2-${tag}.png`, clip });
await browser.close();

// row profile of the shot
const { data, info } = await sharp(
  `docs/design-references/comparison/h2-${tag}.png`,
)
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
let out = `${tag} rows: `;
for (let y = 0; y < info.height; y++) {
  let s = 0;
  for (let x = 0; x < info.width; x++) s += 255 - data[y * info.width + x];
  const v = s / info.width;
  if (v > 5) out += `${y}:${v.toFixed(0)} `;
}
console.log(out);
