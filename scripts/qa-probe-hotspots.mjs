import { chromium } from "playwright";

const base = process.env.QA_URL ?? "http://localhost:3001/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 300));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      x: +(r.x).toFixed(2),
      y: +(r.top + scrollY).toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      op: cs.opacity,
      vis: cs.visibility,
      disp: cs.display,
      fs: cs.fontSize,
      fw: cs.fontWeight,
      ff: cs.fontFamily.slice(0, 40),
      ls: cs.letterSpacing,
      lh: cs.lineHeight,
      txt: (el.textContent || "").trim().slice(0, 46),
    };
  };
  const out = {};

  // hero h1
  const h1 = document.querySelector("h1");
  out.h1 = rect(h1);

  // header: all elements with text near x1136 at header area
  const hdr = document.querySelector("header, section");
  out.headerEls = [];
  if (hdr) {
    for (const el of hdr.querySelectorAll("a, button, span, p")) {
      const r = el.getBoundingClientRect();
      if (r.top + scrollY < 60 || r.top + scrollY > 140) continue;
      if (r.x > 1080 && r.x < 1300 && el.childElementCount <= 2) out.headerEls.push(rect(el));
    }
  }

  // CTA: find container with heading containing "Ready"
  const ctaH = [...document.querySelectorAll("h2")].find((h) =>
    (h.textContent || "").toLowerCase().includes("ready"),
  );
  out.ctaHeading = rect(ctaH);
  out.ctaSiblings = [];
  if (ctaH) {
    let p = ctaH.parentElement;
    for (let d = 0; d < 4 && p; d++, p = p.parentElement) {
      for (const sib of p.children) {
        out.ctaSiblings.push({ depth: d, ...rect(sib) });
      }
    }
  }

  // top-label marquee: first element child strip
  const tl = [...document.querySelectorAll("section")].find(
    (s) =>
      (s.className || "").toString().includes("top-label") ||
      getComputedStyle(s).backgroundColor === "rgb(255, 108, 31)",
  );
  out.marquee = null;
  if (tl) {
    const kids = [...tl.querySelectorAll("img, a, div")].slice(0, 8).map(rect);
    out.marquee = { self: rect(tl), kids };
  }
  return out;
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
