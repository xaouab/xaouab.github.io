// src/scene/planetSurfaces.ts
//
// Procedural, stylised planet surfaces. Everything is painted into canvas
// textures at startup from seeded 3D noise sampled on the sphere (so there is
// no seam at the date line), then posterised into a few flat bands for a
// hand-painted, game-like look.
import { CanvasTexture, Color, RepeatWrapping, SRGBColorSpace } from 'three';

export type PlanetStyle = 'dunes' | 'cratered' | 'gas' | 'crystal' | 'ice';

const W = 1024;
const H = 512;

// ---- Noise ------------------------------------------------------------------

const hash = (x: number, y: number, z: number, seed: number) => {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647 + seed * 144269504) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

const fade = (t: number) => t * t * (3 - 2 * t);

function valueNoise(x: number, y: number, z: number, seed: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  let out = 0;
  for (let dz = 0; dz <= 1; dz++)
    for (let dy = 0; dy <= 1; dy++)
      for (let dx = 0; dx <= 1; dx++) {
        const w = (dx ? xf : 1 - xf) * (dy ? yf : 1 - yf) * (dz ? zf : 1 - zf);
        out += w * hash(xi + dx, yi + dy, zi + dz, seed);
      }
  return out;
}

function fbm(x: number, y: number, z: number, seed: number, octaves = 5) {
  let sum = 0, amp = 0.5, freq = 1, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq, z * freq, seed + i * 17);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// ---- Painting helpers ---------------------------------------------------------

/** Snap 0..1 to `steps` flat bands: the posterised, painted look. */
const band = (v: number, steps: number) => Math.min(steps - 1, Math.floor(Math.max(0, v) * steps)) / (steps - 1);

const shade = (base: Color, amount: number) =>
  amount >= 0 ? base.clone().lerp(new Color('#ffffff'), amount) : base.clone().lerp(new Color('#0b0b14'), -amount);

/** Sample a list of colors at 0..1 without blending (hard bands). */
const pick = (ramp: Color[], t: number) => ramp[Math.min(ramp.length - 1, Math.floor(t * ramp.length))];

function paint(fill: (x: number, y: number, z: number, lat: number, out: Color) => number | void) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(W, H);
  const c = new Color();
  for (let py = 0; py < H; py++) {
    const lat = (0.5 - (py + 0.5) / H) * Math.PI;
    const cl = Math.cos(lat), sl = Math.sin(lat);
    for (let px = 0; px < W; px++) {
      const lon = ((px + 0.5) / W) * Math.PI * 2;
      const alpha = fill(cl * Math.cos(lon), sl, cl * Math.sin(lon), lat, c);
      const i = (py * W + px) * 4;
      img.data[i] = c.r * 255;
      img.data[i + 1] = c.g * 255;
      img.data[i + 2] = c.b * 255;
      img.data[i + 3] = alpha === undefined ? 255 : alpha * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

// ---- Surfaces -------------------------------------------------------------------

/** Floor and rim edges stored as cosines, so the per-pixel test is a single dot product. */
interface Crater { x: number; y: number; z: number; floor: number; rim: number }

function craters(count: number, seed: number, min: number, max: number): Crater[] {
  const rand = mulberry(seed);
  return Array.from({ length: count }, () => {
    const u = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = min + rand() * (max - min);
    return { x: s * Math.cos(t), y: u, z: s * Math.sin(t), floor: Math.cos(r * 0.8), rim: Math.cos(r * 1.05) };
  });
}

/** -1 inside a crater floor, +1 on its rim, 0 elsewhere. */
function craterField(list: Crater[], x: number, y: number, z: number) {
  let v = 0;
  for (const c of list) {
    const dot = x * c.x + y * c.y + z * c.z;
    if (dot > c.floor) v = Math.min(v, -1);
    else if (dot > c.rim) v = Math.max(v, 1);
  }
  return v;
}

const builders: Record<PlanetStyle, (base: Color) => CanvasTexture> = {
  dunes: (base) => {
    const ramp = [shade(base, -0.55), shade(base, -0.3), shade(base, -0.1), base, shade(base, 0.25)];
    return paint((x, y, z, lat, out) => {
      const n = fbm(x * 2.2, y * 2.2, z * 2.2, 3);
      const ridges = Math.sin((y + n * 0.9) * 22) * 0.5 + 0.5;
      out.copy(pick(ramp, band(n * 0.75 + ridges * 0.25, 5)));
      // Polar caps with a ragged, noisy edge.
      if (Math.abs(lat) > 1.18 + (n - 0.5) * 0.35) out.copy(shade(base, 0.82));
    });
  },

  cratered: (base) => {
    const big = craters(26, 11, 0.12, 0.32);
    const small = craters(90, 23, 0.03, 0.09);
    const ramp = [shade(base, -0.6), shade(base, -0.38), shade(base, -0.18), base];
    return paint((x, y, z, _lat, out) => {
      const n = fbm(x * 3, y * 3, z * 3, 7);
      let level = band(n, 4);
      const crater = craterField(big, x, y, z) || craterField(small, x, y, z);
      if (crater < 0) level = Math.max(0, level - 0.5);
      out.copy(pick(ramp, level));
      if (crater > 0) out.copy(shade(base, 0.3));
    });
  },

  gas: (base) => {
    const ramp = [shade(base, -0.45), shade(base, 0.35), shade(base, -0.15), shade(base, 0.6), base, shade(base, -0.3)];
    return paint((x, y, z, lat, out) => {
      const warp = fbm(x * 2.5, y * 6, z * 2.5, 5) - 0.5;
      const bandT = (Math.sin(lat * 9 + warp * 3.2) * 0.5 + 0.5) * 0.7 + (lat / Math.PI + 0.5) * 0.3;
      out.copy(pick(ramp, band(bandT, 6)));
      // Great storm: an elliptical eye in the southern bands.
      const sx = (Math.atan2(z, x) - 1.1) / 0.32;
      const sy = (lat + 0.38) / 0.12;
      const d = sx * sx + sy * sy;
      if (d < 1) out.copy(d < 0.35 ? shade(base, -0.55) : shade(base, 0.7));
    });
  },

  crystal: (base) => {
    const ramp = [shade(base, -0.55), shade(base, -0.25), base, shade(base, 0.3)];
    return paint((x, y, z, _lat, out) => {
      const n = fbm(x * 2.6, y * 2.6, z * 2.6, 13);
      out.copy(pick(ramp, band(n, 4)));
      // Bright veins along the noise's mid contour.
      if (Math.abs(fbm(x * 4, y * 4, z * 4, 29) - 0.5) < 0.018) out.copy(shade(base, 0.85));
    });
  },

  ice: (base) => {
    const ramp = [shade(base, -0.25), shade(base, 0.1), shade(base, 0.4), shade(base, 0.7)];
    return paint((x, y, z, _lat, out) => {
      const n = fbm(x * 2.4, y * 2.4, z * 2.4, 19);
      out.copy(pick(ramp, band(n, 4)));
      // Pressure cracks.
      if (Math.abs(fbm(x * 5, y * 5, z * 5, 41) - 0.5) < 0.014) out.copy(shade(base, -0.5));
    });
  },
};

const cache = new Map<string, CanvasTexture>();

export function planetSurface(style: PlanetStyle, color: string) {
  const key = `${style}:${color}`;
  let tex = cache.get(key);
  if (!tex) {
    tex = builders[style](new Color(color));
    cache.set(key, tex);
  }
  return tex;
}

/** Wispy cloud layer: white with alpha. */
export function cloudLayer() {
  let tex = cache.get('clouds');
  if (!tex) {
    tex = paint((x, y, z, _lat, out) => {
      out.set('#ffffff');
      const n = fbm(x * 3, y * 5, z * 3, 61);
      return n > 0.62 ? 0.8 : n > 0.59 ? 0.35 : 0;
    });
    cache.set('clouds', tex);
  }
  return tex;
}

/** Radial ring bands: u runs from the inner to the outer edge. */
export function ringBands(color: string) {
  const key = `ring:${color}`;
  let tex = cache.get(key);
  if (!tex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    const rand = mulberry(97);
    const base = new Color(color);
    let x = 0;
    while (x < 256) {
      const w = 4 + Math.floor(rand() * 22);
      const c = shade(base, rand() * 0.9 - 0.45);
      const gap = rand() < 0.22;
      ctx.fillStyle = `rgba(${c.r * 255 | 0}, ${c.g * 255 | 0}, ${c.b * 255 | 0}, ${gap ? 0.08 : 0.55 + rand() * 0.4})`;
      ctx.fillRect(x, 0, w, 1);
      x += w;
    }
    tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    cache.set(key, tex);
  }
  return tex;
}
