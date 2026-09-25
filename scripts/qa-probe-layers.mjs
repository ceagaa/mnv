import { chromium } from "playwright";

const url = process.env.QA_URL ?? "http://localhost:3199/";
const tag = process.env.QA_TAG ?? "clone";

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
for (let i = 0; i < 5; i++) {
  await page.evaluate(() => window.scrollTo({ top: 7200, behavior: "instant" }));
  await page.waitForTimeout(700);
  if ((await page.evaluate(() => window.scrollY)) === 7200) break;
}
await page.waitForTimeout(2500);

const cdp = await context.newCDPSession(page);
await cdp.send("DOM.enable");
await cdp.send("LayerTree.enable");

const { root } = await cdp.send("DOM.getDocument");
const { nodeId } = await cdp.send("DOM.querySelector", {
  nodeId: root.nodeId,
  selector: "h2",
});
const { node } = await cdp.send("DOM.describeNode", { nodeId });
console.log(`${tag} h2 backendNodeId=${node.backendNodeId}`);

const layers = await new Promise((resolve) => {
  const seen = [];
  const onLt = (e) => {
    seen.push(...e.layers);
  };
  cdp.on("LayerTree.layerTreeDidChange", onLt);
  setTimeout(() => {
    cdp.off("LayerTree.layerTreeDidChange", onLt);
    resolve(seen);
  }, 1500);
});

const hit = layers.filter((l) => l.backendNodeId === node.backendNodeId);
console.log(`${tag} layers matching h2: ${hit.length}`);
hit.forEach((l) => console.log(`  id=${l.layerId} ${l.width}x${l.height} offset=${l.offsetX},${l.offsetY} paints=${l.paintCount}`));
console.log(`${tag} total layers: ${layers.length}`);
layers.forEach((l) => {
  if (l.backendNodeId && l.backendNodeId !== node.backendNodeId && l.width > 400 && l.height > 40 && l.height < 300)
    console.log(`  other id=${l.layerId} node=${l.backendNodeId} ${l.width}x${l.height} offset=${l.offsetX},${l.offsetY}`);
});

await browser.close();
