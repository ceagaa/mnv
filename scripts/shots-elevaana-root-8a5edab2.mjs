import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = "https://elevaana.webflow.io/";
const SHOTS = path.resolve("docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2");
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(2000);

// reveal everything by scrolling slowly
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 400) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(150);
}
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo(0, 0));
 await page.waitForTimeout(800);

const names = [
  "header", "hero-section", "service-section", "metrics-section",
  "how-we-work-section", "our-gallery-section", "testimonial-section",
  "our-expertise-section", "faq-section", "cta-section", "top-label", "footer",
];

const sections = await page.evaluate(() => {
  const root = document.querySelector("section.sections");
  return [...root.children].map((el, i) => ({
    i,
    cls: el.className,
    tag: el.tagName.toLowerCase(),
  }));
});

for (const s of sections) {
  const handle = await page.evaluateHandle((i) => document.querySelector("section.sections").children[i], s.i);
  const el = handle.asElement();
  if (!el) continue;
  try {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const idx = String(s.i + 1).padStart(2, "0");
    const slug = String(s.cls).trim().split(/\s+/)[0] || "section";
    await el.screenshot({ path: path.join(SHOTS, `section-${idx}-${slug}.png`) });
    console.log("shot", idx, slug);
  } catch (e) {
    console.log("fail", s.cls, e.message);
  }
}

// mobile shots of same sections
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(1200);
for (const s of sections) {
  const handle = await page.evaluateHandle((i) => document.querySelector("section.sections").children[i], s.i);
  const el = handle.asElement();
  if (!el) continue;
  try {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const idx = String(s.i + 1).padStart(2, "0");
    const slug = String(s.cls).trim().split(/\s+/)[0] || "section";
    await el.screenshot({ path: path.join(SHOTS, `mobile-section-${idx}-${slug}.png`) });
  } catch (e) {
    console.log("mfail", s.cls, e.message);
  }
}
console.log("SECTION SHOTS DONE");
await browser.close();
