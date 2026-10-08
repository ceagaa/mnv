import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Applies the pending upstream fix from opennextjs/opennextjs-cloudflare#1356:
// Next.js 16.4 loads `.next/server/preview-props.json` unconditionally, but the
// loadManifest patch only inlines `*-manifest`, `required-server-files` and
// `prefetch-hints` files, so the worker throws on every request (Error 1101).
// Remove this script once @opennextjs/cloudflare ships the fix in a release.

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(
  root,
  "node_modules",
  "@opennextjs",
  "cloudflare",
  "dist",
  "cli",
  "build",
  "patches",
  "plugins",
  "load-manifest.js",
);

const from = "{*-manifest,required-server-files,prefetch-hints}.json";
const to = "{*-manifest,required-server-files,prefetch-hints,preview-props}.json";

if (!existsSync(target)) {
  console.warn(`[patch-opennext] load-manifest.js not found at ${target} — skipping.`);
  process.exit(0);
}

const content = readFileSync(target, "utf8");

if (content.includes(to)) {
  console.log("[patch-opennext] preview-props patch already applied.");
  process.exit(0);
}

if (!content.includes(from)) {
  console.warn(
    "[patch-opennext] glob pattern not found — @opennextjs/cloudflare may already include the fix or has changed. Skipping.",
  );
  process.exit(0);
}

writeFileSync(target, content.replaceAll(from, to), "utf8");
console.log("[patch-opennext] Applied preview-props.json inlining patch (upstream #1356).");
