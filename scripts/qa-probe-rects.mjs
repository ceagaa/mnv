import { chromium } from "playwright";

const base = process.env.QA_URL ?? "https://elevaana.webflow.io/";
const Y0 = Number(process.env.QA_Y0 ?? 2650);
const Y1 = Number(process.env.QA_Y1 ?? 3100);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle", timeout: 90000 });
await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), Math.max(0, Y0 - 200));
await page.waitForTimeout(2500);

const out = await page.evaluate(
  ({ y0, y1 }) => {
    const rows = [];
    for (const el of document.querySelectorAll("h1,h2,h3,h4,p,a,span,strong,div")) {
      const r = el.getBoundingClientRect();
      const y = r.y + window.scrollY;
      if (y < y0 || y > y1 || r.height < 4 || r.width < 4) continue;
      const txt = (el.textContent || "").trim();
      if (!txt || txt.length > 70) continue;
      if (el.children.length > 0) continue;
      const cs = getComputedStyle(el);
      rows.push({
        tag: el.tagName,
        y: +y.toFixed(2),
        x: +r.x.toFixed(2),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
        tf: cs.transform === "none" ? "-" : cs.transform.replace(/matrix\(|\)/g, ""),
        op: cs.opacity,
        t: (el.textContent || el.getAttribute("src") || "").trim().slice(0, 36),
      });
    }
    return rows;
  },
  { y0: Y0, y1: Y1 },
);
console.log(base);
for (const r of out) {
  console.log(
    `${r.tag} y${r.y} x${r.x} w${r.w} h${r.h} tf=${r.tf} op=${r.op} | ${r.t}`,
  );
}
await browser.close();
