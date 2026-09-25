import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const p = await browser.newPage({ viewport: { width: 375, height: 812 } });
await p.goto("http://localhost:3199/", { waitUntil: "networkidle", timeout: 90000 });
await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const out = {};
  const cta = [...document.querySelectorAll("h2")].find(h => h.textContent.includes("Renovation You Can Trust"));
  if (cta) {
    out.ctaHtml = cta.outerHTML.slice(0, 1500);
    out.ctaStyle = (({ transform, opacity, transition, overflow }) => ({ transform, opacity, transition, overflow }))(getComputedStyle(cta));
    out.ctaRect = JSON.stringify(cta.getBoundingClientRect());
  }
  const card = document.querySelector(".group.relative.w-full.overflow-hidden");
  if (card) {
    out.cardHtml = card.outerHTML.slice(0, 2500);
    const t = card.querySelector("h3, h4, p, [class*=title]");
    if (t) { out.tTitle = t.textContent; out.tRect = JSON.stringify(t.getBoundingClientRect()); out.tFont = getComputedStyle(t).fontSize + "/" + getComputedStyle(t).lineHeight; }
  }
  return out;
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
