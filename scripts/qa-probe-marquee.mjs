import { chromium } from "playwright";

const base = process.env.QA_URL ?? "https://elevaana.webflow.io/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1500);

const probe = async (label) => {
  const info = await page.evaluate(() => {
    const cands = [...document.querySelectorAll("section")].filter((s) =>
      (s.textContent || "").includes("(416) 555-0192"),
    );
    cands.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
    const sec = cands[0];
    if (!sec) return "no section";
    const out = { sec: { cls: (sec.className || "").toString().slice(0, 60) } };
    const walk = (el, d, arr) => {
      if (d > 4) return;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      arr.push({
        d,
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 50),
        x: +r.x.toFixed(2),
        anim: cs.animationName + " " + cs.animationDuration + " " + cs.animationTimingFunction + " delay:" + cs.animationDelay + " state:" + cs.animationPlayState,
        transform: cs.transform,
        txt: (el.childElementCount === 0 ? (el.textContent || "").trim().slice(0, 30) : ""),
      });
      for (const c of el.children) walk(c, d + 1, arr);
    };
    out.tree = [];
    walk(sec, 0, out.tree);
    return out;
  });
  console.log("== " + label);
  console.log(JSON.stringify(info, null, 1));
};

await probe("scrollY " + (await page.evaluate(() => window.scrollY)));
await page.evaluate(() => window.scrollTo({ top: 8908, behavior: "instant" }));
await page.waitForTimeout(1500);
await probe("scrollY 8908");
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(1500);
await probe("back to 0");
await browser.close();
