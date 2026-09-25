import { chromium } from "playwright";

const base = process.env.QA_URL ?? "https://elevaana.webflow.io/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1000);

// marquee speed: sample inner block transform twice, 8s apart, at scroll 0
const sampleX = () =>
  page.evaluate(() => {
    const cands = [...document.querySelectorAll("section")].filter((s) =>
      (s.textContent || "").includes("(416) 555-0192"),
    );
    cands.sort(
      (a, b) =>
        a.getBoundingClientRect().width * a.getBoundingClientRect().height -
        b.getBoundingClientRect().width * b.getBoundingClientRect().height,
    );
    const sec = cands[0];
    const inner =
      sec.querySelector('[class*="text-block"]') ??
      sec.querySelector('[class*="marquee"]') ??
      sec.children[0]?.children[0];
    const cs = inner ? getComputedStyle(inner) : null;
    return {
      t: performance.now(),
      cls: inner ? (inner.className || "").toString() : "none",
      transform: cs ? cs.transform : "none",
      anim: cs ? cs.animationName + " " + cs.animationDuration : "none",
      parentTransform: sec.children[0] ? getComputedStyle(sec.children[0]).transform : "none",
    };
  });

const s1 = await sampleX();
await page.waitForTimeout(8000);
const s2 = await sampleX();
console.log("t1", JSON.stringify(s1));
console.log("t2", JSON.stringify(s2));
const tx1 = Number((s1.transform.match(/,\s*(-?[\d.]+),\s*0\)$/)||[])[1]);
const tx2 = Number((s2.transform.match(/,\s*(-?[\d.]+),\s*0\)$/)||[])[1]);
const dt = (s2.t - s1.t) / 1000;
console.log("speed px/s:", ((tx2 - tx1) / dt).toFixed(3), "over", dt.toFixed(2), "s");

// hero word widths: per-word Range rects
const words = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  if (!h1) return "no h1";
  const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
  const out = [];
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
      out.push({ w: +r.width.toFixed(3), x: +r.x.toFixed(2), word: m[0] });
    }
  }
  return out;
});
console.log("h1 words:", JSON.stringify(words));
await browser.close();
