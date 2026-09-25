import { chromium } from "playwright";
import sharp from "sharp";

const url = process.env.QA_URL ?? "http://localhost:3199/";
const tag = process.env.QA_TAG ?? "clone";

const browser = await chromium.launch({ headless: true });

const rowsOf = async (path) => {
  const { data, info } = await sharp(path).greyscale().raw().toBuffer({ resolveWithObject: true });
  let out = "";
  for (let y = 0; y < info.height; y++) {
    let s = 0;
    for (let x = 0; x < info.width; x++) s += 255 - data[y * info.width + x];
    const v = s / info.width;
    if (v > 40) out += `${y}:${v.toFixed(0)} `;
  }
  return out;
};

const shot = async (page, path) => {
  await page.screenshot({ path, clip: { x: 680, y: 76, width: 610, height: 180 } });
  return rowsOf(path);
};

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
for (let i = 0; i < 5; i++) {
  await page.evaluate(() => window.scrollTo({ top: 7200, behavior: "instant" }));
  await page.waitForTimeout(700);
  if ((await page.evaluate(() => window.scrollY)) === 7200) break;
}
await page.waitForTimeout(2500);

const apply = {
  base: () => {},
  noTransform: () => {
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
    h2.style.setProperty("transform", "none", "important");
  },
  translateZ: () => {
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
    h2.style.setProperty("transform", "translateZ(0)", "important");
  },
  noOverflow: () => {
    document.querySelectorAll(".sections").forEach((el) => (el.style.overflowX = "visible"));
    document.documentElement.style.overflowX = "visible";
    document.body.style.overflowX = "visible";
  },
  subpixel: () => {
    document.documentElement.style.setProperty("-webkit-font-smoothing", "subpixel-antialiased");
    document.body.style.setProperty("-webkit-font-smoothing", "subpixel-antialiased");
  },
  noSmooth: () => {
    document.documentElement.style.setProperty("-webkit-font-smoothing", "antialiased");
    document.body.style.setProperty("-webkit-font-smoothing", "antialiased");
  },
  geometric: () => {
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
    h2.style.setProperty("text-rendering", "geometricPrecision", "important");
  },
};

for (const [name, fn] of Object.entries(apply)) {
  await page.evaluate(fn);
  await page.waitForTimeout(250);
  const r = await shot(page, `docs/design-references/comparison/exp-${tag}-${name}.png`);
  const line2 = r.split(" ").filter((s) => {
    const y = parseInt(s.split(":")[0]);
    return y >= 70 && y <= 120;
  });
  console.log(`${name}: ${line2.join(" ")}`);
  await page.evaluate(() => {
    document.querySelectorAll(".sections").forEach((el) => (el.style.overflowX = ""));
    document.documentElement.style.removeProperty("overflow-x");
    document.body.style.removeProperty("overflow-x");
    document.documentElement.style.removeProperty("-webkit-font-smoothing");
    document.body.style.removeProperty("-webkit-font-smoothing");
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
    h2.style.removeProperty("transform");
    h2.style.removeProperty("text-rendering");
  });
  await page.waitForTimeout(150);
}
await browser.close();
