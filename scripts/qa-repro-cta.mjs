import { chromium } from "playwright";

const base = process.env.QA_URL ?? "http://localhost:3001/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(2000);

// mirror qa-tiled: sequential tiles with 2600ms waits
for (let y = 0; y <= 8100; y += 900) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
  await page.waitForTimeout(2600);
}

const state = await page.evaluate(() => {
  const sub = [...document.querySelectorAll("p")].find((p) =>
    (p.textContent || "").includes("smooth from start"),
  );
  const h2 = [...document.querySelectorAll("h2")].find((h) =>
    (h.textContent || "").includes("Renovation You Can Trust"),
  );
  const btn = [...document.querySelectorAll("a")].find((a) =>
    (a.textContent || "").includes("Book A Free Consultation") &&
    (a.textContent || "").length < 40,
  );
  const info = (el) => {
    if (!el) return "missing";
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { op: cs.opacity, tr: cs.transform, delay: cs.transitionDelay, y: +(r.top).toFixed(1), vis: cs.visibility };
  };
  return { scrollY: window.scrollY, sub: info(sub), h2: info(h2), btn: info(btn) };
});
console.log(JSON.stringify(state, null, 1));
await browser.close();
