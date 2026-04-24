/**
 * Whisper-based caption alignment.
 *
 * Reads public/audio/voiceover.mp3, runs whisper.cpp locally (no cloud),
 * and writes word-level timestamps to public/audio/captions.json.
 *
 * The Remotion side (src/data/script.ts) can then import that JSON to
 * place each PopupCaption at the exact frame the corresponding word
 * is spoken.
 *
 * Run:
 *   npm run tts          # generate voiceover.mp3 first
 *   npx tsx src/audio/sync-captions.ts
 */
import {
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const WHISPER_PATH = resolve(process.cwd(), ".cache/whisper");
const MODEL = "medium.en";
const AUDIO = resolve(process.cwd(), "public/audio/voiceover.mp3");
const OUT = resolve(process.cwd(), "public/audio/captions.json");

async function main() {
  mkdirSync(WHISPER_PATH, { recursive: true });
  await installWhisperCpp({ to: WHISPER_PATH, version: "1.5.5" });

  const result = await transcribe({
    inputPath: AUDIO,
    whisperPath: WHISPER_PATH,
    whisperCppVersion: "1.5.5",
    model: MODEL,
    tokenLevelTimestamps: true,
  });

  const { captions } = toCaptions({
    whisperCppOutput: result,
  });

  writeFileSync(OUT, JSON.stringify(captions, null, 2));
  console.log(`✓ aligned ${captions.length} captions → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
