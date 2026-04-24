import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { GradientBackground } from "@/components/GradientBackground";
import { GlowRings } from "@/components/GlowRings";
import { PopupCaption } from "@/components/PopupCaption";
import { IntroScene } from "@/scenes/IntroScene";
import { GoogleScene } from "@/scenes/GoogleScene";
import { VSCodeScene } from "@/scenes/VSCodeScene";
import { DesktopScene } from "@/scenes/DesktopScene";
import { TerminalScene } from "@/scenes/TerminalScene";
import { OutroScene } from "@/scenes/OutroScene";
import { script } from "@/data/script";

/**
 * Master composition. Scenes are sequenced via <Sequence>; the gradient
 * + ambient rings persist across the whole video as a unifying backdrop.
 */
export const ClaudeCodeSetup: React.FC<{
  withVoiceover?: boolean;
  withMusic?: boolean;
}> = ({ withVoiceover = false, withMusic = false }) => {
  const { fps } = useVideoConfig();
  const { intro, google, vscode, desktop, terminal, outro } = script.scenes;
  const len = (s: { from: number; to: number }) => s.to - s.from;

  return (
    <AbsoluteFill>
      <GradientBackground />

      {/* Persistent ambient rings, dimmed during scenes that have their own UI */}
      <Sequence from={intro.from} durationInFrames={len(intro)}>
        <IntroScene />
      </Sequence>

      <Sequence from={google.from} durationInFrames={len(google)}>
        <GlowRings centerX={540} centerY={960} baseSize={1200} count={4} cadence={40} intensity={0.4} />
        <GoogleScene />
      </Sequence>

      <Sequence from={vscode.from} durationInFrames={len(vscode)}>
        <GlowRings centerX={540} centerY={960} baseSize={1200} count={4} cadence={40} intensity={0.4} />
        <VSCodeScene />
      </Sequence>

      <Sequence from={desktop.from} durationInFrames={len(desktop)}>
        <DesktopScene />
      </Sequence>

      <Sequence from={terminal.from} durationInFrames={len(terminal)}>
        <GlowRings centerX={540} centerY={960} baseSize={1100} count={5} cadence={36} intensity={0.55} />
        <TerminalScene />
      </Sequence>

      <Sequence from={outro.from} durationInFrames={len(outro)}>
        <GlowRings centerX={540} centerY={960} baseSize={1300} count={6} cadence={28} intensity={1} />
        <OutroScene />
      </Sequence>

      {/* Global captions — rendered above all scenes */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {script.captions.map((c, i) => (
          <PopupCaption
            key={i}
            text={c.text}
            x={c.x}
            y={c.y}
            startAt={c.at}
            hold={c.hold}
            rotation={c.rotation ?? 0}
          />
        ))}
      </AbsoluteFill>

      {withVoiceover && <Audio src={staticFile(script.voiceoverFile)} />}
      {withMusic && (
        <Audio src={staticFile(script.musicFile)} volume={0.18} />
      )}
    </AbsoluteFill>
  );
};
