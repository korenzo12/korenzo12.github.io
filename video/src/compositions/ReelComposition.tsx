import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GradientBackground } from "@/components/GradientBackground";
import { GlowRings } from "@/components/GlowRings";
import { PopupCaption } from "@/components/PopupCaption";
import { TitleSceneRenderer } from "@/scenes/TitleScene";
import { BrowserSceneRenderer } from "@/scenes/BrowserScene";
import { TerminalSceneRenderer } from "@/scenes/TerminalScene";
import { DesktopSceneRenderer } from "@/scenes/DesktopScene";
import { CodeSceneRenderer } from "@/scenes/CodeScene";
import { OutroSceneRenderer } from "@/scenes/OutroScene";
import {
  ReelPlan,
  Scene,
  sceneDurationFrames,
  sceneStartFrame,
} from "@/types/plan";

const renderScene = (scene: Scene, rtl: boolean) => {
  switch (scene.type) {
    case "title":
      return <TitleSceneRenderer scene={scene} rtl={rtl} />;
    case "browser":
      return <BrowserSceneRenderer scene={scene} />;
    case "terminal":
      return <TerminalSceneRenderer scene={scene} />;
    case "desktop":
      return <DesktopSceneRenderer scene={scene} />;
    case "code":
      return <CodeSceneRenderer scene={scene} />;
    case "outro":
      return <OutroSceneRenderer scene={scene} />;
  }
};

const wantsBackdropRings = (s: Scene) =>
  s.type === "browser" || s.type === "terminal" || s.type === "code" || s.type === "outro";

export const ReelComposition: React.FC<{
  plan: ReelPlan;
  audioFile?: string | null;
  musicFile?: string | null;
}> = ({ plan, audioFile = null, musicFile = null }) => {
  const fps = plan.meta.fps;
  const rtl = plan.meta.language === "he";

  return (
    <AbsoluteFill style={{ direction: rtl ? "rtl" : "ltr" }}>
      <GradientBackground />

      {plan.scenes.map((scene, i) => {
        const from = sceneStartFrame(plan, i);
        const duration = sceneDurationFrames(scene, fps);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration}>
            {wantsBackdropRings(scene) && (
              <GlowRings
                centerX={540}
                centerY={960}
                baseSize={1200}
                count={4}
                cadence={40}
                intensity={scene.type === "outro" ? 1 : 0.4}
              />
            )}
            {renderScene(scene, rtl)}
          </Sequence>
        );
      })}

      {/* Captions overlay (frame-based, computed from seconds at the plan fps) */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {plan.captions.map((c, i) => (
          <PopupCaption
            key={i}
            text={c.text}
            x={c.x ?? 540}
            y={c.y ?? 1300}
            startAt={Math.round(c.at * fps)}
            hold={Math.round(c.hold * fps)}
            rotation={c.rotation}
            variant={c.variant}
          />
        ))}
      </AbsoluteFill>

      {audioFile && <Audio src={staticFile(audioFile)} />}
      {musicFile && <Audio src={staticFile(musicFile)} volume={0.18} />}
    </AbsoluteFill>
  );
};
