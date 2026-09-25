import sharp from "sharp";

const [aPath, bPath, y0s, y1s] = process.argv.slice(2);
const y0 = Number(y0s);
const y1 = Number(y1s);

async function cols(p) {
  const { data, info } = await sharp(p)
    .extract({ left: 0, top: y0, width: 1440, height: y1 - y0 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = new Array(1440).fill(0);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < 1440; x++) {
      const i = (y * 1440 + x) * info.channels;
      const a = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      out[x] += a;
    }
  }
  return out.map((v) => v / info.height);
}

const a = await cols(aPath);
const b = await cols(bPath);
const d = a.map((v, i) => v - b[i]);
// print segments where |d| > 1
let seg = null;
const segs = [];
for (let x = 0; x < 1440; x++) {
  if (Math.abs(d[x]) > 1) {
    if (!seg) seg = { x0: x, x1: x, peak: 0, pv: 0 };
    seg.x1 = x;
    if (Math.abs(d[x]) > Math.abs(seg.pv)) {
      seg.pv = d[x];
      seg.peak = x;
    }
  } else if (seg && x - seg.x1 > 4) {
    segs.push(seg);
    seg = null;
  }
}
if (seg) segs.push(seg);
for (const s of segs)
  console.log(
    `x${s.x0}-${s.x1} peak@${s.peak} signed(orig-clone)=${s.pv.toFixed(1)}`,
  );
