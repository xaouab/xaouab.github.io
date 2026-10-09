// Live flight state shared with the HUD. Mutated every frame by SpaceScene,
// read by the HUD through animation frames (never through React state).
export const telemetry = {
  /** 0 at the start of a transfer, 1 on arrival. */
  progress: 0,
};
