import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = "https://elevaana.webflow.io/";
const ROOT = path.resolve("docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2/components");
fs.mkdirSync(ROOT, { recursive: true });

const PROPS = [
  "display","flexDirection","justifyContent","alignItems","gap","gridTemplateColumns","gridTemplateRows",
  "fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","color","textTransform","textAlign","textDecorationLine",
  "backgroundColor","backgroundImage","backgroundSize","backgroundPosition","backgroundRepeat",
  "padding","margin","width","height","maxWidth","minWidth","maxHeight","minHeight",
  "borderRadius","border","boxShadow","overflow","overflowX","overflowY",
  "position","top","right","bottom","left","zIndex","transform","transformOrigin",
  "opacity","transition","cursor","objectFit","objectPosition","whiteSpace","flexWrap","alignSelf","order","flex",
];

const mkFn = (depthLimit, props) => `function __extract(rootSel) {
  const depthLimit = ${depthLimit};
  const PROPS = ${JSON.stringify(props)};
  const root = document.querySelector(rootSel);
  if (!root) return { error: "not found " + rootSel };
  const clean = (v) => v;
  function walk(el, depth) {
    if (depth > depthLimit) return null;
    const cs = getComputedStyle(el);
    const styles = {};
    for (const p of PROPS) {
      const v = cs.getPropertyValue(p) || cs[p];
      if (!v) continue;
      if (v === "none" || v === "normal" || v === "auto" || v === "0px" || v === "rgba(0, 0, 0, 0)" || v === "visible" || v === "static" || v === "pointer" && p !== "cursor") continue;
      if (p === "cursor" && v === "auto") continue;
      styles[p] = clean(v);
    }
    const kids = [...el.children];
    const directText = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).filter(Boolean).join(" ");
    const out = {
      tag: el.tagName.toLowerCase(),
      cls: String(el.className || "").slice(0, 160),
      text: directText ? directText.slice(0, 400) : null,
      st: styles,
    };
    if (el.tagName === "IMG") {
      out.img = { src: el.currentSrc || el.src, alt: el.alt, nw: el.naturalWidth, nh: el.naturalHeight };
    }
    if (el.tagName === "A") out.href = el.getAttribute("href");
    if (el.tagName === "VIDEO") out.video = { src: el.currentSrc, poster: el.poster, autoplay: el.autoplay, loop: el.loop, muted: el.muted };
    if (kids.length) out.c = kids.map((k) => walk(k, depth + 1)).filter(Boolean);
    return out;
  }
  return walk(root, 0);
}`;

const browser = await chromium.launch({ headless: true });

async function run(width, suffix) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2000);
  // reveal
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const children = await page.evaluate(() =>
    [...document.querySelector("section.sections").children].map((c, i) => ({
      i,
      cls: String(c.className).split(" ")[0],
      tag: c.tagName.toLowerCase(),
    }))
  );

  for (const c of children) {
    const fn = path.join(ROOT, `${String(c.i + 1).padStart(2, "0")}-${c.cls}${suffix}.json`);
    const fnRaw = path.join(ROOT, `${String(c.i + 1).padStart(2, "0")}-${c.cls}${suffix}.tree.json`);
    const data = await page.evaluate(`(${mkFn(7, PROPS)})('section.sections > ${c.tag}.${c.cls}')`);
    fs.writeFileSync(fnRaw, JSON.stringify(data, null, 1));
    console.log("extracted", path.basename(fnRaw), JSON.stringify(data).length);
  }

  // FAQ open state
  if (!suffix) {
    const faq = page.locator(".single-faq").first();
    if (await faq.count()) {
      await faq.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await faq.locator(".faq-toggle, .w-dropdown-toggle, div").first().click().catch(() => {});
      await page.waitForTimeout(900);
      const open = await page.evaluate(`(${mkFn(7, PROPS)})('section.sections > section.faq-section')`);
      fs.writeFileSync(path.join(ROOT, "09-faq-section.open.json"), JSON.stringify(open, null, 1));
      await page.screenshot({ path: path.resolve("docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/state-faq-open.png") });
      console.log("faq open captured");
    }
    // gallery card hover
    const gcard = page.locator(".gallery-card, .our-gallery-card").first();
    if (await gcard.count()) {
      await gcard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const before = await gcard.evaluate((el) => {
        const o = el.querySelector(".gallery-shape");
        const g = (e) => { if (!e) return null; const c = getComputedStyle(e); return { opacity: c.opacity, transform: c.transform, clipPath: c.clipPath, transition: c.transition, bg: c.backgroundColor }; };
        return { card: g(el), shape: g(o) };
      });
      await gcard.hover();
      await page.waitForTimeout(900);
      const after = await gcard.evaluate((el) => {
        const o = el.querySelector(".gallery-shape");
        const g = (e) => { if (!e) return null; const c = getComputedStyle(e); return { opacity: c.opacity, transform: c.transform, clipPath: c.clipPath, transition: c.transition, bg: c.backgroundColor }; };
        return { card: g(el), shape: g(o) };
      });
      fs.writeFileSync(path.join(ROOT, "gallery-hover.json"), JSON.stringify({ before, after }, null, 1));
      console.log("gallery hover captured");
    }
    // testimonial/expertise hover
    for (const sel of [".testimonial-card", ".our-expart-card", ".counter-card", ".how-we-work-card"]) {
      const el = page.locator(sel).first();
      if (!(await el.count())) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const before = await el.evaluate((e) => { const c = getComputedStyle(e); return { bg: c.backgroundColor, transform: c.transform, boxShadow: c.boxShadow, transition: c.transition, opacity: c.opacity, color: c.color, border: c.border }; });
      await el.hover().catch(() => {});
      await page.waitForTimeout(700);
      const after = await el.evaluate((e) => { const c = getComputedStyle(e); return { bg: c.backgroundColor, transform: c.transform, boxShadow: c.boxShadow, transition: c.transition, opacity: c.opacity, color: c.color, border: c.border }; });
      fs.writeFileSync(path.join(ROOT, `hover-${sel.replace(/\W+/g, "")}.json`), JSON.stringify({ before, after }, null, 1));
    }
  }

  await ctx.close();
}

await run(1440, "");
await run(390, ".mobile");
await run(768, ".tablet");
await browser.close();
console.log("EXTRACT DONE");
