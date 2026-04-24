/**
 * Centralised narration script with frame-accurate cue points.
 * Edit timing here and every scene + caption updates accordingly.
 *
 * fps = 30 throughout.
 */
import { VIDEO } from "@/theme";

const s = (sec: number) => Math.round(sec * VIDEO.fps);

export const script = {
  totalDurationFrames: s(32),
  voiceoverFile: "/audio/voiceover.mp3",
  musicFile: "/audio/music.mp3",
  scenes: {
    intro: {
      from: 0,
      to: s(5),
    },
    google: {
      from: s(5),
      to: s(11),
    },
    vscode: {
      from: s(11),
      to: s(18),
    },
    desktop: {
      from: s(18),
      to: s(25),
    },
    terminal: {
      from: s(25),
      to: s(30),
    },
    outro: {
      from: s(30),
      to: s(32),
    },
  },
  captions: [
    { text: "on", x: 540, y: 1280, at: s(2.0), hold: 22, rotation: -3 },
    { text: "any Mac", x: 540, y: 1300, at: s(3.2), hold: 25, rotation: 2 },
    { text: "in 30 seconds", x: 540, y: 960, at: s(4.0), hold: 28, rotation: 0 },
    { text: "search", x: 360, y: 720, at: s(5.6), hold: 20, rotation: -4 },
    { text: "vs code", x: 540, y: 920, at: s(6.8), hold: 22, rotation: 3 },
    { text: "and", x: 540, y: 1300, at: s(9.0), hold: 18, rotation: -2 },
    { text: "open the site", x: 540, y: 760, at: s(11.5), hold: 24, rotation: 0 },
    { text: "download", x: 540, y: 1080, at: s(13.5), hold: 26, rotation: 4 },
    { text: "for macOS", x: 540, y: 1280, at: s(14.8), hold: 24, rotation: -3 },
    { text: "code,", x: 540, y: 1500, at: s(16.0), hold: 22, rotation: 0 },
    { text: "right click", x: 540, y: 1100, at: s(18.5), hold: 22, rotation: -2 },
    { text: "new", x: 540, y: 1300, at: s(20.5), hold: 22, rotation: 4 },
    { text: "open terminal", x: 540, y: 1100, at: s(25.0), hold: 24, rotation: -2 },
    { text: "claude code", x: 540, y: 1300, at: s(27.0), hold: 26, rotation: 2 },
    { text: "done!", x: 540, y: 960, at: s(30.0), hold: 50, rotation: -3 },
  ],
} as const;
