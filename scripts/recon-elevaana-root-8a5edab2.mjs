import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = "https://elevaana.webflow.io/";
const ROOT = path.resolve("docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2");
const SHOTS = path.resolve("docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2");
fs.mkdirSync(ROOT, { recursive: true });
fs.mkdirSync(SHOTS, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true });

async function newPage(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2500);
  return { ctx, page };
}

// ---------- 1. Full page screenshots ----------
{
  const { ctx, page } = await newPage(1440, 900);
  await page.screenshot({ path: path.join(SHOTS, "full-desktop-1440.png"), fullPage: true });
  // scroll through to trigger reveal animations, then back to top
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(180);
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(SHOTS, "full-desktop-1440-revealed.png"), fullPage: true });
  await ctx.close();
}
{
  const { ctx, page } = await newPage(390, 844);
  await page.screenshot({ path: path.join(SHOTS, "full-mobile-390.png"), fullPage: true });
  await ctx.close();
}
{
  const { ctx, page } = await newPage(768, 1024);
  await page.screenshot({ path: path.join(SHOTS, "full-tablet-768.png"), fullPage: true });
  await ctx.close();
}

// ---------- 2. Global extraction ----------
{
  const { ctx, page } = await newPage(1440, 900);

  const global = await page.evaluate(() => {
    const fonts = new Set();
    const colors = new Set();
    const bgColors = new Set();
    document.querySelectorAll("*").forEach((el) => {
      const cs = getComputedStyle(el);
      fonts.add(cs.fontFamily);
      if (cs.color) colors.add(cs.color);
      if (cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)")
        bgColors.add(cs.backgroundColor);
    });
    const fontLinks = [...document.querySelectorAll('link[rel="stylesheet"], link[href*="fonts"]')]
      .map((l) => l.href);
    const favicons = [...document.querySelectorAll('link[rel*="icon"]')].map((l) => ({
      rel: l.rel, href: l.href, sizes: l.sizes?.toString(),
    }));
    return {
      title: document.title,
      fonts: [...fonts],
      colors: [...colors],
      bgColors: [...bgColors],
      fontLinks,
      favicons,
      bodyScrollHeight: document.body.scrollHeight,
    };
  });
  fs.writeFileSync(path.join(ROOT, "GLOBAL_EXTRACTION.json"), JSON.stringify(global, null, 2));

  // ---------- 3. Page topology: top-level sections ----------
  const topology = await page.evaluate(() => {
    const out = [];
    const walkSections = (scope) =>
      [...scope.children].filter((el) => el.tagName === "SECTION" || el.tagName === "HEADER" || el.tagName === "FOOTER" || el.tagName === "NAV");
    const roots = [];
    document.body.querySelectorAll("section").forEach((s) => {
      if (!s.parentElement.closest("section")) roots.push(s);
    });
    if (document.querySelector("footer")) roots.push(document.querySelector("footer"));
    roots.forEach((el, i) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      out.push({
        index: i,
        tag: el.tagName.toLowerCase(),
        classes: el.className,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 300),
        height: Math.round(r.height),
        background: cs.backgroundColor,
        backgroundImage: cs.backgroundImage === "none" ? null : cs.backgroundImage.slice(0, 300),
        childSections: [...el.children].map((c) => c.tagName.toLowerCase() + "." + String(c.className).split(" ").slice(0, 3).join(" ")),
      });
    });
    return out;
  });
  fs.writeFileSync(path.join(ROOT, "PAGE_TOPOLOGY.json"), JSON.stringify(topology, null, 2));

  // ---------- 4. Assets ----------
  const assets = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("img")].map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt,
      cls: img.className,
      w: img.naturalWidth,
      h: img.naturalHeight,
    }));
    const vids = [...document.querySelectorAll("video")].map((v) => ({
      src: v.currentSrc || v.querySelector("source")?.src || v.src,
      poster: v.poster || v.style.backgroundImage,
      autoplay: v.autoplay, loop: v.loop, muted: v.muted,
    }));
    const bgs = [];
    document.querySelectorAll("*").forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== "none" && bg.includes("url(")) {
        bgs.push({ url: bg, el: el.tagName.toLowerCase() + "." + String(el.className).split(" ")[0] });
      }
    });
    const svgs = [...document.querySelectorAll("svg")].map((s) => ({
      cls: s.getAttribute("class"),
      html: s.outerHTML.length > 4000 ? s.outerHTML.slice(0, 4000) : s.outerHTML,
    }));
    return { imgs, vids, bgs, svgCount: svgs.length, svgs };
  });
  fs.writeFileSync(path.join(ROOT, "ASSETS.json"), JSON.stringify(assets, null, 2));

  // ---------- 5. Computed styles of key typography ----------
  const type = await page.evaluate(() => {
    const sels = ["h1", "h2", "h3", "h4", "p", "a", "button", ".hero-display-heading", ".hero-subtitle", ".hero-subtext", ".service-title", ".body-16-semibold", ".body-14-regular", "body"];
    const out = {};
    sels.forEach((s) => {
      const el = document.querySelector(s);
      if (!el) return;
      const cs = getComputedStyle(el);
      out[s] = {
        text: (el.textContent || "").trim().slice(0, 80),
        fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, color: cs.color,
        textTransform: cs.textTransform, margin: cs.margin, padding: cs.padding,
      };
    });
    return out;
  });
  fs.writeFileSync(path.join(ROOT, "TYPOGRAPHY.json"), JSON.stringify(type, null, 2));

  await ctx.close();
}

// ---------- 6. Interaction sweep ----------
{
  const { ctx, page } = await newPage(1440, 900);
  const behaviors = {};

  // header/nav before and after scroll
  const navState = async () =>
    page.evaluate(() => {
      const nav = document.querySelector(".navbar-black") || document.querySelector(".w-nav");
      const header = document.querySelector(".header");
      const g = (el) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          bg: cs.backgroundColor, position: cs.position, top: cs.top,
          boxShadow: cs.boxShadow, transform: cs.transform,
          rect: { y: Math.round(r.y), h: Math.round(r.height) },
        };
      };
      return { nav: g(nav), header: g(header), scrollY: window.scrollY };
    });
  behaviors.headerTop = await navState();
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(900);
  behaviors.headerScrolled400 = await navState();
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(900);
  behaviors.headerScrolled1200 = await navState();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  // hover states on primary button
  const btn = page.locator(".button-primary").first();
  const before = await btn.evaluate((el) => {
    const cs = getComputedStyle(el);
    const bgEl = el.querySelector(".primary-button-bg");
    const txt = el.querySelector(".primary-button-text");
    const txtH = el.querySelector(".primary-button-text-hover");
    const g = (e) => { if (!e) return null; const c = getComputedStyle(e); return { bg: c.backgroundColor, color: c.color, transform: c.transform, transition: c.transition, opacity: c.opacity, position: c.position, top: c.top, left: c.left }; };
    return { root: g(el), bg: g(bgEl), txt: g(txt), txtHover: g(txtH) };
  });
  await btn.hover();
  await page.waitForTimeout(700);
  const after = await btn.evaluate((el) => {
    const cs = getComputedStyle(el);
    const bgEl = el.querySelector(".primary-button-bg");
    const txt = el.querySelector(".primary-button-text");
    const txtH = el.querySelector(".primary-button-text-hover");
    const g = (e) => { if (!e) return null; const c = getComputedStyle(e); return { bg: c.backgroundColor, color: c.color, transform: c.transform, transition: c.transition, opacity: c.opacity, position: c.position, top: c.top, left: c.left }; };
    return { root: g(el), bg: g(bgEl), txt: g(txt), txtHover: g(txtH) };
  });
  behaviors.primaryButtonHover = { before, after };
  await page.screenshot({ path: path.join(SHOTS, "state-button-hover.png"), clip: await btn.boundingBox() });

  // service card hover
  const card = page.locator(".service-card").first();
  if (await card.count()) {
    const cb = await card.evaluate((el) => {
      const img = el.querySelector("img");
      const overlay = el.querySelector(".work-card-overlay");
      const arrow = el.querySelector(".services-arrow-icon-wrap");
      const g = (e) => { if (!e) return null; const c = getComputedStyle(e); return { transform: c.transform, transition: c.transition, opacity: c.opacity, display: c.display, bg: c.backgroundColor, top: c.top, left: c.left, right: c.right, bottom: c.bottom, position: c.position }; };
      return { card: g(el), img: g(img), overlay: g(overlay), arrow: g(arrow) };
    });
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await card.hover();
    await page.waitForTimeout(900);
    const ca = await card.evaluate((el) => {
      const img = el.querySelector("img");
      const overlay = el.querySelector(".work-card-overlay");
      const arrow = el.querySelector(".services-arrow-icon-wrap");
      const g = (e) => { if (!e) return null; const c = getComputedStyle(e); return { transform: c.transform, transition: c.transition, opacity: c.opacity, display: c.display, bg: c.backgroundColor, top: c.top, left: c.left, right: c.right, bottom: c.bottom, position: c.position }; };
      return { card: g(el), img: g(img), overlay: g(overlay), arrow: g(arrow) };
    });
    behaviors.serviceCardHover = { before: cb, after: ca };
    const bb = await card.boundingBox();
    if (bb) await page.screenshot({ path: path.join(SHOTS, "state-service-card-hover.png"), clip: bb });
  }

  // dropdown open (All Pages menu)
  const toggle = page.locator(".dropdown-toggle-main").first();
  if (await toggle.count()) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await toggle.click().catch(() => {});
    await page.waitForTimeout(900);
    behaviors.dropdownOpen = await page.evaluate(() => {
      const list = document.querySelector(".dropdown-menu-list");
      if (!list) return null;
      const cs = getComputedStyle(list);
      const r = list.getBoundingClientRect();
      return { display: cs.display, opacity: cs.opacity, visibility: cs.visibility, transform: cs.transform, bg: cs.backgroundColor, boxShadow: cs.boxShadow, rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } };
    });
    await page.screenshot({ path: path.join(SHOTS, "state-dropdown-open.png"), fullPage: false });
  }

  // reveal-on-scroll: what starts at opacity 0
  behaviors.initialHidden = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("[style*='opacity: 0'], [style*='opacity:0']").forEach((el) => {
      out.push({ cls: String(el.className).slice(0, 80), tag: el.tagName.toLowerCase(), text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60) });
    });
    return out;
  });

  // scroll reveal final states after full scroll
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  });
  await page.waitForTimeout(1500);
  behaviors.afterFullScrollHidden = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("[style*='opacity: 0'], [style*='opacity:0']").forEach((el) => {
      out.push({ cls: String(el.className).slice(0, 80) });
    });
    return out;
  });

  fs.writeFileSync(path.join(ROOT, "BEHAVIORS.json"), JSON.stringify(behaviors, null, 2));
  await ctx.close();
}

await browser.close();
console.log("RECON DONE");
