import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve("docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2");
const OUT_IMG = path.resolve("public/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images");
const OUT_VID = path.resolve("public/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/videos");
fs.mkdirSync(OUT_IMG, { recursive: true });
fs.mkdirSync(OUT_VID, { recursive: true });

const assets = JSON.parse(fs.readFileSync(path.join(ROOT, "ASSETS.json"), "utf8"));

function safeName(url) {
  const u = new URL(url);
  let base = decodeURIComponent(path.basename(u.pathname));
  base = base.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
  if (!/\.[a-z0-9]{2,5}$/i.test(base)) base += ".png";
  const h = crypto.createHash("sha256").update(url).digest("hex").slice(0, 6);
  const ext = path.extname(base);
  const stem = base.slice(0, base.length - ext.length).slice(0, 60);
  return `${stem}-${h}${ext}`;
}

const manifest = [];
const items = [];

for (const img of assets.imgs) {
  if (!img.src || img.src.startsWith("data:")) continue;
  items.push({ url: img.src, dir: OUT_IMG });
}
for (const v of assets.vids) {
  if (v.src && !v.src.startsWith("data:")) items.push({ url: v.src, dir: OUT_VID });
  if (v.poster) {
    const m = /url\(["']?(.*?)["']?\)/.exec(v.poster);
    if (m) items.push({ url: m[1], dir: OUT_VID });
  }
}
for (const bg of assets.bgs) {
  const m = /url\(["']?(.*?)["']?\)/.exec(bg.url);
  if (m && !m[1].startsWith("data:")) items.push({ url: m[1], dir: OUT_IMG });
}
// favicons / webclip / og image
const extra = [
  "https://cdn.prod.website-files.com/692fd2dc4d63bf298d8f8389/69392c7083db23b54b50d439_favicon.png",
  "https://cdn.prod.website-files.com/692fd2dc4d63bf298d8f8389/69392c755769a4de787a2264_Webclip.png",
  "https://cdn.prod.website-files.com/692fd2dc4d63bf298d8f8389/692fefb8570f01684d2fd241_Home%20(7).png",
];
for (const u of extra) items.push({ url: u, dir: path.resolve("public/seo") });
fs.mkdirSync(path.resolve("public/seo"), { recursive: true });

const seen = new Set();
const queue = items.filter((i) => {
  if (seen.has(i.url)) return false;
  seen.add(i.url);
  return true;
});

async function worker() {
  while (queue.length) {
    const item = queue.shift();
    if (!item) break;
    const name = safeName(item.url);
    const dest = path.join(item.dir, name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      manifest.push({ url: item.url, file: path.relative(process.cwd(), dest), status: "cached" });
      continue;
    }
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        const res = await fetch(item.url, { headers: { "user-agent": "Mozilla/5.0" } });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
        manifest.push({ url: item.url, file: path.relative(process.cwd(), dest), bytes: buf.length, status: "ok" });
        ok = true;
      } catch (e) {
        if (attempt === 2) manifest.push({ url: item.url, status: "failed", error: String(e.message || e) });
        else await new Promise((r) => setTimeout(r, 500));
      }
    }
  }
}

await Promise.all([worker(), worker(), worker(), worker()]);
fs.writeFileSync(path.join(ROOT, "ASSET_MANIFEST.json"), JSON.stringify(manifest, null, 2));
const ok = manifest.filter((m) => m.status === "ok" || m.status === "cached").length;
const bad = manifest.filter((m) => m.status === "failed");
console.log(`downloaded=${ok} failed=${bad.length}`);
bad.forEach((b) => console.log("FAILED", b.url, b.error));
