import { Composition, getInputProps } from "remotion";
import { z } from "zod";
import { ReelComposition } from "@/compositions/ReelComposition";
import { ReelPlan, totalDurationFrames } from "@/types/plan";
import { VIDEO } from "@/theme";

/**
 * Plans are JSON files under ./plans. Vite/webpack glob-import bundles them
 * at build time so every plan becomes a registered Remotion composition,
 * named after its meta.id. Choose which one to render with:
 *
 *   remotion render <plan-id> out/<plan-id>.mp4
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const planModules = (import.meta as any).glob("../plans/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const inputPropsSchema = z.object({
  audioFile: z.string().nullable().optional(),
  musicFile: z.string().nullable().optional(),
});

export const RemotionRoot: React.FC = () => {
  const inputProps = inputPropsSchema.parse(getInputProps() ?? {});

  const plans = Object.values(planModules)
    .map((raw) => ReelPlan.safeParse(raw))
    .filter((r): r is { success: true; data: ReelPlan } => r.success)
    .map((r) => r.data);

  return (
    <>
      {plans.map((plan) => (
        <Composition
          key={plan.meta.id}
          id={plan.meta.id}
          component={ReelComposition}
          durationInFrames={totalDurationFrames(plan)}
          fps={plan.meta.fps}
          width={VIDEO.width}
          height={VIDEO.height}
          defaultProps={{
            plan,
            audioFile: inputProps.audioFile ?? null,
            musicFile: inputProps.musicFile ?? null,
          }}
        />
      ))}
    </>
  );
};
