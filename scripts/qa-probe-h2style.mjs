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
    const cs = getComputedStyle(h2);
    const props = [
      "fontFamily", "fontSize", "fontWeight", "fontStyle", "fontStretch",
      "lineHeight", "letterSpacing", "wordSpacing", "fontKerning",
      "fontFeatureSettings", "fontVariantLigatures", "fontVariationSettings",
      "textRendering", "textSizeAdjust", "zoom", "transform", "translate",
      "willChange", "contain", "backfaceVisibility", "filter", "mixBlendMode",
      "textIndent", "textAlign", "direction", "fontOpticalSizing",
    ];
    const out = {};
    for (const k of props) {
      const v = cs.getPropertyValue(k) || cs[k];
      if (v && v !== "normal" && v !== "auto" && v !== "none" && v !== "0px" && v !== "0") out[k] = v;
    }
    out._rects = [...h2.getClientRects()].map((r) => r.y.toFixed(4) + "|" + r.height.toFixed(4));
    out._rangeY = (() => {
      const rg = document.createRange();
      rg.selectNodeContents(h2);
      return rg.getBoundingClientRect().y.toFixed(4);
    })();
    return out;
  });
  await p.close();
  return r;
};

const o = await grab(process.env.QA_URL ?? "https://elevaana.webflow.io/");
const c = await grab("http://localhost:3199/");
const keys = new Set([...Object.keys(o), ...Object.keys(c)]);
for (const k of keys) {
  if (JSON.stringify(o[k]) !== JSON.stringify(c[k]))
    console.log("DIFF", k, JSON.stringify(o[k]), "vs", JSON.stringify(c[k]));
}
console.log("ORIG ", JSON.stringify(o));
console.log("CLONE", JSON.stringify(c));
await b.close();
