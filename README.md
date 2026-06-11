# Abdullah Sayed — Portfolio

A single-page portfolio built as a **scroll-driven journey through a 3D universe**. The camera flies through a warm particle nebula, arrives at a constellation of project "planets" (zooming into each one as its card opens), banks along a 3D timeline of the 42 Abu Dhabi journey, and ends at a pulsing beacon.

**Live site:** https://abdullahsayed038.github.io <!-- update if hosted elsewhere -->

## Features

- **Camera journey** — scroll scrubs the camera along a Catmull-Rom path through one continuous Three.js scene; each page section is a chapter, mapped to real DOM offsets so the camera arrives exactly as its section enters view
- **Per-project zoom** — the work section is a pinned scroll stage: the camera flies to each project node, holds while its card fades in beside it, then continues to the next
- **Drag to orbit** — mouse drags orbit the camera around its focal point with inertia (yaw + pitch); on touch, horizontal swipes orbit while vertical swipes keep native scrolling
- **Living scene** — 2,400 GPU-animated particles (drift + twinkle in the vertex shader, zero per-frame CPU), glowing wireframe project nodes with canvas-rendered labels, constellation lines, a 3D timeline path, and a beacon
- **Fluid scaling** — rem-based design with a viewport-scaled root font-size, so the whole UI shrinks smoothly on small screens; camera side-framing blends back to center below ~1100px
- **Accessible** — full `prefers-reduced-motion` support (static scene, instant reveals), keyboard-focus styles, semantic markup

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | React 18 + Vite (TypeScript, strict) |
| 3D | Three.js via @react-three/fiber |
| Animation | @react-spring/web, react-intersection-observer |
| Styling | CSS Modules only — all values via CSS custom properties |
| Icons | lucide-react |
| Hosting | GitHub Pages (via GitHub Actions) — no backend |

## Getting started

```bash
make            # install dependencies + start the dev server (localhost:5173)
make build      # production build → dist/
make preview    # build + serve the production bundle locally
```

Or with npm directly: `npm install`, `npm run dev`, `npm run build`.

## Deploying to GitHub Pages

This repo ships with a workflow (`.github/workflows/deploy.yml`) that builds and deploys on every push to `main`.

1. Push this project to a GitHub repository (either `AbdullahSayed038.github.io` for the root domain, or any repo name for `…github.io/<repo>/` — the build uses relative paths, so both work).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The action builds and publishes automatically; the URL appears in the workflow summary.

## Project structure

```
src/
├── components/
│   ├── ThreeBackground/   # the 3D world
│   │   ├── path.ts            # camera waypoints, zoom sub-path, scroll mapping
│   │   ├── CameraRig.tsx      # scroll-driven flight + drag-to-orbit
│   │   ├── ParticleField.tsx  # GPU nebula (custom shader)
│   │   ├── ProjectNodes.tsx   # project "planets" + labels + lines
│   │   ├── TimelinePath.tsx   # 3D journey timeline
│   │   └── Beacon.tsx         # the destination star
│   ├── Nav/  Hero/  Bio/  Projects/  Journey/  Skills/  Contact/
├── data/projects.ts       # all project content, typed
├── hooks/useReveal.ts     # scroll-reveal spring
└── styles/variables.css   # design tokens (colors, fonts, fluid scaling)
```

## Tuning the experience

- **Camera flight**: waypoints + look targets in `path.ts` (`CAM_POINTS`, `LOOK_POINTS`)
- **Zoom dwell time per project**: travel/hold split in `workParam()` (`path.ts`), card fade windows in `Projects.tsx`
- **Scroll feel**: smoothing factors in `CameraRig.tsx` (`dt * 3` / `dt * 5` — higher = snappier)
- **Colors & type**: every token in `styles/variables.css`
- **Content**: projects in `data/projects.ts`; the CV served by the download buttons is `public/cv.pdf`
