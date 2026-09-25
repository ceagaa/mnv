import { chromium } from "playwright";

const url = process.env.QA_URL ?? "http://localhost:3199/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });

const check = async (label, contains) => {
  const target = await page.evaluate((c) => {
    const els = [...document.querySelectorAll("body *")].filter((e) => (e.className && String(e.className).includes(c)) || false);
    for (const e of els) {
      const r = e.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.top > 100 && r.bottom < 850) {
        const g = e.closest(".group") || e;
        const gr = g.getBoundingClientRect();
        return { tx: r.x + r.width / 2, ty: r.y + r.height / 2, gx: gr.x + gr.width / 2, gy: gr.y + gr.height / 2, found: true };
      }
    }
    return { found: false, count: els.length };
  }, contains);
  if (!target.found) return console.log(`${label}: not in viewport (matches=${target.count})`);
  await page.mouse.move(target.gx, target.gy);
  const vals = [];
  for (let i = 0; i < 5; i++) {
    vals.push(
      await page.evaluate(({ c, tx, ty }) => {
        const els = [...document.querySelectorAll("body *")].filter((e) => (e.className && String(e.className).includes(c)) || false);
        for (const e of els) {
          const r = e.getBoundingClientRect();
          if (Math.abs(r.x + r.width / 2 - tx) < 2 && r.width > 0) {
            const cs = getComputedStyle(e);
            return `${cs.translate}|${cs.scale}|${cs.transform}`;
          }
        }
        return "?";
      }, { c: contains, tx: target.tx, ty: target.ty }),
    );
    await page.waitForTimeout(130);
  }
  console.log(`${label}: ${vals.join(" -> ")}`);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(400);
};

await check("hero-cta", "group-hover:-translate-y-[30px]");
await page.evaluate(() => { const els=[...document.querySelectorAll("body *")].filter(e=>String(e.className||"").includes("group-hover:translate-y-[80px]")); els[0]?.scrollIntoView({block:"center"}); });
await page.waitForTimeout(800);
await check("services-arrow", "group-hover:translate-y-[80px]");
await check("services-image", "group-hover:scale-110");
await page.evaluate(() => { const els=[...document.querySelectorAll("body *")].filter(e=>String(e.className||"").includes("group-hover:translate-x-[36px]")); els[0]?.scrollIntoView({block:"center"}); });
await page.waitForTimeout(800);
await check("gallery-slide", "group-hover:translate-x-[36px]");
await browser.close();
