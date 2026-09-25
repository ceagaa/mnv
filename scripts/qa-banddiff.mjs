import sharp from "sharp";

const [a, b, bandArg, thrArg] = process.argv.slice(2);
if (!a || !b) {
  console.error("usage: node scripts/qa-banddiff.mjs <a.png> <b.png> [band=32] [thr=6]");
  process.exit(1);
}
const BAND = Number(bandArg ?? 32);
const THR = Number(thrArg ?? 6);

const [ra, rb] = await Promise.all([sharp(a).raw().toBuffer({ resolveWithObject: true }), sharp(b).raw().toBuffer({ resolveWithObject: true })]);
const { width: W, height: H, channels: C } = ra.info;
if (rb.info.width !== W || rb.info.height !== H) {
  console.error(`size mismatch: ${W}x${H} vs ${rb.info.width}x${rb.info.height}`);
  process.exit(1);
}
const A = ra.data;
const B = rb.data;
let total = 0;
let count = 0;
const bands = [];
for (let y = 0; y < H; y++) {
  let sum = 0;
  const yEnd = Math.min(y + BAND, H);
  for (let yy = y; yy < yEnd; yy++) {
    let i = yy * W * C;
    for (let x = 0; x < W; x++, i += C) {
      const d = Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]);
      sum += d / 3;
      count++;
    }
  }
  total += sum;
  bands.push({ y, mean: sum / ((yEnd - y) * W) });
}
console.log(`overall mean diff: ${(total / count).toFixed(2)} over ${W}x${H}`);
let run = null;
const hot = [];
for (const b of bands) {
  if (b.mean > THR) {
    if (!run || b.y !== run.y1 + 1) {
      run = { y0: b.y, y1: b.y + BAND - 1, max: b.mean };
      hot.push(run);
    } else {
      run.y1 = b.y + BAND - 1;
    }
    run.max = Math.max(run.max, b.mean);
  } else {
    run = null;
  }
}
console.log(`hot ranges (>${THR}):`);
for (const r of hot) console.log(`  y${r.y0}-${r.y1} max ${r.max.toFixed(1)}`);
