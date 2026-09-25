import { chromium } from "playwright";

const BASE = process.env.QA_URL ?? "http://localhost:3000";
const OUT = "docs/design-references/comparison";

const VIEWPORTS = [
  { name: "clone-desktop-1440", width: 1440, height: 900 },
  { name: "clone-tablet-768", width: 768, height: 1024 },
  { name: "clone-mobile-390", width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
const errors = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${vp.name}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[${vp.name}] pageerror: ${err.message}`));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // Slow scroll top -> bottom to trigger IntersectionObserver reveals
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 600));
  });
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  await page.screenshot({ path: `${OUT}/${vp.name}.png`, fullPage: true });
  console.log(`saved ${OUT}/${vp.name}.png`);

  // Per-section shots at desktop for closer comparison
  if (vp.width === 1440) {
    const sections = await page.locator(".sections > *").all();
    for (let i = 0; i < sections.length; i++) {
      const box = await sections[i].boundingBox();
      if (box && box.height > 0) {
        await sections[i].screenshot({
          path: `${OUT}/clone-section-${String(i + 1).padStart(2, "0")}.png`,
        });
      }
    }
    console.log(`saved ${sections.length} section shots`);
  }
  await page.close();
}

await browser.close();
if (errors.length) {
  console.log("CONSOLE ERRORS:");
  for (const e of errors) console.log("  " + e);
} else {
  console.log("no console errors");
}
