import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const assets = path.join(root, "assets", "img");

const BASE = "http://localhost:3002";
const FONT_HEAD = `${BASE}/fonts/AMOWz4SDuXOMCPfdoglY9JQEVFi3.woff2`;
const FONT_BODY = `${BASE}/fonts/pxiTypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr0SZe1Q.woff2`;

const FONT_CSS = `
@font-face{font-family:'Rethink Sans';src:url('${FONT_HEAD}') format('woff2');font-weight:400 800;font-style:normal;font-display:block}
@font-face{font-family:'Instrument Sans';src:url('${FONT_BODY}') format('woff2');font-weight:400 700;font-style:normal;font-display:block}
`;

const FAVICON_HTML = (radius) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${FONT_CSS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:512px;height:512px;overflow:hidden;background:transparent}
body{display:flex;align-items:center;justify-content:center}
.tile{width:512px;height:512px;border-radius:${radius}px;background:#0C1A3A;display:flex;align-items:center;justify-content:center}
.mark{font-family:'Rethink Sans',sans-serif;font-weight:800;font-size:176px;letter-spacing:-0.045em;color:#FFFFFF;line-height:1}
.dot{color:#D62828}
</style></head>
<body><div class="tile"><div class="mark">MNV<span class="dot">.</span></div></div></body></html>`;

const OG_HTML = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><style>
${FONT_CSS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;font-family:'Instrument Sans',sans-serif;background:#0C1A3A;display:flex;align-items:center;padding:64px 72px 74px}
.glow-a{position:absolute;top:-260px;right:-160px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle,rgba(214,40,40,.42),rgba(214,40,40,0) 68%)}
.glow-b{position:absolute;bottom:-320px;left:-220px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(255,90,82,.16),rgba(255,90,82,0) 70%)}
.bar{position:absolute;left:0;right:0;bottom:0;height:12px;background:linear-gradient(90deg,#D62828,#A01D22)}
.inner{position:relative;z-index:2;display:flex;align-items:center;gap:56px;width:100%}
.left{flex:1;min-width:0;display:flex;flex-direction:column;gap:26px;max-width:680px}
.brand{display:flex;flex-direction:column;gap:6px}
.word{font-family:'Rethink Sans',sans-serif;font-weight:800;font-size:44px;letter-spacing:-0.03em;color:#FFFFFF;line-height:1}
.word span{color:#D62828}
.tag{font-family:'Rethink Sans',sans-serif;font-weight:600;font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:#FF5A52}
h1{font-family:'Rethink Sans',sans-serif;font-weight:700;font-size:47px;line-height:1.14;letter-spacing:-0.02em;color:#FFFFFF}
.sub{font-size:20px;line-height:1.5;color:#B9C2D6;max-width:600px}
.pill{align-self:flex-start;display:inline-flex;align-items:center;gap:10px;background:#D62828;color:#FFFFFF;font-family:'Rethink Sans',sans-serif;font-weight:600;font-size:17px;padding:14px 26px;border-radius:999px}
.pill::before{content:"";width:9px;height:9px;border-radius:50%;background:#FFFFFF}
.thumb{flex:none;width:396px;height:396px;border-radius:28px;overflow:hidden;box-shadow:0 28px 64px rgba(0,0,0,.42);border:1px solid rgba(255,255,255,.14)}
.thumb img{width:100%;height:100%;object-fit:cover;display:block}
</style></head>
<body>
  <div class="glow-a"></div><div class="glow-b"></div>
  <div class="inner">
    <div class="left">
      <div class="brand">
        <div class="word">MNV<span>.</span></div>
        <div class="tag">Segurança contra incêndio</div>
      </div>
      <h1>Segurança contra Incêndio e Pânico no Rio de Janeiro</h1>
      <p class="sub">Legalização, redação de AVCB, vistoria do CBMERJ e alvará do Corpo de Bombeiros.</p>
      <div class="pill">Especialistas em AVCB &middot; Rio de Janeiro</div>
    </div>
    <div class="thumb"><img src="${BASE}/thumb.jpg" alt="" /></div>
  </div>
  <div class="bar"></div>
</body></html>`;

function pngToIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const entries = [];
  let offset = 6 + 16 * count;
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

function out(name, buffer) {
  writeFileSync(path.join(assets, name), buffer);
  writeFileSync(path.join(pub, name), buffer);
}

async function ready(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

async function main() {
  mkdirSync(assets, { recursive: true });
  mkdirSync(pub, { recursive: true });

  const browser = await chromium.launch();
  try {
    const favPage = await browser.newPage({
      viewport: { width: 512, height: 512 },
      deviceScaleFactor: 2,
    });

    await favPage.setContent(FAVICON_HTML(112));
    await ready(favPage);
    const markBox = await favPage.evaluate(() => {
      const r = document.querySelector(".mark").getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    console.log("mark box:", JSON.stringify(markBox));
    const rounded = await favPage.screenshot({ omitBackground: true });
    await favPage.setContent(FAVICON_HTML(0));
    await ready(favPage);
    const square = await favPage.screenshot({ omitBackground: true });

    const round512 = await sharp(rounded).resize(512, 512).png().toBuffer();
    out("icon-512.png", round512);
    out("icon-192.png", await sharp(round512).resize(192, 192).png().toBuffer());
    out("favicon-48.png", await sharp(round512).resize(48, 48).png().toBuffer());
    out("favicon-32.png", await sharp(round512).resize(32, 32).png().toBuffer());
    out("favicon-16.png", await sharp(round512).resize(16, 16).png().toBuffer());

    const square512 = await sharp(square).resize(512, 512).png().toBuffer();
    out("apple-touch-icon.png", await sharp(square512).resize(180, 180).png().toBuffer());

    out(
      "favicon.ico",
      pngToIco([
        { size: 16, data: await sharp(round512).resize(16, 16).png().toBuffer() },
        { size: 32, data: await sharp(round512).resize(32, 32).png().toBuffer() },
        { size: 48, data: await sharp(round512).resize(48, 48).png().toBuffer() },
      ]),
    );

    const ogPage = await browser.newPage({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 2,
    });
    await ogPage.setContent(OG_HTML);
    await ready(ogPage);
    const thumbOk = await ogPage.evaluate(() => {
      const img = document.querySelector(".thumb img");
      return img && img.complete && img.naturalWidth > 0;
    });
    if (!thumbOk) throw new Error("OG thumb image failed to load");
    const og = await ogPage.screenshot();
    out(
      "og-mnv.png",
      await sharp(og).resize(1200, 630).png({ compressionLevel: 9 }).toBuffer(),
    );

    console.log("done");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
