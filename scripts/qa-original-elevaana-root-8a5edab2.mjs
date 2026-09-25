import { chromium } from "playwright";
import path from "node:path";

const URL = "https://elevaana.webflow.io/";
const OUT = path.resolve("docs/design-references/comparison");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(2000);

// Reveal everything by scrolling slowly
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 400) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(150);
}
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);

// Hide the Webflow promo widget + any fixed overlays that are not part of the design
const hidden = await page.evaluate(() => {
  const needles = ["Unlock 100+ Templates", "Get This Template", "Access 4200+ Components"];
  const killed = [];
  for (const el of document.querySelectorAll("body *")) {
    const t = el.textContent || "";
    if (needles.some((n) => t.includes(n)) && el.children.length <= 6) {
      // climb to the widget root (parent whose text is only the widget)
      let node = el;
      while (node.parentElement && needles.some((n) => (node.parentElement.textContent || "").includes(n)) && node.parentElement.children.length <= 3) {
        node = node.parentElement;
      }
      node.style.setProperty("display", "none", "important");
      killed.push(node.tagName + "." + (node.className || "").toString().slice(0, 40));
      break;
    }
  }
  // hide any remaining fixed/sticky overlays except the header (which is not sticky here)
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if ((cs.position === "fixed" || cs.position === "sticky") && cs.display !== "none") {
      el.style.setProperty("display", "none", "important");
      killed.push("fixed:" + el.tagName + "." + (el.className || "").toString().slice(0, 40));
    }
  }
  return killed;
});
console.log("hidden overlays:", JSON.stringify(hidden, null, 1));

// Section rects for alignment checks
const rects = await page.evaluate(() => {
  const root = document.querySelector("section.sections");
  return [...root.children].map((el, i) => {
    const r = el.getBoundingClientRect();
    return { i: i + 1, cls: (el.className || el.tagName).toString().slice(0, 50), top: Math.round(r.top + scrollY), h: Math.round(r.height) };
  });
});
console.log("ORIG RECTS " + JSON.stringify(rects));

await page.waitForTimeout(300);
await page.screenshot({ path: path.join(OUT, "orig-desktop-1440.png"), fullPage: true });
console.log("saved orig-desktop-1440.png");

await browser.close();
