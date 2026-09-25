import fs from "node:fs";
import path from "node:path";

const css = fs.readFileSync("docs/design-references/orig-fonts.css", "utf8");
const dir = "public/fonts";
fs.mkdirSync(dir, { recursive: true });

const urls = [...new Set((css.match(/url\((https:[^)]+)\)/g) || []).map((s) => s.slice(4, -1)))];
const map = new Map();
for (const u of urls) {
  const base = u.split("/").pop();
  const res = await fetch(u);
  if (!res.ok) throw new Error(`${u} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, "_");
  fs.writeFileSync(path.join(dir, safe), buf);
  map.set(u, `/fonts/${safe}`);
  console.log(`${safe} ${buf.length}b`);
}

let out = css.replace(/url\((https:[^)]+)\)/g, (m, u) => `url(${map.get(u) ?? u})`);
out = out.replace(/\/\*[^*]*\*\//g, "").replace(/\n{2,}/g, "\n").trim();
fs.writeFileSync("docs/design-references/orig-fonts-local.css", out + "\n");
console.log(`\nrewrote ${map.size} urls, css ${out.length}b`);
