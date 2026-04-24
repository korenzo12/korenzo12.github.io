import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadDmSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadHeebo } from "@remotion/google-fonts/Heebo";
import { loadFont as loadFrankRuhl } from "@remotion/google-fonts/FrankRuhlLibre";

export const fonts = {
  display: loadDmSerif().fontFamily,
  ui: loadInter().fontFamily,
  mono: loadJetBrains().fontFamily,
  // Hebrew counterparts - sans-serif and serif-display
  uiHe: loadHeebo().fontFamily,
  displayHe: loadFrankRuhl().fontFamily,
} as const;

/** Pick the right font family pair for a given language. */
export const fontsFor = (lang: "en" | "he") => ({
  display: lang === "he" ? fonts.displayHe : fonts.display,
  ui: lang === "he" ? fonts.uiHe : fonts.ui,
  mono: fonts.mono,
});

export const typography = {
  hero: {
    fontFamily: fonts.display,
    fontSize: 140,
    lineHeight: 1.05,
    fontWeight: 400,
    letterSpacing: -2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 96,
    lineHeight: 1.1,
    fontWeight: 400,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: fonts.ui,
    fontSize: 56,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  caption: {
    fontFamily: fonts.ui,
    fontSize: 64,
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: -1,
  },
  body: {
    fontFamily: fonts.ui,
    fontSize: 38,
    lineHeight: 1.35,
    fontWeight: 500,
    letterSpacing: -0.2,
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: 28,
    lineHeight: 1.4,
    fontWeight: 500,
  },
} as const;
