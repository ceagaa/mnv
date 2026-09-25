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
await page.waitForTimeout(1000);

const info = await page.evaluate(() => {
  const sec = [...document.querySelectorAll("section")].find(
    (s) =>
      (s.className || "").toString().includes("how-we-work") ||
      (s.textContent || "").toLowerCase().includes("how we work"),
  );
  if (!sec) return [{ d: -1, tag: "err", cls: "section not found", top: 0, h: 0, txt: "" }];
  const out = [];
  const walk = (el, d) => {
    if (d > 6 || out.length > 300) return;
    const r = el.getBoundingClientRect();
    out.push({
      d,
      tag: el.tagName.toLowerCase(),
      cls: (el.className || "").toString().slice(0, 40),
      top: +(r.top + scrollY).toFixed(4),
      h: +r.height.toFixed(4),
      txt: (el.childElementCount === 0 ? (el.textContent || "").trim().slice(0, 24) : ""),
    });
    for (const c of el.children) walk(c, d + 1);
  };
  walk(sec, 0);
  return out;
});
console.log(JSON.stringify(info));
await browser.close();
