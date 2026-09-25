import { chromium } from "playwright";

const w = process.env.QA_W ?? "375";
const h = process.env.QA_H ?? "812";
const which = process.env.QA_PART ?? "footer";
const browser = await chromium.launch({ headless: true });

const grab = async (url) => {
  const p = await browser.newPage({ viewport: { width: +w, height: +h } });
  await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  for (let i = 0; i < 6; i++) {
    const sh = await p.evaluate(() => document.documentElement.scrollHeight);
    await p.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await p.waitForTimeout(500);
    const sh2 = await p.evaluate(() => document.documentElement.scrollHeight);
    if (sh === sh2) break;
  }
  const r = await p.evaluate((part) => {
    const cont = [...document.body.children].find(e => e.children.length >= 12) || document.querySelector(".sections");
    const idx = ({footer:11,hww:4,gallery:5,cta:9})[part] ?? 4;
    const sec = cont ? cont.children[idx] : null;
    if (!sec) return { err: "sec not found" };
    const sy = window.scrollY;
    const out = [];
    const walk = (el, depth, path) => {
      const rc = el.getBoundingClientRect();
      if (rc.height < 4) return;
      out.push(`${"  ".repeat(depth)}${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 4).join(".")}#${el.children.length}|y=${(rc.top + sy).toFixed(1)}|h=${rc.height.toFixed(1)}|x=${rc.x.toFixed(1)}|w=${rc.width.toFixed(1)}`);
      if (depth < 5) for (const c of el.children) walk(c, depth + 1, path);
    };
    walk(sec, 0, "");
    return { sec: sec.tagName + "." + String(sec.className).slice(0, 60), out };
  }, which);
  await p.close();
  return r;
};

const o = await grab("https://elevaana.webflow.io/");
const c = await grab("http://localhost:3199/");
console.log("ORIG", o.sec ?? o.err);
o.out?.forEach((x) => console.log(x));
console.log("CLONE", c.sec ?? c.err);
c.out?.forEach((x) => console.log(x));
await browser.close();

