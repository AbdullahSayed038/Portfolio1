import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  cameraCurve,
  lookCurve,
  lookCenterCurve,
  workCamCurve,
  workLookCurve,
  workLookCenterCurve,
  workParam,
  ChapterMap,
} from './path';
import { useScrollProgress } from './useScrollProgress';

interface CameraRigProps {
  reducedMotion: boolean;
  chapterMap: MutableRefObject<ChapterMap>;
}

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const tmpOffset = new THREE.Vector3();
const tmpRight = new THREE.Vector3();
const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();
const tmpLookCenter = new THREE.Vector3();

/**
 * Scroll drives the camera along a curve through the scene;
 * dragging with the mouse orbits the camera around its current
 * focal point (with inertia), so you can look around at any chapter.
 */
export default function CameraRig({ reducedMotion, chapterMap }: CameraRigProps) {
  const scrollRef = useScrollProgress();
  const camera = useThree((s) => s.camera);
  const drag = useRef({ active: false, touch: false, lastX: 0, lastY: 0, yaw: 0, pitch: 0, yawVel: 0, pitchVel: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({
    param: 0,
    pos: new THREE.Vector3(0, 0, 8),
    look: new THREE.Vector3(0, 0, -20),
  });

  // Pointer drag → orbit. Mouse drags orbit freely; touch drags orbit on
  // horizontal movement only, so vertical swipes keep native scrolling.
  useEffect(() => {
    if (reducedMotion) return;
    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element && t.closest('a, button, input, textarea, select') !== null;

    const down = (e: PointerEvent) => {
      if (e.button !== 0 || isInteractive(e.target)) return;
      const d = drag.current;
      d.active = true;
      d.touch = e.pointerType === 'touch';
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      if (!d.touch) document.body.classList.add('dragging');
    };
    const move = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.yawVel = -dx * (d.touch ? 0.0045 : 0.0035);
      d.yaw += d.yawVel;
      if (!d.touch) {
        d.pitchVel = -dy * 0.0025;
        d.pitch += d.pitchVel;
      }
    };
    const up = () => {
      drag.current.active = false;
      document.body.classList.remove('dragging');
    };

    window.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [reducedMotion]);

  // Reduced motion: a static framing of the constellation
  useEffect(() => {
    if (!reducedMotion) return;
    camera.position.set(0, 1.5, -27);
    camera.lookAt(0, 0, -40);
  }, [reducedMotion, camera]);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const d = drag.current;
    const s = smooth.current;
    const dt = Math.min(delta, 0.05);

    // Scroll → eased position along the journey; inside the work chapter
    // the camera follows the zoom sub-path from node to node instead.
    const map = chapterMap.current;
    const p = scrollRef.current;
    const [wa, wb] = map.workSpan();
    // Side-framing fades out as the viewport narrows (no open side on mobile)
    const sideFrame = Math.min(1, Math.max(0, (state.size.width - 760) / 340));
    if (p > wa && p < wb && wb - wa > 1e-4) {
      const u = (p - wa) / (wb - wa);
      const wp = workParam(u);
      s.param = 0.4 + 0.2 * u; // keep main param synced for a seamless exit
      workCamCurve.getPoint(wp, tmpPos);
      workLookCurve.getPoint(wp, tmpLook);
      workLookCenterCurve.getPoint(wp, tmpLookCenter);
      tmpLook.lerp(tmpLookCenter, 1 - sideFrame);
    } else {
      const targetParam = map.curveParam(p);
      s.param += (targetParam - s.param) * Math.min(1, dt * 3);
      cameraCurve.getPoint(s.param, tmpPos);
      lookCurve.getPoint(s.param, tmpLook);
      lookCenterCurve.getPoint(s.param, tmpLookCenter);
      tmpLook.lerp(tmpLookCenter, 1 - sideFrame);
    }
    s.pos.lerp(tmpPos, Math.min(1, dt * 5));
    s.look.lerp(tmpLook, Math.min(1, dt * 5));

    // Drag inertia + gentle return to the path's framing
    if (!d.active) {
      d.yaw += d.yawVel;
      d.pitch += d.pitchVel;
      d.yawVel *= 0.93;
      d.pitchVel *= 0.93;
      d.yaw *= 0.992;
      d.pitch *= 0.992;
    }
    d.pitch = Math.max(-0.6, Math.min(0.6, d.pitch));
    d.yaw = Math.max(-1.4, Math.min(1.4, d.yaw));

    const yaw = d.yaw + mouse.current.x * 0.05;
    const pitch = d.pitch + mouse.current.y * 0.04;

    // Orbit the camera around the current focal point
    tmpOffset.copy(s.pos).sub(s.look);
    tmpOffset.applyAxisAngle(Y_AXIS, yaw);
    tmpRight.crossVectors(Y_AXIS, tmpOffset).normalize();
    tmpOffset.applyAxisAngle(tmpRight, pitch);
    camera.position.copy(s.look).add(tmpOffset);
    camera.lookAt(s.look);
  });

  return null;
}
