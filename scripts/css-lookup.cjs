const fs = require("fs");
const css = fs.readFileSync("docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2/webflow.css", "utf8");
const targets = process.argv.slice(2);
for (const t of targets) {
  const idx = css.indexOf(t + "{");
  if (idx < 0) { console.log("=== " + t + " NOT FOUND"); continue; }
  const end = css.indexOf("}", idx);
  console.log("=== " + t);
  console.log(css.slice(idx, end + 1));
}
