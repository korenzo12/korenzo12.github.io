/**
 * Voice-over generation pipeline.
 *
 * Supports two providers (auto-detected from env):
 *  - ELEVENLABS_API_KEY: highest quality (recommended). See https://elevenlabs.io
 *  - OPENAI_API_KEY:     good quality, cheaper
 *
 * Run:
 *   ELEVENLABS_API_KEY=... npm run tts
 *
 * Output: public/audio/voiceover.mp3
 *
 * Edit NARRATION below to change what's spoken; timings in src/data/script.ts
 * should be re-tuned to match the new audio length.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const NARRATION = `
Wanna setup Claude Code on any Mac in 30 seconds?
Open Google, search vs code, and open the site.
Click Download for macOS, install the code editor.
Now right click on the desktop and choose New Folder.
Open it in VS Code, hit terminal, and run claude code.
Done.
`.trim();

const OUT_DIR = resolve(process.cwd(), "public/audio");
mkdirSync(OUT_DIR, { recursive: true });

async function generateElevenLabs(): Promise<Buffer> {
  const key = process.env.ELEVENLABS_API_KEY!;
  // "Adam" - clean male voice. Replace with any voice ID you prefer.
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? "pNInz6obpgDQGcFmaJgB";
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=0`,
    {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: NARRATION,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.85,
          style: 0.55,
          use_speaker_boost: true,
        },
      }),
    },
  );
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generateOpenAI(): Promise<Buffer> {
  const key = process.env.OPENAI_API_KEY!;
  const voice = process.env.OPENAI_VOICE ?? "onyx";
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1-hd",
      voice,
      input: NARRATION,
      response_format: "mp3",
      speed: 1.05,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  let audio: Buffer;
  if (process.env.ELEVENLABS_API_KEY) {
    console.log("→ generating with ElevenLabs…");
    audio = await generateElevenLabs();
  } else if (process.env.OPENAI_API_KEY) {
    console.log("→ generating with OpenAI…");
    audio = await generateOpenAI();
  } else {
    throw new Error(
      "Set ELEVENLABS_API_KEY or OPENAI_API_KEY to generate the voice-over.",
    );
  }
  const out = resolve(OUT_DIR, "voiceover.mp3");
  writeFileSync(out, audio);
  console.log(`✓ voice-over written to ${out} (${(audio.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
