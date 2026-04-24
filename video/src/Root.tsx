import { Composition } from "remotion";
import { z } from "zod";
import { ClaudeCodeSetup } from "@/compositions/ClaudeCodeSetup";
import { script } from "@/data/script";
import { VIDEO } from "@/theme";

const schema = z.object({
  withVoiceover: z.boolean(),
  withMusic: z.boolean(),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClaudeCodeSetup"
        component={ClaudeCodeSetup}
        durationInFrames={script.totalDurationFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        schema={schema}
        defaultProps={{
          withVoiceover: false,
          withMusic: false,
        }}
      />
    </>
  );
};
