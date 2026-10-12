// src/flight/LookControls.tsx
//
// Free-look around the ship. Drag (mouse or one finger) to turn the view,
// wheel or pinch to zoom. On release the view springs back to the chase
// framing, starting with the gesture's own velocity so there is no seam.
// The state lives in ./look, read by ChaseCamera each frame.
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { MathUtils } from 'three';
import { look } from './look';


/** Spring velocity in rad/s, seeded by the drag release. */
const velocity = { yaw: 0, pitch: 0 };

const RADIANS_PER_PX = 0.005;
const MAX_YAW = Math.PI * 0.85;
const MAX_PITCH = 0.55;
const DRAG_THRESHOLD = 8; // px of hysteresis before a press becomes a drag
const MIN_ZOOM = 0.55;
const MAX_ZOOM = 2.2;
// Spring back: damping 1.0 (no overshoot), response 0.55 s.
const RESPONSE = 0.55;
const STIFFNESS = (2 * Math.PI / RESPONSE) ** 2;
const DAMPING = 2 * Math.sqrt(STIFFNESS);

/** The further past the bound, the less it follows. */
const rubberband = (value: number, limit: number) => {
  const over = Math.abs(value) - limit;
  if (over <= 0) return value;
  return Math.sign(value) * (limit + (over * limit * 0.55) / (limit + 0.55 * over));
};


export default function LookControls() {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const el = gl.domElement;

    const pointers = new Map<number, { x: number; y: number }>();
    let start = { x: 0, y: 0 };
    let rawYaw = 0;
    let rawPitch = 0;
    let pinchDistance = 0;
    let history: { t: number; yaw: number; pitch: number }[] = [];

    const pinchSpan = () => {
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        start = { x: e.clientX, y: e.clientY };
        // Grab the view where it is right now, mid-spring included.
        rawYaw = look.yaw;
        rawPitch = look.pitch;
        history = [];
      } else if (pointers.size === 2) {
        pinchDistance = pinchSpan();
      }
    };

    const onMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2) {
        const span = pinchSpan();
        if (pinchDistance > 0) look.zoom = MathUtils.clamp((look.zoom * pinchDistance) / span, MIN_ZOOM, MAX_ZOOM);
        pinchDistance = span;
        return;
      }

      if (!look.dragging) {
        if (Math.hypot(e.clientX - start.x, e.clientY - start.y) < DRAG_THRESHOLD) return;
        look.dragging = true;
        el.setPointerCapture(e.pointerId);
        document.documentElement.dataset.look = 'dragging';
      }

      rawYaw -= dx * RADIANS_PER_PX;
      rawPitch += dy * RADIANS_PER_PX;
      look.yaw = rubberband(rawYaw, MAX_YAW);
      look.pitch = rubberband(rawPitch, MAX_PITCH);
      velocity.yaw = velocity.pitch = 0;

      const t = performance.now();
      history.push({ t, yaw: look.yaw, pitch: look.pitch });
      while (history.length > 2 && t - history[0].t > 80) history.shift();
    };

    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size > 0) {
        // Lifting one pinch finger: continue as a drag from the remaining one.
        const [p] = [...pointers.values()];
        start = p;
        rawYaw = look.yaw;
        rawPitch = look.pitch;
        pinchDistance = 0;
        return;
      }
      if (!look.dragging) return;

      // Hand the release velocity to the spring.
      const first = history[0];
      const last = history[history.length - 1];
      const span = first && last ? (last.t - first.t) / 1000 : 0;
      velocity.yaw = span > 0 ? (last.yaw - first.yaw) / span : 0;
      velocity.pitch = span > 0 ? (last.pitch - first.pitch) / span : 0;

      look.dragging = false;
      look.releasedAt = performance.now();
      delete document.documentElement.dataset.look;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      look.zoom = MathUtils.clamp(look.zoom * Math.exp(e.deltaY * 0.0012), MIN_ZOOM, MAX_ZOOM);
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('lostpointercapture', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('lostpointercapture', onUp);
      el.removeEventListener('wheel', onWheel);
      look.dragging = false;
      delete document.documentElement.dataset.look;
    };
  }, [gl]);

  useFrame((_, rawDt) => {
    if (look.dragging) return;
    const dt = Math.min(rawDt, 1 / 30);
    // Critically damped spring back to the chase view.
    velocity.yaw += (-STIFFNESS * look.yaw - DAMPING * velocity.yaw) * dt;
    velocity.pitch += (-STIFFNESS * look.pitch - DAMPING * velocity.pitch) * dt;
    look.yaw += velocity.yaw * dt;
    look.pitch += velocity.pitch * dt;
  });

  return null;
}
