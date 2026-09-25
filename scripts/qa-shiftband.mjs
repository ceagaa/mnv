import sharp from "sharp";

const [aPath, bPath, y0s, y1s] = process.argv.slice(2);
const y0 = Number(y0s);
const y1 = Number(y1s);

async function prof(p) {
  const meta = await sharp(p).metadata();
  const W = meta.width;
  const { data, info } = await sharp(p)
    .extract({ left: 0, top: y0, width: W, height: y1 - y0 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const cols = new Array(W).fill(0);
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * info.channels;
      cols[x] += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
  }
  return cols.map((v) => v / info.height);
}

const a = await prof(aPath); // orig
const b = await prof(bPath); // clone
const W = a.length;
let best = null;
for (let d = -W; d <= W; d++) {
  let sum = 0;
  let n = 0;
  for (let x = 0; x < W; x++) {
    const xx = x + d;
    if (xx < 0 || xx >= W) continue;
    sum += Math.abs(b[xx] - a[x]);
    n++;
  }
  if (n > W * 0.35) {
    const m = sum / n;
    if (!best || m < best.m) best = { d, m };
  }
}
console.log(
  "best shift d(clone x+d == orig x):",
  best.d,
  "mean:",
  best.m.toFixed(3),
  "=> shift clone LEFT by",
  best.d,
  "px",
);
