// src/flight/FlightController.ts
//
// Kinematic flight model for the spacecraft.
//
// The ship never integrates forces. Every maneuver is a planned curve that
// starts at the ship's exact position/velocity and ends exactly on the
// destination orbit with the orbit's tangent direction, so the motion is
// C1-continuous (no position or heading pops) and cannot diverge. Speed is
// driven along the curve by an acceleration-limited profile that brakes ahead
// of tight turns and of the orbit join. Any destination change re-plans from
// the current state, so the ship can be redirected at any moment.
import { MathUtils, Matrix4, Quaternion, Vector3 } from 'three';

export type FlightPhase = 'home-orbit' | 'transfer' | 'planet-orbit';

export interface PlanetBody {
  id: string;
  center: Vector3;
}

interface SpeedProfile {
  maxSpeed: number;
  accel: number;
  decel: number;
  lateralAccel: number;
}

// ---- Tuning -----------------------------------------------------------------

// Home orbit: a large, slightly tilted circle around the whole system.
export const HOME_CENTER = new Vector3(0, -4, 0);
export const HOME_RADIUS = 90;
const HOME_TILT = 0.2; // rad, tilts the orbit so it sweeps above/below the system
const HOME_ANGULAR_SPEED = 0.025; // rad/s

// Planet orbit: flat circle at the planet's height.
export const PLANET_ORBIT_RADIUS = 1.15;
const PLANET_ANGULAR_SPEED = 0.16; // rad/s
const PLANET_CLEARANCE = 0.85; // min distance a path may pass from any planet center
// The ship brakes to this speed at the join, then the orbit bleeds off the rest.
const PLANET_ARRIVAL_SPEED = 0.9;

// Arrival: orbit angular speed starts at whatever speed the ship arrived with
// and settles to the nominal speed at this rate.
const ORBIT_SETTLE_RATE = 0.9;

// Fast hop into a planet orbit.
const TO_PLANET: SpeedProfile = { maxSpeed: 46, accel: 24, decel: 20, lateralAccel: 40 };
// Relaxed cruise back to the home orbit.
const TO_HOME: SpeedProfile = { maxSpeed: 20, accel: 3.5, decel: 3.5, lateralAccel: 6 };

// Leaving a planet heads straight for the nearest stretch of the home orbit:
// joins are searched within this angle of the closest home point first.
const HOME_NEAR_SPAN = 0.6; // rad either side
const HOME_NEAR_STEPS = 24;
// Small preference for the join closest to the ship, so it doesn't drift round the orbit.
const HOME_DRIFT_COST = 0.5;
// Any curve scoring above this clipped a planet.
const CLIP_COST = 1000;

// Visual attitude.
const BANK_GAIN = 0.09;
const MAX_BANK = 0.75;
const BANK_RATE = 4;
// The nose follows the velocity with a short lag, so the rare impossible
// redirect reads as a drift through the corner instead of a snap.
const HEADING_RATE = 12;

// ---- Small helpers ----------------------------------------------------------

const UP = new Vector3(0, 1, 0);
const HOME_A = new Vector3(0, 0, 1);
const HOME_B = new Vector3(Math.cos(HOME_TILT), Math.sin(HOME_TILT), 0);

const homePoint = (theta: number, out: Vector3) =>
  out
    .copy(HOME_CENTER)
    .addScaledVector(HOME_A, Math.cos(theta) * HOME_RADIUS)
    .addScaledVector(HOME_B, Math.sin(theta) * HOME_RADIUS);

const homeTangent = (theta: number, dir: number, out: Vector3) =>
  out
    .set(0, 0, 0)
    .addScaledVector(HOME_A, -Math.sin(theta) * dir)
    .addScaledVector(HOME_B, Math.cos(theta) * dir);

const planetPoint = (center: Vector3, theta: number, radius: number, out: Vector3) =>
  out.set(center.x + Math.cos(theta) * radius, center.y, center.z + Math.sin(theta) * radius);

const planetTangent = (theta: number, dir: number, out: Vector3) =>
  out.set(-Math.sin(theta) * dir, 0, Math.cos(theta) * dir);


// Cubic Hermite basis.
const hermitePoint = (p0: Vector3, m0: Vector3, p1: Vector3, m1: Vector3, u: number, out: Vector3) => {
  const u2 = u * u;
  const u3 = u2 * u;
  return out
    .copy(p0)
    .multiplyScalar(2 * u3 - 3 * u2 + 1)
    .addScaledVector(m0, u3 - 2 * u2 + u)
    .addScaledVector(p1, -2 * u3 + 3 * u2)
    .addScaledVector(m1, u3 - u2);
};

const hermiteSecond = (p0: Vector3, m0: Vector3, p1: Vector3, m1: Vector3, u: number, out: Vector3) =>
  out
    .copy(p0)
    .multiplyScalar(12 * u - 6)
    .addScaledVector(m0, 6 * u - 4)
    .addScaledVector(p1, -12 * u + 6)
    .addScaledVector(m1, 6 * u - 2);

const hermiteTangent = (p0: Vector3, m0: Vector3, p1: Vector3, m1: Vector3, u: number, out: Vector3) => {
  const u2 = u * u;
  return out
    .copy(p0)
    .multiplyScalar(6 * u2 - 6 * u)
    .addScaledVector(m0, 3 * u2 - 4 * u + 1)
    .addScaledVector(p1, -6 * u2 + 6 * u)
    .addScaledVector(m1, 3 * u2 - 2 * u);
};

// ---- Path -------------------------------------------------------------------

const PATH_SAMPLES = 64;
const EVAL_SAMPLES = 64;
// Tightest turn radius a curve may have anywhere...
const MIN_TURN_RADIUS = 0.6;
// ...and near its start, where the ship still carries its current speed (v² / a).
const START_LATERAL_ACCEL = 60;
const START_SPAN = 0.3; // fraction of the curve (in u) treated as "near the start"
// A fast ship keeps going the way it's heading for about this long before the
// curve can pull it around, so redirects at speed swoop wide instead of snapping.
const MOMENTUM_TIME = 1.1;
const TANGENT_SCALES: [number, number][] = [
  [0.4, 0.5],
  [0.8, 0.6],
  [1.2, 0.8],
  [0.6, 1.3],
  [1.8, 1.3],
];

/** Hermite curve with an arc-length table and a precomputed speed-limit profile. */
class TransferPath {
  readonly p0 = new Vector3();
  readonly m0 = new Vector3();
  readonly p1 = new Vector3();
  readonly m1 = new Vector3();
  readonly u = new Float32Array(PATH_SAMPLES + 1);
  readonly s = new Float32Array(PATH_SAMPLES + 1);
  readonly vLimit = new Float32Array(PATH_SAMPLES + 1);
  length = 0;

  build(p0: Vector3, m0: Vector3, p1: Vector3, m1: Vector3, profile: SpeedProfile, endSpeed: number) {
    this.p0.copy(p0);
    this.m0.copy(m0);
    this.p1.copy(p1);
    this.m1.copy(m1);

    const pts: Vector3[] = [];
    for (let i = 0; i <= PATH_SAMPLES; i++) {
      const u = i / PATH_SAMPLES;
      this.u[i] = u;
      pts.push(hermitePoint(p0, m0, p1, m1, u, new Vector3()));
      this.s[i] = i === 0 ? 0 : this.s[i - 1] + pts[i].distanceTo(pts[i - 1]);
    }
    this.length = this.s[PATH_SAMPLES];

    // Curvature-based speed cap (turning angle / arc length at each sample).
    const a = new Vector3();
    const b = new Vector3();
    for (let i = 0; i <= PATH_SAMPLES; i++) {
      let limit = profile.maxSpeed;
      if (i > 0 && i < PATH_SAMPLES) {
        a.subVectors(pts[i], pts[i - 1]);
        b.subVectors(pts[i + 1], pts[i]);
        const ds = (a.length() + b.length()) * 0.5;
        if (ds > 1e-6 && a.lengthSq() > 1e-12 && b.lengthSq() > 1e-12) {
          const curvature = a.angleTo(b) / ds;
          if (curvature > 1e-6) limit = Math.min(limit, Math.sqrt(profile.lateralAccel / curvature));
        }
      }
      this.vLimit[i] = limit;
    }

    // Backward pass so the ship brakes in time for tight spots and the orbit join.
    this.vLimit[PATH_SAMPLES] = Math.min(this.vLimit[PATH_SAMPLES], endSpeed);
    for (let i = PATH_SAMPLES - 1; i >= 0; i--) {
      const ds = this.s[i + 1] - this.s[i];
      const reachable = Math.sqrt(this.vLimit[i + 1] ** 2 + 2 * profile.decel * ds);
      this.vLimit[i] = Math.min(this.vLimit[i], reachable);
    }
  }

  private index(s: number) {
    let lo = 0;
    let hi = PATH_SAMPLES;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (this.s[mid] <= s) lo = mid;
      else hi = mid;
    }
    const span = this.s[hi] - this.s[lo];
    return { lo, hi, t: span > 1e-9 ? MathUtils.clamp((s - this.s[lo]) / span, 0, 1) : 0 };
  }

  uAt(s: number) {
    const { lo, hi, t } = this.index(s);
    return MathUtils.lerp(this.u[lo], this.u[hi], t);
  }

  speedLimitAt(s: number) {
    const { lo, hi, t } = this.index(s);
    return MathUtils.lerp(this.vLimit[lo], this.vLimit[hi], t);
  }

  point(u: number, out: Vector3) {
    return hermitePoint(this.p0, this.m0, this.p1, this.m1, u, out);
  }

  tangent(u: number, out: Vector3) {
    return hermiteTangent(this.p0, this.m0, this.p1, this.m1, u, out);
  }
}

interface JoinCandidate {
  theta: number;
  dir: 1 | -1;
  cost: number;
  p1: Vector3;
  m0: Vector3;
  m1: Vector3;
}

// ---- Controller -------------------------------------------------------------

export class FlightController {
  // Public, read-only-by-convention state consumed by the ship and camera.
  readonly position = new Vector3();
  readonly velocity = new Vector3();
  /** Direction of travel. */
  readonly forward = new Vector3(0, 0, 1);
  /** Where the nose points (lags `forward` slightly). */
  readonly heading = new Vector3(0, 0, 1);
  readonly orientation = new Quaternion();
  readonly focus = new Vector3();
  phase: FlightPhase = 'home-orbit';
  targetPlanetId: string | null = null;
  speed = 0;
  /** Along-track acceleration, positive when speeding up. */
  thrust = 0;
  bank = 0;
  /** 0 at the start of a transfer, 1 on arrival. */
  transferProgress = 0;
  lastPlanCost = 0;

  private readonly planets: PlanetBody[];
  private orbitCenter = new Vector3();
  private orbitTheta = 0;
  private orbitDir: 1 | -1 = 1;
  private orbitAngularSpeed = HOME_ANGULAR_SPEED;
  private orbitRadius = PLANET_ORBIT_RADIUS;

  private path = new TransferPath();
  private pathS = 0;
  private pathSpeed = 0;
  private pathProfile: SpeedProfile = TO_PLANET;
  private pathTarget: { kind: 'home' } | { kind: 'planet'; planet: PlanetBody } = { kind: 'home' };
  private pathJoinTheta = 0;
  private pathJoinDir: 1 | -1 = 1;


  private prevVelocity = new Vector3();
  private tmpA = new Vector3();
  private tmpB = new Vector3();
  private tmpC = new Vector3();
  private basis = new Matrix4();
  private right = new Vector3(1, 0, 0);
  private rollQ = new Quaternion();
  private targetQ = new Quaternion();

  constructor(planets: PlanetBody[], startTheta = 0) {
    this.planets = planets;
    this.enterHomeOrbit(startTheta, 1, HOME_ANGULAR_SPEED);
    this.writeOrbitState();
    this.prevVelocity.copy(this.velocity);
    this.speed = this.velocity.length();
    this.forward.copy(this.velocity).normalize();
    this.updateAttitude(1 / 60, true);
  }

  get isManeuvering() {
    return this.phase === 'transfer';
  }

  /** Head for a planet orbit. Safe to call at any time, from any phase. */
  goToPlanet(id: string) {
    const planet = this.planets.find((p) => p.id === id);
    if (!planet) return;
    if (this.targetPlanetId === id && (this.phase === 'planet-orbit' || this.phase === 'transfer')) return;

    this.targetPlanetId = id;
    this.planTransfer({ kind: 'planet', planet }, TO_PLANET);
  }

  /** Return to the home orbit, joining it at the nearest clear point. */
  goHome() {
    const wasTargetingPlanet = this.targetPlanetId !== null;
    this.targetPlanetId = null;

    if (this.phase === 'planet-orbit' || (this.phase === 'transfer' && wasTargetingPlanet)) {
      this.planTransfer({ kind: 'home' }, TO_HOME);
    }
    // Already in home orbit or heading home: nothing to do.
  }

  update(rawDt: number) {
    const dt = MathUtils.clamp(Number.isFinite(rawDt) ? rawDt : 0, 0, 1 / 20);
    if (dt <= 0) return;

    this.prevVelocity.copy(this.velocity);

    switch (this.phase) {
      case 'home-orbit':
      case 'planet-orbit':
        this.stepOrbit(dt);
        break;
      case 'transfer':
        this.stepTransfer(dt);
        break;
    }

    if (!this.isFinite()) {
      // Should never happen; recover to a known-good state instead of rendering NaNs.
      this.targetPlanetId = null;
      this.enterHomeOrbit(0, 1, HOME_ANGULAR_SPEED);
      this.writeOrbitState();
      this.prevVelocity.copy(this.velocity);
      this.bank = 0;
      this.orientation.identity();
    }

    this.speed = this.velocity.length();
    if (this.speed > 1e-4) this.forward.copy(this.velocity).divideScalar(this.speed);
    this.updateAttitude(dt);
  }

  // ---- Phases ---------------------------------------------------------------

  private enterHomeOrbit(theta: number, dir: 1 | -1, angularSpeed: number) {
    this.phase = 'home-orbit';
    this.orbitCenter.copy(HOME_CENTER);
    this.orbitRadius = HOME_RADIUS;
    this.orbitTheta = theta;
    this.orbitDir = dir;
    this.orbitAngularSpeed = angularSpeed;
    this.focus.copy(HOME_CENTER);
  }

  private enterPlanetOrbit(planet: PlanetBody, theta: number, dir: 1 | -1, angularSpeed: number) {
    this.phase = 'planet-orbit';
    this.orbitCenter.copy(planet.center);
    this.orbitRadius = PLANET_ORBIT_RADIUS;
    this.orbitTheta = theta;
    this.orbitDir = dir;
    this.orbitAngularSpeed = angularSpeed;
    this.focus.copy(planet.center);
  }

  private stepOrbit(dt: number) {
    const nominal = this.phase === 'home-orbit' ? HOME_ANGULAR_SPEED : PLANET_ANGULAR_SPEED;
    const before = this.orbitAngularSpeed;
    this.orbitAngularSpeed = MathUtils.damp(this.orbitAngularSpeed, nominal, ORBIT_SETTLE_RATE, dt);
    this.thrust = ((this.orbitAngularSpeed - before) * this.orbitRadius) / dt;
    this.orbitTheta += this.orbitDir * this.orbitAngularSpeed * dt;
    this.writeOrbitState();
  }

  private writeOrbitState() {
    const theta = this.orbitTheta;
    const tangentialSpeed = this.orbitAngularSpeed * this.orbitRadius;
    if (this.phase === 'home-orbit') {
      homePoint(theta, this.position);
      homeTangent(theta, this.orbitDir, this.velocity).multiplyScalar(tangentialSpeed);
    } else {
      planetPoint(this.orbitCenter, theta, this.orbitRadius, this.position);
      planetTangent(theta, this.orbitDir, this.velocity).multiplyScalar(tangentialSpeed);
    }
  }

  private stepTransfer(dt: number) {
    const profile = this.pathProfile;
    // Track the speed-limit profile with feed-forward so braking isn't late.
    const target = this.path.speedLimitAt(this.pathS);
    const ahead = this.path.speedLimitAt(this.pathS + this.pathSpeed * dt);
    // Redirected while going faster than this profile allows: shed speed hard.
    const decel = this.pathSpeed > profile.maxSpeed ? Math.max(profile.decel, TO_PLANET.decel) : profile.decel;
    const accel = MathUtils.clamp((ahead - target) / dt + (target - this.pathSpeed) * 6, -decel * 1.25, profile.accel);
    const endSpeed = this.path.vLimit[PATH_SAMPLES];
    this.pathSpeed = Math.max(this.pathSpeed + accel * dt, Math.max(endSpeed * 0.8, 0.2));
    this.thrust = accel;
    this.pathS += this.pathSpeed * dt;
    this.transferProgress = this.path.length > 0 ? MathUtils.clamp(this.pathS / this.path.length, 0, 1) : 1;

    if (this.pathS >= this.path.length) {
      this.arrive(this.pathS - this.path.length);
      return;
    }

    const u = this.path.uAt(this.pathS);
    this.path.point(u, this.position);
    const tangent = this.path.tangent(u, this.tmpA);
    if (tangent.lengthSq() > 1e-12) this.velocity.copy(tangent).normalize().multiplyScalar(this.pathSpeed);
  }

  private arrive(overshoot: number) {
    const target = this.pathTarget;
    if (target.kind === 'planet') {
      const omega = Math.min(this.pathSpeed / PLANET_ORBIT_RADIUS, 3);
      this.enterPlanetOrbit(target.planet, this.pathJoinTheta, this.pathJoinDir, omega);
    } else {
      this.enterHomeOrbit(this.pathJoinTheta, this.pathJoinDir, this.pathSpeed / HOME_RADIUS);
    }
    this.transferProgress = 1;
    // Carry the leftover distance into the orbit so arrival doesn't stutter.
    this.orbitTheta += (this.orbitDir * overshoot) / this.orbitRadius;
    this.writeOrbitState();
  }

  // ---- Planning -------------------------------------------------------------

  private planTransfer(target: { kind: 'home' } | { kind: 'planet'; planet: PlanetBody }, profile: SpeedProfile) {
    const start = this.tmpA.copy(this.position);
    const startDir = this.tmpB.copy(this.speed > 1e-3 ? this.velocity : this.forward).normalize();
    const startSpeed = this.velocity.length();

    const endSpeed = target.kind === 'planet' ? PLANET_ARRIVAL_SPEED : HOME_ANGULAR_SPEED * HOME_RADIUS;
    const brakingDistance = Math.max(0, (startSpeed * startSpeed - endSpeed * endSpeed) / (2 * profile.decel));
    const best = this.pickJoin(target, start, startDir, startSpeed, brakingDistance);
    this.lastPlanCost = best.cost;

    this.path.build(start, best.m0, best.p1, best.m1, profile, endSpeed);
    this.pathS = 0;
    this.pathSpeed = startSpeed;
    this.pathProfile = profile;
    this.pathTarget = target;
    this.pathJoinTheta = best.theta;
    this.pathJoinDir = best.dir;
    this.transferProgress = 0;
    this.phase = 'transfer';
    this.focus.copy(target.kind === 'planet' ? target.planet.center : HOME_CENTER);
  }

  /**
   * Sample join points around the destination orbit (both directions, a few
   * tangent lengths) and keep the shortest, least twisty curve that doesn't
   * clip a planet. The end tangent is always the orbit tangent, so the join is
   * tangential by construction.
   */
  private pickJoin(
    target: { kind: 'home' } | { kind: 'planet'; planet: PlanetBody },
    start: Vector3,
    startDir: Vector3,
    startSpeed: number,
    brakingDistance: number
  ): JoinCandidate {
    const minStartTangent = startSpeed * MOMENTUM_TIME;
    const startTurnRadius = Math.max(MIN_TURN_RADIUS, (startSpeed * startSpeed) / START_LATERAL_ACCEL);
    const angleSteps = target.kind === 'home' ? 48 : 36;
    const p1 = new Vector3();
    const t1 = new Vector3();
    const m0 = new Vector3();
    const m1 = new Vector3();
    let best: JoinCandidate | null = null;
    let bestCost = Infinity;

    const consider = (theta: number, drift: number) => {
      for (const dir of [1, -1] as const) {
        if (target.kind === 'home') {
          homePoint(theta, p1);
          homeTangent(theta, dir, t1);
        } else {
          planetPoint(target.planet.center, theta, PLANET_ORBIT_RADIUS, p1);
          planetTangent(theta, dir, t1);
        }
        const chord = Math.max(start.distanceTo(p1), 1.5);

        for (const [k0, k1] of TANGENT_SCALES) {
          m0.copy(startDir).multiplyScalar(Math.max(k0 * chord, minStartTangent));
          m1.copy(t1).multiplyScalar(k1 * chord);
          const cost = this.evaluate(start, m0, p1, m1, startTurnRadius, brakingDistance) + drift;
          if (cost < bestCost) {
            bestCost = cost;
            best = { theta, dir, cost, p1: p1.clone(), m0: m0.clone(), m1: m1.clone() };
          }
        }
      }
    };

    if (target.kind === 'home') {
      const rel = this.tmpC.subVectors(start, HOME_CENTER);
      const nearest = Math.atan2(rel.dot(HOME_B), rel.dot(HOME_A));
      for (let i = 0; i <= HOME_NEAR_STEPS; i++) {
        const offset = ((i / HOME_NEAR_STEPS) * 2 - 1) * HOME_NEAR_SPAN;
        consider(nearest + offset, Math.abs(offset) * HOME_RADIUS * HOME_DRIFT_COST);
      }
      if (bestCost < CLIP_COST) return best!;
    }

    for (let i = 0; i < angleSteps; i++) consider((i / angleSteps) * Math.PI * 2, 0);

    return best!;
  }

  private evaluate(
    p0: Vector3,
    m0: Vector3,
    p1: Vector3,
    m1: Vector3,
    startTurnRadius: number,
    brakingDistance: number
  ) {
    const prev = this.tmpC.copy(p0);
    const cur = new Vector3();
    const seg = new Vector3();
    const toCenter = new Vector3();
    const tangent = hermiteTangent(p0, m0, p1, m1, 0, new Vector3());
    const prevTangent = new Vector3();
    const second = new Vector3();
    const cross = new Vector3();
    let length = 0;
    let turn = 0;
    let tightness = 0;
    let penalty = 0;

    for (let j = 0; j <= EVAL_SAMPLES; j++) {
      const u = j / EVAL_SAMPLES;
      prevTangent.copy(tangent);
      hermiteTangent(p0, m0, p1, m1, u, tangent);

      // Analytic curvature against the allowed turn radius at this point.
      const speedSq = tangent.lengthSq();
      const minRadius = u < START_SPAN ? startTurnRadius : MIN_TURN_RADIUS;
      if (speedSq < 1e-10) {
        tightness = Math.max(tightness, 10);
      } else {
        hermiteSecond(p0, m0, p1, m1, u, second);
        const curvature = cross.crossVectors(tangent, second).length() / (speedSq * Math.sqrt(speedSq));
        tightness = Math.max(tightness, curvature * minRadius - 1);
      }
      if (j === 0) continue;

      if (prevTangent.lengthSq() > 1e-12 && speedSq > 1e-12) turn += prevTangent.angleTo(tangent);

      hermitePoint(p0, m0, p1, m1, u, cur);
      seg.subVectors(cur, prev);
      const segLengthSq = seg.lengthSq();
      length += Math.sqrt(segLengthSq);

      // Closest approach of this segment to each planet.
      for (const planet of this.planets) {
        toCenter.subVectors(planet.center, prev);
        const t = segLengthSq > 1e-12 ? MathUtils.clamp(toCenter.dot(seg) / segLengthSq, 0, 1) : 0;
        const d = toCenter.addScaledVector(seg, -t).length();
        if (d < PLANET_CLEARANCE) penalty += CLIP_COST + (PLANET_CLEARANCE - d) * CLIP_COST;
      }
      prev.copy(cur);
    }

    // Turns tighter than allowed read as the ship snapping around; penalise them hard.
    // Too short to shed the current speed: prefer a longer, swooping curve.
    const overrun = Math.max(0, brakingDistance - length) * 3;
    return length * (1 + 0.15 * turn + 2 * Math.min(tightness, 10)) + overrun + penalty;
  }

  // ---- Attitude -------------------------------------------------------------

  private updateAttitude(dt: number, snap = false) {
    // Bank into the turn from the lateral (centripetal) acceleration.
    const accel = this.tmpA.subVectors(this.velocity, this.prevVelocity).divideScalar(dt);
    accel.addScaledVector(this.forward, -accel.dot(this.forward));

    const right = this.tmpB.crossVectors(UP, this.forward);
    if (right.lengthSq() > 1e-6) this.right.copy(right.normalize());
    const lateral = accel.dot(this.right);
    const targetBank = MathUtils.clamp(Math.atan(lateral * BANK_GAIN), -MAX_BANK, MAX_BANK);
    this.bank = MathUtils.damp(this.bank, Number.isFinite(targetBank) ? targetBank : 0, BANK_RATE, dt);

    const up = this.tmpC.crossVectors(this.forward, this.right).normalize();
    this.basis.makeBasis(this.right, up, this.forward);
    this.targetQ.setFromRotationMatrix(this.basis);
    // Positive bank tilts the ship's up vector towards +right (into the turn).
    this.rollQ.setFromAxisAngle(this.forward, -this.bank);
    this.targetQ.premultiply(this.rollQ);

    if (snap) this.orientation.copy(this.targetQ);
    else this.orientation.slerp(this.targetQ, 1 - Math.exp(-HEADING_RATE * dt));
    this.heading.set(0, 0, 1).applyQuaternion(this.orientation);
  }

  private isFinite() {
    const p = this.position;
    const v = this.velocity;
    return (
      Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z) &&
      Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)
    );
  }
}
