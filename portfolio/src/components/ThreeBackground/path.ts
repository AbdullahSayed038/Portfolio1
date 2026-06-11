import * as THREE from 'three';

/**
 * The site is a camera journey through one continuous 3D scene.
 * Six chapter waypoints (hero → end), plus a sub-path inside the work
 * chapter that zooms into each project node one by one, holding while
 * that project's card is open.
 */

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const CONSTELLATION_CENTER = v(0, 0, -40);
export const BEACON_POSITION = v(0, 1.5, -85);

/** Project node positions, local to the constellation center */
export const NODE_LOCAL: ReadonlyArray<[number, number, number]> = [
  [0, 3.4, 2.5], // mynet
  [6.2, -0.8, 0.5], // Aboudi OS
  [-6.2, 1.4, -0.5], // AISEE
  [3.6, -3.8, -2.5], // dr-quine
  [-3.4, -3.4, 2], // ft_transcendence
];

/** Camera positions per chapter (hero → end) */
const CAM_POINTS = [
  v(0, 0, 8), // hero — inside the nebula
  v(0, 0.5, -12), // about — flying forward
  v(0, 1.5, -23), // work — constellation framed screen-right
  v(-7, 1.5, -47), // journey — timeline framed screen-left
  v(3, 3.5, -70), // contact — approaching the beacon
  v(0, 2, -78), // end — final approach
];

/** Where the camera looks per chapter */
const LOOK_POINTS = [
  v(0, 0, -20),
  v(2.5, 0.5, -38),
  v(-5, 0, -40), // looking left of center → constellation appears right
  v(5, 0.5, -58), // looking right of center → timeline appears left
  v(0, 1.5, -85),
  v(0, 1.5, -85),
];

/* getPoint(i / (n-1)) passes exactly through control point i. */
export const cameraCurve = new THREE.CatmullRomCurve3(CAM_POINTS, false, 'catmullrom', 0.35);
export const lookCurve = new THREE.CatmullRomCurve3(LOOK_POINTS, false, 'catmullrom', 0.35);

/* ---- Work chapter sub-path: zoom into each node ---- */

const nodeWorld = NODE_LOCAL.map(([x, y, z]) =>
  v(x + CONSTELLATION_CENTER.x, y + CONSTELLATION_CENTER.y, z + CONSTELLATION_CENTER.z)
);

/* Camera hovers front-left-above each node; node framed screen-right
   so the project card has the left half. Entry/exit match the main curve. */
export const workCamCurve = new THREE.CatmullRomCurve3(
  [CAM_POINTS[2], ...nodeWorld.map((n) => v(n.x - 1.8, n.y + 0.8, n.z + 4.4)), CAM_POINTS[3]],
  false,
  'catmullrom',
  0.3
);
export const workLookCurve = new THREE.CatmullRomCurve3(
  [LOOK_POINTS[2], ...nodeWorld.map((n) => v(n.x - 1.4, n.y, n.z)), LOOK_POINTS[3]],
  false,
  'catmullrom',
  0.3
);


/* Centered variants — on narrow screens there is no open side, so the
   camera blends from side-framing toward these as the viewport shrinks. */
const LOOK_CENTER_POINTS = [
  v(0, 0, -20),
  v(0, 0.5, -38),
  v(0, 0, -40),
  v(0, 0.8, -57),
  v(0, 1.5, -85),
  v(0, 1.5, -85),
];
export const lookCenterCurve = new THREE.CatmullRomCurve3(LOOK_CENTER_POINTS, false, 'catmullrom', 0.35);

export const workLookCenterCurve = new THREE.CatmullRomCurve3(
  [LOOK_CENTER_POINTS[2], ...nodeWorld.map((n) => v(n.x, n.y, n.z)), LOOK_CENTER_POINTS[3]],
  false,
  'catmullrom',
  0.3
);

const ease = (t: number) => t * t * (3 - 2 * t);
const STOPS = [1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6];

/**
 * Map local work progress (0–1) to the sub-path: fly to node i during the
 * first half of its segment, hold while the card is open, then continue.
 */
export function workParam(u: number): number {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  const i = Math.min(4, Math.floor(u * 5));
  const local = u * 5 - i;
  const prev = i === 0 ? 0 : STOPS[i - 1];
  if (i < 4) {
    return local < 0.5 ? prev + (STOPS[i] - prev) * ease(local / 0.5) : STOPS[i];
  }
  if (local < 0.4) return prev + (STOPS[4] - prev) * ease(local / 0.4);
  if (local < 0.7) return STOPS[4];
  return STOPS[4] + (1 - STOPS[4]) * ease((local - 0.7) / 0.3);
}

const SECTION_IDS = ['top', 'about', 'work', 'journey', 'contact'] as const;
const PARAMS = [0, 0.2, 0.4, 0.6, 0.8, 1];

export class ChapterMap {
  anchors: number[] = [0, 0.16, 0.34, 0.62, 0.85, 1];

  measure(): void {
    const max = document.body.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const next = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return 0;
      const top = el.getBoundingClientRect().top + window.scrollY;
      return Math.min(1, Math.max(0, (top - window.innerHeight * 0.45) / max));
    });
    next[0] = 0;
    for (let i = 1; i < next.length; i++) {
      next[i] = Math.max(next[i], next[i - 1] + 0.02);
    }
    this.anchors = [...next, 1];
  }

  curveParam(p: number): number {
    const a = this.anchors;
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    for (let i = 0; i < a.length - 1; i++) {
      if (p <= a[i + 1]) {
        const span = a[i + 1] - a[i];
        const local = span > 0 ? (p - a[i]) / span : 0;
        return PARAMS[i] + (PARAMS[i + 1] - PARAMS[i]) * local;
      }
    }
    return 1;
  }

  workSpan(): [number, number] {
    return [this.anchors[2], this.anchors[3]];
  }
}
