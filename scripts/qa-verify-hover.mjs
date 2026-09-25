import { chromium } from "playwright";

const url = process.env.QA_URL ?? "http://localhost:3199/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(800);

const sample = async (sel, label) => {
  const el = await page.$(sel);
  if (!el) return console.log(`${label}: NOT FOUND`);
  await el.hover();
  const vals = [];
  for (let i = 0; i < 6; i++) {
    vals.push(
      await page.evaluate((s) => {
        const e = document.querySelector(s);
        if (!e) return "?";
        const cs = getComputedStyle(e);
        return `${cs.translate || cs.transform}|op=${cs.opacity}`;
      }, sel),
    );
    await page.waitForTimeout(120);
  }
  console.log(`${label}: ${vals.join("  ->  ")}`);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(400);
};

// hero CTA label (slides up on hover)
await sample('a[href*="#contact"] p, a.group p, a.group span', "hero-cta-label");
// find services card image (scale-110)
const cards = await page.$$('.group');
console.log(`group elements: ${cards.length}`);

// direct: check faq/accordion icon rotate on click? skip; use services arrow
await page.evaluate(() => window.scrollTo({ top: 3200, behavior: "instant" }));
await page.waitForTimeout(600);
const arrow = await page.$('div.group:hover, .group');
await sample('.group .group-hover\\:translate-y-\\[80px\\]', "services-arrow");
await sample('.group-hover\\:scale-110', "services-image");
await sample('.group-hover\\:translate-x-\\[36px\\]', "gallery-slide");
await browser.close();
