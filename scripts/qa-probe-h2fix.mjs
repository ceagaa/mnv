import { chromium } from "playwright";
import sharp from "sharp";

const mode = process.env.QA_MODE ?? "none";
const url = process.env.QA_URL ?? "https://elevaana.webflow.io/";
const tag = process.env.QA_TAG ?? "x";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
for (let i = 0; i < 5; i++) {
  await page.evaluate(() => window.scrollTo({ top: 7200, behavior: "instant" }));
  await page.waitForTimeout(700);
  const sy = await page.evaluate(() => window.scrollY);
  if (sy === 7200) break;
}
console.log(`${tag} scrollY=${await page.evaluate(() => window.scrollY)} pageH=${await page.evaluate(() => document.documentElement.scrollHeight)}`);
await page.waitForTimeout(2500);
if (mode !== "none") {
  await page.evaluate((m) => {
    const h2 = [...document.querySelectorAll("h2")].find((h) =>
      (h.textContent || "").includes("every detail"),
    );
    if (m === "geom") h2.style.textRendering = "geometricPrecision";
    if (m === "optimize") h2.style.textRendering = "optimizeLegibility";
    if (m === "nudge") h2.style.marginTop = "0.03125px";
    if (m === "nudgeneg") h2.style.marginTop = "-0.03125px";
  }, mode);
  await page.waitForTimeout(300);
}
const clip = { x: 680, y: 7276 - 7200, width: 610, height: 180 };
const path = `docs/design-references/comparison/h2-${tag}.png`;
await page.screenshot({ path, clip });
await browser.close();

const { data, info } = await sharp(path).greyscale().raw().toBuffer({ resolveWithObject: true });
let out = `${tag}(${mode}) line rows: `;
for (let y = 0; y < info.height; y++) {
  let s = 0;
  for (let x = 0; x < info.width; x++) s += 255 - data[y * info.width + x];
  const v = s / info.width;
  if (v > 40) out += `${y}:${v.toFixed(0)} `;
}
console.log(out);
