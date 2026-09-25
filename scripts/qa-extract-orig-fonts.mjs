import { chromium } from "playwright";
import fs from "node:fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const links = new Set();
page.on("response", (res) => {
  const u = res.url();
  if (u.includes("fonts.googleapis.com/css")) links.add(u);
});
await page.goto("https://elevaana.webflow.io/", { waitUntil: "networkidle", timeout: 90000 });

const cssAll = [];
for (const u of links) {
  const txt = await page.evaluate(async (u) => (await fetch(u)).text(), u);
  cssAll.push(txt);
}
const full = cssAll.join("\n");
fs.writeFileSync("docs/design-references/orig-fonts.css", full);

const faces = full.match(/@font-face\s*\{[^}]+\}/g) || [];
console.log(`link hrefs: ${links.size}`);
console.log(`@font-face blocks: ${faces.length}`);
for (const f of faces) {
  const fam = /font-family:\s*'([^']+)'/.exec(f)?.[1];
  const w = /font-weight:\s*([^;]+);/.exec(f)?.[1];
  const url = /url\((https:[^)]+)\)/.exec(f)?.[1];
  const ur = /unicode-range:\s*([^;]+);/.exec(f)?.[1];
  console.log(`${fam} w=${w} url=${url?.split("/").pop()} range=${ur?.slice(0, 40)}...`);
}
await browser.close();
