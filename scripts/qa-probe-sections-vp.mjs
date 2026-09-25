import { chromium } from "playwright";

const w = process.env.QA_W ?? "375";
const h = process.env.QA_H ?? "812";
const browser = await chromium.launch({ headless: true });

const grab = async (url) => {
  const p = await browser.newPage({ viewport: { width: +w, height: +h } });
  await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  for (let i = 0; i < 8; i++) {
    const sh = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await p.waitForTimeout(500);
    const sh2 = await p.evaluate(() => document.documentElement.scrollHeight);
    if (sh === sh2) break;
  }
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const list = [];
    const collect = (root, depth) => {
      for (const el of root.children) {
        if (/^(SECTION|HEADER|FOOTER|MAIN|DIV)$/.test(el.tagName) && el.getBoundingClientRect().height > 40) {
          list.push(el);
          if (depth < 1) collect(el, depth + 1);
        }
      }
    };
    collect(document.body, 0);
    return {
      pageH: document.documentElement.scrollHeight,
      rows: list.map((el) => {
        const rc = el.getBoundingClientRect();
        return `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")}#${el.children.length}|${(rc.top + window.scrollY).toFixed(1)}|${rc.height.toFixed(1)}`;
      }),
    };
  });
  await p.close();
  return r;
};

const o = await grab("https://elevaana.webflow.io/");
const c = await grab("http://localhost:3199/");
console.log(`ORIG pageH=${o.pageH}`);
o.rows.forEach((x) => console.log("  " + x));
console.log(`CLONE pageH=${c.pageH}`);
c.rows.forEach((x) => console.log("  " + x));
await browser.close();
