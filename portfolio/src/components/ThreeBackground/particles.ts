/** Pure data helpers for the nebula particle field. */

export interface NebulaData {
  positions: Float32Array;
  sizes: Float32Array;
  alphas: Float32Array;
  phases: Float32Array;
  speeds: Float32Array;
  pulses: Float32Array;
  colors: Float32Array;
}

/* Warm palette: amber base, cream highlights, light gold */
const PALETTE: ReadonlyArray<[number, number, number]> = [
  [0.831, 0.663, 0.416], // #D4A96A amber
  [0.831, 0.663, 0.416],
  [0.953, 0.89, 0.76], // #F3E3C2 warm cream
  [0.91, 0.757, 0.541], // #E8C18A light gold
];

function randomInSphere(radius: number): [number, number, number] {
  let x = 0;
  let y = 0;
  let z = 0;
  let len = 0;
  while (len < 1e-6) {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    z = Math.random() * 2 - 1;
    len = Math.sqrt(x * x + y * y + z * z);
  }
  const r = radius * Math.cbrt(Math.random());
  return [(x / len) * r, (y / len) * r, (z / len) * r];
}

/**
 * A nebula stretched along the camera's journey (z from +14 to -100),
 * denser around the project constellation so arriving there feels
 * like reaching somewhere.
 */
export function createNebula(count: number): NebulaData {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);
  const pulses = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    if (i % 4 === 0) {
      // cluster around the constellation
      const [cx, cy, cz] = randomInSphere(11);
      positions.set([cx, cy, cz - 40], i * 3);
    } else if (i % 7 === 0) {
      // cluster around the beacon
      const [bx, by, bz] = randomInSphere(8);
      positions.set([bx, by + 1.5, bz - 85], i * 3);
    } else {
      positions.set(
        [
          (Math.random() - 0.5) * 54,
          (Math.random() - 0.5) * 34,
          14 - Math.random() * 114,
        ],
        i * 3
      );
    }

    const anchor = Math.random() < 0.02;
    sizes[i] = anchor ? 6 + Math.random() * 3 : 1.4 + Math.random() * 1.8;
    alphas[i] = anchor ? 0.85 : 0.35 + Math.random() * 0.5;
    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.18 + Math.random() * 0.3;
    pulses[i] = anchor ? 1 : 0;

    const tint = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    colors.set(tint, i * 3);
  }

  return { positions, sizes, alphas, phases, speeds, pulses, colors };
}
