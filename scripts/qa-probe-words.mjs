import { chromium } from "playwright";

const base = process.env.QA_URL ?? "https://elevaana.webflow.io/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle", timeout: 90000 });
await page.evaluate(() => window.scrollTo({ top: 7000, behavior: "instant" }));
await page.waitForTimeout(1500);

const out = await page.evaluate(() => {
  const h2 = [...document.querySelectorAll("h2")].find((h) =>
    (h.textContent || "").includes("every detail"),
  );
  if (!h2) return "no h2";
  const r0 = h2.getBoundingClientRect();
  const lines = [...h2.getClientRects()].map((r) => ({
    y: +(r.y + window.scrollY).toFixed(2),
    x: +r.x.toFixed(2),
    w: +r.width.toFixed(2),
  }));
  // per-word rects within line 2 (y ~7347)
  const walker = document.createTreeWalker(h2, NodeFilter.SHOW_TEXT);
  const words = [];
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent;
    const re = /\S+/g;
    let m;
    while ((m = re.exec(text))) {
      const range = document.createRange();
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const r = range.getBoundingClientRect();
      words.push({
        y: +(r.y + window.scrollY).toFixed(2),
        x: +r.x.toFixed(2),
        w: +r.width.toFixed(3),
        word: m[0],
      });
    }
  }
  return {
    h2: {
      y: +(r0.y + window.scrollY).toFixed(2),
      x: +r0.x.toFixed(2),
      w: +r0.width.toFixed(2),
      h: +r0.height.toFixed(2),
    },
    lines,
    words,
  };
});
console.log(base);
console.log(JSON.stringify(out, null, 1));
await browser.close();
