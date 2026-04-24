import { Easing } from "remotion";

/**
 * Curated easing functions used across the video.
 * Names describe the *feel*, not the math.
 */
export const easings = {
  // Snappy entrances - good for popups
  popIn: Easing.bezier(0.34, 1.56, 0.64, 1),
  // Smooth slide-in
  slideIn: Easing.bezier(0.16, 1, 0.3, 1),
  // Linear for continuous motion (rings expanding)
  steady: Easing.linear,
  // Soft fade
  soft: Easing.bezier(0.4, 0, 0.2, 1),
  // Anticipation (slight pull-back before)
  anticipate: Easing.bezier(0.68, -0.55, 0.27, 1.55),
  // Cursor movement - eased like a human hand
  hand: Easing.bezier(0.45, 0.05, 0.25, 1),
  // Click impact
  punch: Easing.bezier(0.2, 0, 0, 1),
} as const;

export const springs = {
  pop: { damping: 12, stiffness: 220, mass: 0.6 },
  gentle: { damping: 20, stiffness: 100, mass: 1 },
  snappy: { damping: 14, stiffness: 280, mass: 0.5 },
  bounce: { damping: 8, stiffness: 200, mass: 0.7 },
} as const;
