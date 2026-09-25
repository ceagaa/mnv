import { chromium } from "playwright";
import crypto from "node:crypto";

const b = await chromium.launch({ headless: true });

const grab = async (url) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  const r = await p.evaluate(async () => {
    await document.fonts.load('600 48px "Rethink Sans"');
    await document.fonts.ready;
    const c = document.createElement("canvas");
    c.width = 700; c.height = 90;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    const texts = ["handles every detail with", "Our experienced team", "care, precision, and passion"];
    const out = {};
    for (const t of texts) {
      ctx.clearRect(0, 0, 700, 90);
      ctx.font = '600 48px "Rethink Sans"';
      ctx.fillStyle = "#000";
      ctx.textBaseline = "alphabetic";
      const w = ctx.measureText(t).width;
      ctx.fillText(t, 10, 60);
      const d = ctx.getImageData(0, 0, 700, 90).data;
      let h = 0, sum = 0;
      for (let i = 0; i < d.length; i++) { h = (h * 31 + d[i]) >>> 0; if ((i & 3) === 3) sum += d[i]; }
      out[t] = `w=${w.toFixed(4)} sum=${sum} hash=${h.toString(16)}`;
    }
    // first differing pixel between nothing: also record loaded font face URLs
    out._faces = [];
    for (const f of document.fonts) if (f.family.includes("Rethink") && f.weight === "600") out._faces.push(f.family + "|" + f.status);
    return out;
  });
  await p.close();
  return r;
};

const o = await grab("https://elevaana.webflow.io/");
const c = await grab("http://localhost:3199/");
for (const k of Object.keys(o)) {
  const eq = JSON.stringify(o[k]) === JSON.stringify(c[k]);
  console.log(`${eq ? "SAME" : "DIFF"} ${k}\n  orig  ${JSON.stringify(o[k])}\n  clone ${JSON.stringify(c[k])}`);
}
await b.close();
