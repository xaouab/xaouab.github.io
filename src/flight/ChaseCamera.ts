// src/flight/ChaseCamera.ts
//
// Third-person chase camera.
//
// The view direction is a blend between where the ship is heading and where
// the current point of interest is (the system center at home, the planet
// while orbiting). The camera sits behind the ship along that view direction,
// so the ship always stays framed low in the shot while the focus stays in the
// background. Everything is exponentially damped (unconditionally stable for
// any frame time) and expressed relative to the ship, so the camera can lag and
// swing through turns but can never lose the ship.
import { MathUtils, PerspectiveCamera, Quaternion, Vector3 } from 'three';
import type { FlightController } from './FlightController';

// The ship is tiny next to the planets; the whole rig is sized to the ship so
// it still reads at the same size on screen.
export const SHIP_SCALE = 0.21;
const RIG_SCALE = SHIP_SCALE / 0.7;

interface Framing {
  /** 0 = look where the ship is going, 1 = look at the focus. */
  focusWeight: number;
  distance: number;
  height: number;
}

const rig = (focusWeight: number, distance: number, height: number): Framing => ({
  focusWeight,
  distance: distance * RIG_SCALE,
  height: height * RIG_SCALE,
});

const HOME = rig(0.82, 3.4, 0.95);
const PLANET_ORBIT = rig(0.45, 2.3, 0.55);
const DEPARTURE = rig(0.3, 2.8, 0.7);
const TRANSFER_TO_PLANET_START = rig(0.2, 2.8, 0.7);
const TRANSFER_TO_HOME_START = rig(0.25, 3.0, 0.8);

const BASE_FOV = 70;
const MAX_FOV_KICK = 14;
const FOV_PER_SPEED = 0.35;
const PULLBACK_PER_SPEED = 0.035 * RIG_SCALE;
const MAX_PULLBACK = 1.6 * RIG_SCALE;
const CAMERA_ROLL = 0.18; // fraction of the ship's bank the camera leans into
const MAX_PITCH = 0.8; // |y| of the view direction, keeps lookAt away from the pole

const FRAMING_RATE = 1.4;
const FOCUS_RATE = 2.2;
const VIEW_RATE = 2.6;
const OFFSET_RATE = 3.5;
const FOV_RATE = 2;
const ROLL_RATE = 3;

const INTRO_OFFSET_SCALE = 7;

// Portrait screens have a narrow horizontal view: look more towards the focus,
// sit a little further back and follow tighter so neither ship nor planet drops out.
const NARROW_FOCUS_BIAS = 0.75;
const NARROW_DISTANCE_SCALE = 0.45;
const NARROW_OFFSET_RATE = 7;

const UP = new Vector3(0, 1, 0);

const lerpFraming = (a: Framing, b: Framing, t: number, out: Framing) => {
  out.focusWeight = MathUtils.lerp(a.focusWeight, b.focusWeight, t);
  out.distance = MathUtils.lerp(a.distance, b.distance, t);
  out.height = MathUtils.lerp(a.height, b.height, t);
  return out;
};

export class ChaseCamera {
  private initialized = false;
  private framing: Framing = { ...HOME };
  private target: Framing = { ...HOME };
  private focus = new Vector3();
  private view = new Vector3(0, 0, -1);
  private offset = new Vector3();
  private fov = BASE_FOV;
  private roll = 0;

  private desiredView = new Vector3();
  private desiredOffset = new Vector3();
  private toFocus = new Vector3();
  private rotation = new Quaternion();
  private identity = new Quaternion();
  private lookTarget = new Vector3();
  private narrowness = 0;

  update(camera: PerspectiveCamera, flight: FlightController, rawDt: number) {
    const dt = MathUtils.clamp(Number.isFinite(rawDt) ? rawDt : 0, 0, 1 / 20);

    // 0 on landscape, 1 on a phone held upright.
    this.narrowness = MathUtils.clamp((1.2 - camera.aspect) / 0.7, 0, 1);
    this.pickFraming(flight);
    const speed = flight.speed;

    if (!this.initialized) {
      this.initialized = true;
      this.framing = { ...this.target };
      this.focus.copy(flight.focus);
      this.computeDesiredView(flight);
      this.view.copy(this.desiredView);
      this.computeDesiredOffset(speed);
      // Start far out and swoop in behind the ship.
      this.offset.copy(this.desiredOffset).multiplyScalar(INTRO_OFFSET_SCALE);
      this.fov = BASE_FOV + MAX_FOV_KICK;
    } else {
      const f = this.framing;
      const t = this.target;
      f.focusWeight = MathUtils.damp(f.focusWeight, t.focusWeight, FRAMING_RATE, dt);
      f.distance = MathUtils.damp(f.distance, t.distance, FRAMING_RATE, dt);
      f.height = MathUtils.damp(f.height, t.height, FRAMING_RATE, dt);

      this.focus.lerp(flight.focus, 1 - Math.exp(-FOCUS_RATE * dt));

      // Rotate the view towards the desired one (slerp handles reversals cleanly).
      this.computeDesiredView(flight);
      this.rotation.setFromUnitVectors(this.view, this.desiredView);
      this.identity.identity().slerp(this.rotation, 1 - Math.exp(-VIEW_RATE * dt));
      this.view.applyQuaternion(this.identity).normalize();
      this.clampPitch(this.view);

      this.computeDesiredOffset(speed);
      const offsetRate = MathUtils.lerp(OFFSET_RATE, NARROW_OFFSET_RATE, this.narrowness);
      this.offset.lerp(this.desiredOffset, 1 - Math.exp(-offsetRate * dt));

      const fovTarget = BASE_FOV + Math.min(speed * FOV_PER_SPEED, MAX_FOV_KICK);
      this.fov = MathUtils.damp(this.fov, fovTarget, FOV_RATE, dt);
    }

    this.roll = MathUtils.damp(this.roll, flight.bank * CAMERA_ROLL, ROLL_RATE, dt);

    camera.position.copy(flight.position).add(this.offset);
    camera.up.copy(UP);
    camera.lookAt(this.lookTarget.copy(camera.position).add(this.view));
    // The camera looks down its local -Z, so this leans the horizon with the ship's bank.
    camera.rotateZ(-this.roll);

    if (Math.abs(camera.fov - this.fov) > 1e-3) {
      camera.fov = this.fov;
      camera.updateProjectionMatrix();
    }
  }

  private pickFraming(flight: FlightController) {
    switch (flight.phase) {
      case 'home-orbit':
        this.setTarget(HOME);
        break;
      case 'planet-orbit':
        this.setTarget(PLANET_ORBIT);
        break;
      case 'departure':
        this.setTarget(DEPARTURE);
        break;
      case 'transfer': {
        // Ease the focus in as the destination gets close.
        const t = MathUtils.smoothstep(flight.transferProgress, 0.35, 1);
        if (flight.targetPlanetId) lerpFraming(TRANSFER_TO_PLANET_START, PLANET_ORBIT, t, this.target);
        else lerpFraming(TRANSFER_TO_HOME_START, HOME, t, this.target);
        break;
      }
    }
  }

  private setTarget(framing: Framing) {
    this.target.focusWeight = framing.focusWeight;
    this.target.distance = framing.distance;
    this.target.height = framing.height;
  }

  private computeDesiredView(flight: FlightController) {
    const toFocus = this.toFocus.subVectors(this.focus, flight.position);
    if (toFocus.lengthSq() < 1e-8) toFocus.copy(flight.heading);
    toFocus.normalize();

    const base = this.framing.focusWeight;
    const w = base + (1 - base) * NARROW_FOCUS_BIAS * this.narrowness;
    this.desiredView.copy(flight.heading).multiplyScalar(1 - w).addScaledVector(toFocus, w);
    // Heading and focus nearly opposite: fall back to whichever dominates.
    if (this.desiredView.lengthSq() < 1e-4) this.desiredView.copy(w >= 0.5 ? toFocus : flight.heading);
    this.desiredView.normalize();
    this.clampPitch(this.desiredView);
  }

  private computeDesiredOffset(speed: number) {
    const distance =
      this.framing.distance * (1 + NARROW_DISTANCE_SCALE * this.narrowness) +
      Math.min(speed * PULLBACK_PER_SPEED, MAX_PULLBACK);
    this.desiredOffset.copy(this.view).multiplyScalar(-distance).addScaledVector(UP, this.framing.height);
  }

  private clampPitch(v: Vector3) {
    if (Math.abs(v.y) <= MAX_PITCH) return;
    const horizontal = Math.hypot(v.x, v.z);
    const y = Math.sign(v.y) * MAX_PITCH;
    const scale = horizontal > 1e-6 ? Math.sqrt(1 - y * y) / horizontal : 0;
    if (scale === 0) v.set(Math.sqrt(1 - y * y), y, 0);
    else v.set(v.x * scale, y, v.z * scale);
  }
}
