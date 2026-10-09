// Shared motion vocabulary (Apple-style: damping ≈ response, not durations).

/** Default UI spring — critically damped, no overshoot. */
export const SPRING = { type: 'spring', bounce: 0, duration: 0.4 } as const;

/** Momentum spring — slight bounce, only after a flick or drag release. */
export const FLICK_SPRING = { type: 'spring', bounce: 0.18, duration: 0.4 } as const;

/** Where a flick will come to rest (exponential deceleration, like UIScrollView). */
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
