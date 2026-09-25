import { chromium } from "playwright";

const base = process.env.QA_URL ?? "http://localhost:3001/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 250));
  }
});
// park at CTA to let reveals finish
await page.evaluate(() => window.scrollTo({ top: 8400, behavior: "instant" }));
await page.waitForTimeout(2000);

const info = await page.evaluate(() => {
  const out = {};
  // CTA subtext: find p with "smooth from start"
  const sub = [...document.querySelectorAll("p")].find((p) =>
    (p.textContent || "").includes("smooth from start"),
  );
  if (sub) {
    const r = sub.getBoundingClientRect();
    const cs = getComputedStyle(sub);
    out.subtext = {
      y: +(r.top + scrollY).toFixed(2),
      x: +r.x.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      op: cs.opacity,
      vis: cs.visibility,
      color: cs.color,
      cls: sub.className.slice(0, 120),
    };
  } else out.subtext = "NOT FOUND";

  // CTA heading
  const h2 = [...document.querySelectorAll("h2")].find((h) =>
    (h.textContent || "").includes("Renovation You Can Trust"),
  );
  if (h2) {
    const r = h2.getBoundingClientRect();
    const cs = getComputedStyle(h2);
    out.ctaH2 = {
      y: +(r.top + scrollY).toFixed(2),
      h: +r.height.toFixed(2),
      op: cs.opacity,
      cls: h2.className.slice(0, 100),
    };
  } else out.ctaH2 = "NOT FOUND";

  // h1 line rects
  window.scrollTo({ top: 0, behavior: "instant" });
  const h1 = document.querySelector("h1");
  if (h1) {
    const range = document.createRange();
    range.selectNodeContents(h1);
    const rects = [...range.getClientRects()].map((r) => ({
      x: +r.x.toFixed(2),
      w: +r.width.toFixed(2),
      y: +(r.top + scrollY).toFixed(2),
      h: +r.height.toFixed(2),
    }));
    out.h1lines = rects;
    out.h1text = h1.textContent;
  }
  return out;
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
