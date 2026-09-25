import { chromium } from "playwright";
import crypto from "node:crypto";

const b = await chromium.launch({ headless: true });

const grab = async (url) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const fonts = [];
  p.on("response", async (res) => {
    const u = res.url();
    if (/\.woff2?($|\?)/.test(u) || res.headers()["content-type"]?.includes("font")) {
      try {
        const buf = await res.body();
        fonts.push(`${u.split("?")[0].split("/").pop()} ${buf.length}b ${crypto.createHash("sha1").update(buf).digest("hex").slice(0, 12)}`);
      } catch { fonts.push(`${u} <no-body>`); }
    }
  });
  await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  const ff = await p.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].map((f) => `${f.family}|${f.weight}|${f.style}|${f.status}`);
  });
  await p.close();
  return { fonts, ff };
};

const o = await grab("https://elevaana.webflow.io/");
const c = await grab("http://localhost:3199/");
console.log("ORIG font resources:");
o.fonts.forEach((f) => console.log("  " + f));
console.log("CLONE font resources:");
c.fonts.forEach((f) => console.log("  " + f));
const oF = [...new Set(o.ff)].sort(), cF = [...new Set(c.ff)].sort();
console.log("ORIG FontFace set:"); oF.forEach((x) => console.log("  " + x));
console.log("CLONE FontFace set:"); cF.forEach((x) => console.log("  " + x));
await b.close();
