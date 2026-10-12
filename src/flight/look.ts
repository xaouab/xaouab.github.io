// Free-look state shared by LookControls (writer) and ChaseCamera (reader).
export const look = {
  yaw: 0,
  pitch: 0,
  /** Multiplies the chase distance. */
  zoom: 1,
  /** True between a drag passing the threshold and the pointer lifting. */
  dragging: false,
  /** Timestamp of the last drag release; clicks right after a drag are ignored. */
  releasedAt: 0,
};

export const wasJustDragged = () => look.dragging || performance.now() - look.releasedAt < 120;
