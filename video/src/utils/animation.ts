import { interpolate, spring, SpringConfig } from "remotion";
import { easings, springs } from "@/theme";

/**
 * Helper: interpolate but clamp by default (no extrapolation past edges).
 */
export const lerp = (
  frame: number,
  range: readonly number[],
  output: readonly number[],
  options?: { easing?: (t: number) => number },
) =>
  interpolate(frame, range as number[], output as number[], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: options?.easing ?? easings.soft,
  });

/**
 * Helper: spring animation that auto-reads fps from the caller.
 */
export const popSpring = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<SpringConfig> = springs.pop,
) =>
  spring({
    frame: frame - delay,
    fps,
    config,
  });

/**
 * Stagger an index-based delay (for sequences of elements popping in).
 */
export const stagger = (index: number, gap: number, base = 0) =>
  base + index * gap;

/**
 * Cubic bezier helper for cursor paths.
 * Returns a point on a quadratic bezier curve at progress t (0..1).
 */
export const bezierPoint = (
  start: [number, number],
  control: [number, number],
  end: [number, number],
  t: number,
): [number, number] => {
  const x =
    (1 - t) * (1 - t) * start[0] +
    2 * (1 - t) * t * control[0] +
    t * t * end[0];
  const y =
    (1 - t) * (1 - t) * start[1] +
    2 * (1 - t) * t * control[1] +
    t * t * end[1];
  return [x, y];
};

/**
 * Frame-time helper - takes seconds, returns frame number at given fps.
 */
export const seconds = (s: number, fps: number) => Math.round(s * fps);
