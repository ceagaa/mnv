import { chromium } from "playwright";

const base = process.env.QA_URL ?? "https://elevaana.webflow.io/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle", timeout: 90000 });
await page.evaluate(() => window.scrollTo({ top: 8908, behavior: "instant" }));
await page.waitForTimeout(1500);
const out = await page.evaluate(() => {
  const texts = [];
  for (const el of document.querySelectorAll("h2, p, a")) {
    const r = el.getBoundingClientRect();
    const y = r.y + window.scrollY;
    if (y > 8750 && y < 9100) {
      texts.push({ tag: el.tagName, y: +y.toFixed(1), t: JSON.stringify(el.textContent.trim()) });
    }
  }
  return texts;
});
console.log(base);
console.log(JSON.stringify(out, null, 1));
await browser.close();
