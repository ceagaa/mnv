const fs = require("fs");
const path = require("path");

const man = JSON.parse(
  fs.readFileSync(
    "docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2/ASSET_MANIFEST.json",
    "utf8"
  )
);

const map = {};
for (const m of man) {
  if (m.status === "failed") continue;
  const u = new URL(m.url);
  const base = decodeURIComponent(path.basename(u.pathname))
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
  let key = base.replace(/\.[a-z0-9]{2,5}$/i, "");
  key = key.replace(/^[0-9a-f]{12}_/, "").replace(/^\d+-/, "");
  let k = key;
  let n = 2;
  while (map[k] && map[k] !== m.file) k = key + "-" + n++;
  map[k] = m.file;
}
map["hero-background"] =
  "public/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/hero-bg-692fd2dc.png";

const lines = Object.entries(map)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([k, v]) => `  ${JSON.stringify(k)}: "/${v.replace(/^public[\\/]/, "").replace(/\\/g, "/")}",`);

fs.writeFileSync(
  "src/components/sites/elevaana-webflow-io-f5aaaf30/shared/assets.ts",
  `// Downloaded source assets for elevaana.webflow.io (keys are original asset names)
export const ASSETS = {
${lines.join("\n")}
} as const;

export type AssetKey = keyof typeof ASSETS;
`
);
console.log("entries", lines.length);
