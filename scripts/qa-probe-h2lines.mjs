import { chromium } from "playwright";

const b = await chromium.launch({ headless: true });

const grab = async (url) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await p.evaluate(() => window.scrollTo({ top: 7200, behavior: "instant" }));
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const h2 = [...document.querySelectorAll("h2")].find((h) =>
      (h.textContent || "").includes("every detail"),
    );
    const sy = window.scrollY;
    const rg = document.createRange();
    rg.selectNodeContents(h2);
    const lines = [...rg.getClientRects()].map(
      (x) => `${(x.y + sy).toFixed(6)}|${x.height.toFixed(6)}|${(x.x + window.scrollX).toFixed(3)}|${x.width.toFixed(3)}`,
    );
    const chain = [];
    let el = h2;
    while (el && el !== document.documentElement) {
      const cs = getComputedStyle(el);
      chain.push({
        tag: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).split(" ").slice(0, 3).join(".") : ""),
        tf: cs.transform !== "none" ? cs.transform : "",
        wc: cs.willChange !== "auto" ? cs.willChange : "",
        flt: cs.filter !== "none" ? cs.filter : "",
        cont: cs.contain !== "none" ? cs.contain : "",
        op: cs.opacity !== "1" ? cs.opacity : "",
        ovf: cs.overflow,
        top: (el.getBoundingClientRect().y + sy).toFixed(4),
      });
      el = el.parentElement;
    }
    return { lines, chain };
  });
  await p.close();
  return r;
};

const o = await grab("https://elevaana.webflow.io/");
const c = await grab("http://localhost:3199/");
console.log("ORIG lines:");
o.lines.forEach((l) => console.log("  " + l));
console.log("CLONE lines:");
c.lines.forEach((l) => console.log("  " + l));
console.log("ORIG chain:");
o.chain.forEach((x) => console.log("  " + JSON.stringify(x)));
console.log("CLONE chain:");
c.chain.forEach((x) => console.log("  " + JSON.stringify(x)));
await b.close();
