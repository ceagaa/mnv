import sharp from "sharp";

const [aPath, bPath] = process.argv.slice(2);

async function load(p) {
  const { data, info } = await sharp(p)
    .extract({ left: 640, top: 7260, width: 620, height: 210 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

const A = await load(aPath);
const B = await load(bPath);
const W = 620;
const H = 210;
const ch = A.info.channels;

// per-row mean |delta|
for (let y = 0; y < H; y++) {
  let s = 0;
  let max = 0;
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * ch;
    const a = 0.299 * A.data[i] + 0.587 * A.data[i + 1] + 0.114 * A.data[i + 2];
    const b = 0.299 * B.data[i] + 0.587 * B.data[i + 1] + 0.114 * B.data[i + 2];
    const d = Math.abs(a - b);
    s += d;
    if (d > max) max = d;
  }
  const m = s / W;
  if (m > 0.5) console.log(`y${7260 + y} mean|d|=${m.toFixed(2)} max=${max.toFixed(0)}`);
}
