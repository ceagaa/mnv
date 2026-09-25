import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });

const grab = async (url, vw, vh) => {
  const p = await browser.newPage({ viewport: { width: vw, height: vh } });
  await p.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const out = {};
    const cont = [...document.body.children].find((e) => e.children.length >= 12);
    const footer = cont.children[11];
    const nav = footer.querySelector('[class*="navitem"], .w-layout-blockcontainer [class*="navitem"]');
    if (nav) {
      out.nav = [nav.tagName, nav.className].join(" ");
      out.navRect = `${nav.getBoundingClientRect().x.toFixed(1)},${nav.getBoundingClientRect().width.toFixed(1)}`;
      out.navKids = [...nav.children].map((c) => {
        const rc = c.getBoundingClientRect();
        return `${c.tagName.toLowerCase()}.${String(c.className).split(" ").slice(0, 3).join(".")}|x=${rc.x.toFixed(1)}|w=${rc.width.toFixed(1)}|h=${rc.height.toFixed(1)}`;
      });
    } else {
      out.nav = "not found";
      const wrap = footer.querySelector(".footer-content-wrap");
      out.menuKids = wrap ? [...wrap.children].map((c) => `${c.tagName}.${String(c.className).split(" ").slice(0, 4).join(".")}|x=${c.getBoundingClientRect().x.toFixed(1)},w=${c.getBoundingClientRect().width.toFixed(1)},h=${c.getBoundingClientRect().height.toFixed(1)}`) : [];
      const mc = wrap?.children[0];
      if (mc) out.menuKids2 = [...mc.children].map((c) => `${c.tagName}.${String(c.className).split(" ").slice(0, 4).join(".")}|x=${c.getBoundingClientRect().x.toFixed(1)},w=${c.getBoundingClientRect().width.toFixed(1)},h=${c.getBoundingClientRect().height.toFixed(1)}`);
    }
    const hww = cont.children[4];
    const cards = hww.querySelectorAll('[class*="how-we-work-card"]');
    out.cards = [...cards].filter((c) => !/wrapper/.test(c.className)).map((c) => {
      const rc = c.getBoundingClientRect();
      const img = c.querySelector("img");
      const ir = img?.getBoundingClientRect();
      return `card y=${(rc.top + window.scrollY).toFixed(1)} h=${rc.height.toFixed(1)} | img=${ir ? ir.width.toFixed(1) + "x" + ir.height.toFixed(1) : "none"} src=${img?.getAttribute("src")?.slice(-30) ?? "-"}`;
    });
    return out;
  });
  await p.close();
  return r;
};

console.log("== ORIG 375 nav ==");
console.log(JSON.stringify(await grab("https://elevaana.webflow.io/", 375, 812), null, 1));
console.log("== ORIG 1440 hww cards ==");
console.log(JSON.stringify(await grab("https://elevaana.webflow.io/", 1440, 900), null, 1));
await browser.close();
