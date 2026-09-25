import { chromium } from "playwright";

const base = process.env.QA_URL ?? "http://localhost:3001/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 250));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("section, header, footer")) {
    const r = el.getBoundingClientRect();
    out.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 34),
      top: +(r.top + scrollY).toFixed(3),
      h: +r.height.toFixed(3),
    });
  }
  out.push({ tag: "body", cls: "", top: 0, h: +document.body.getBoundingClientRect().height.toFixed(3) });
  return out;
});
console.log(JSON.stringify(info));
await browser.close();
