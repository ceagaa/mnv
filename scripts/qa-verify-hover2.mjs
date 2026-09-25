import { chromium } from "playwright";

const url = process.env.QA_URL ?? "http://localhost:3199/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });

const check = async (label, selector, scrollTo) => {
  if (scrollTo) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), scrollTo);
    await page.waitForTimeout(700);
  }
  const box = await page.evaluate((s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const g = e.closest(".group") || e;
    const r = g.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, selector);
  if (!box) return console.log(`${label}: sel not found`);
  await page.mouse.move(box.x, box.y);
  const vals = [];
  for (let i = 0; i < 5; i++) {
    vals.push(
      await page.evaluate((s) => {
        const e = document.querySelector(s);
        if (!e) return "?";
        const cs = getComputedStyle(e);
        return `${cs.translate}/${cs.scale}`;
      }, selector),
    );
    await page.waitForTimeout(130);
  }
  console.log(`${label}: ${vals.join(" -> ")}`);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(400);
};

await check("services-arrow", '[class*="group-hover:translate-y-"]', 3200);
await check("services-image", '[class*="group-hover:scale-110"]', 3200);
await check("gallery-slide", '[class*="group-hover:translate-x-"]', 5000);
await check("cta-label", '[class*="group-hover:-translate-y-"]', 8300);
await browser.close();
