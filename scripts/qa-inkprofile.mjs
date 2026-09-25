import sharp from "sharp";

const [a, b, y0Arg, y1Arg, modeArg] = process.argv.slice(2);
const Y0 = Number(y0Arg);
const Y1 = Number(y1Arg);
const BRIGHT = modeArg === "bright";
if (!a || !b || Number.isNaN(Y0) || Number.isNaN(Y1)) {
  console.error('usage: node scripts/qa-inkprofile.mjs <a.png> <b.png> <y0> <y1> [dark|bright]');
  process.exit(1);
}

const load = async (f) => sharp(f).raw().toBuffer({ resolveWithObject: true });
const [ra, rb] = await Promise.all([load(a), load(b)]);
const W = ra.info.width;
const C = ra.info.channels;

const test = (r, i) => {
  const br = (r.data[i] + r.data[i + 1] + r.data[i + 2]) / 3;
  return BRIGHT ? br > 200 : br < 140;
};

const ink = (r, x0, x1, y0, y1) => {
  // count "ink" pixels
  let n = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * W + x) * C;
      if (test(r, i)) n++;
    }
  }
  return n;
};

const bbox = (r, x0, x1, y0, y1) => {
  let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * W + x) * C;
      if (test(r, i)) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return maxX < 0 ? null : { minX, maxX, minY, maxY };
};

// row ink profile (per y): count per row for each side
console.log(`== ink rows y${Y0}..${Y1} (orig | clone), sample x0..${W}`);
let activeO = false, activeC = false, segO = null, segC = null;
const segsO = [], segsC = [];
for (let y = Y0; y <= Y1; y++) {
  const io = ink(ra, 0, W, y, y);
  const ic = ink(rb, 0, W, y, y);
  if (io > 3 && !activeO) { activeO = true; segO = [y, y, io]; }
  if (io > 3 && activeO) { segO[1] = y; segO[2] += io; }
  if (io <= 3 && activeO) { activeO = false; segsO.push(segO); segO = null; }
  if (ic > 3 && !activeC) { activeC = true; segC = [y, y, ic]; }
  if (ic > 3 && activeC) { segC[1] = y; segC[2] += ic; }
  if (ic <= 3 && activeC) { activeC = false; segsC.push(segC); segC = null; }
}
if (segO) segsO.push(segO);
if (segC) segsC.push(segC);
console.log("orig text bands:", segsO.map((s) => `y${s[0]}-${s[1]}(ink ${s[2]})`).join(" "));
console.log("clone text bands:", segsC.map((s) => `y${s[0]}-${s[1]}(ink ${s[2]})`).join(" "));

// per-band bboxes
const n = Math.min(segsO.length, segsC.length);
for (let i = 0; i < n; i++) {
  const bo = bbox(ra, 0, W, segsO[i][0], segsO[i][1]);
  const bc = bbox(rb, 0, W, segsC[i][0], segsC[i][1]);
  console.log(`band${i}: orig x${bo.minX}-${bo.maxX} y${bo.minY}-${bo.maxY} | clone x${bc.minX}-${bc.maxX} y${bc.minY}-${bc.maxY}`);
}

// column ink profile diff for whole range (where horizontally does it differ)
console.log("== column diff hotspots (x where |origInk-cloneInk|>40 in y-range)");
let runs = [];
for (let x = 0; x < W; x += 8) {
  const io = ink(ra, x, Math.min(x + 8, W), Y0, Y1);
  const ic = ink(rb, x, Math.min(x + 8, W), Y0, Y1);
  const d = Math.abs(io - ic);
  if (d > 40) runs.push(`x${x}(${io}vs${ic})`);
}
console.log(runs.slice(0, 40).join(" "));
