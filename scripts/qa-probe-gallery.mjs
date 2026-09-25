import { chromium } from "playwright";

const base = process.env.QA_URL ?? "http://localhost:3001/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 350));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const sec = [...document.querySelectorAll("section")].find((s) =>
    s.textContent.includes("Our Work Gallery"),
  );
  const boxes = [...sec.querySelectorAll("img")].map((img) => {
    const card = img.closest("div.group") ?? img.parentElement;
    const r = card.getBoundingClientRect();
    const ir = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    return {
      alt: img.alt,
      cardTop: Math.round(r.top + scrollY),
      cardH: Math.round(r.height),
      cardW: Math.round(r.width),
      imgTop: Math.round(ir.top + scrollY),
      imgH: Math.round(ir.height),
      objFit: cs.objectFit,
      natural: img.naturalWidth + "x" + img.naturalHeight,
      complete: img.complete,
    };
  });
  const h2 = [...sec.querySelectorAll("h2")].map((h) => {
    const r = h.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), h: Math.round(r.height) };
  });
  const rows = [...sec.querySelectorAll(":scope div.flex.flex-col.gap-\\[20px\\] > div")].map((d) => {
    const r = d.getBoundingClientRect();
    return { top: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width) };
  });
  return { boxes, h2, rows };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
