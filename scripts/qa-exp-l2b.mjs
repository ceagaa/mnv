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
  return out.split(" ").filter((s) => {
    const y = parseInt(s.split(":")[0]);
    return y >= 70 && y <= 120;
  }).join(" ");
};

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
for (let i = 0; i < 5; i++) {
  await page.evaluate(() => window.scrollTo({ top: 7200, behavior: "instant" }));
  await page.waitForTimeout(700);
  if ((await page.evaluate(() => window.scrollY)) === 7200) break;
}
await page.waitForTimeout(2500);

const sel = "h2";
const apply = {
  base: () => {},
  inlineMatrix: () => {
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
    h2.style.setProperty("transform", "matrix(1, 0, 0, 1, 0, 0)");
  },
  inlineMatrix_noTransition: () => {
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
    h2.style.setProperty("transition", "none", "important");
    h2.style.setProperty("transform", "matrix(1, 0, 0, 1, 0, 0)");
  },
  none_noTransition: () => {
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
    h2.style.setProperty("transition", "none", "important");
    h2.style.setProperty("transform", "none", "important");
  },
  restore: () => {},
  origPlusTransition: () => {
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
    h2.style.setProperty("transition", "transform 1000ms cubic-bezier(0, 0, 0.2, 1)", "important");
  },
  origForceClassTransform: () => {
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
    h2.style.setProperty("transform", "translateZ(0)", "important");
    h2.style.setProperty("transition", "transform 1000ms cubic-bezier(0, 0, 0.2, 1)", "important");
  },
};

const reset = () => {
  const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.includes("every detail"));
  h2.style.removeProperty("transform");
  h2.style.removeProperty("transition");
};

for (const [name, fn] of Object.entries(apply)) {
  if (name !== "restore") await page.evaluate(fn);
  await page.waitForTimeout(250);
  const path = `docs/design-references/comparison/fx-${tag}-${name}.png`;
  await page.screenshot({ path, clip: { x: 680, y: 76, width: 610, height: 180 } });
  const r = await rowsOf(path);
  const line2start = r.split(" ").map((s) => parseInt(s.split(":")[0]))[0];
  console.log(`${name}: starts=${line2start} ${r}`);
  if (name !== "restore") await page.evaluate(reset);
  await page.waitForTimeout(150);
}
await browser.close();
