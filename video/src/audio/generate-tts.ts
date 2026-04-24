/**
 * Plan-driven voice-over generation.
 *
 * Reads a plan JSON, concatenates per-scene narration into one continuous
 * voice-over, and writes both:
 *   - public/audio/<plan-id>.mp3 (the audio)
 *   - public/audio/<plan-id>.timing.json (per-scene start/end seconds, computed)
 *
 * Run:
 *   ELEVENLABS_API_KEY=... npx tsx src/audio/generate-tts.ts plans/setup-claude-code.json
 *   OPENAI_API_KEY=...    npx tsx src/audio/generate-tts.ts plans/setup-claude-code.json
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, basename } from "node:path";
import { ReelPlan } from "@/types/plan";

const OUT_DIR = resolve(process.cwd(), "public/audio");
mkdirSync(OUT_DIR, { recursive: true });

interface Provider {
  generate(text: string, voiceId?: string, language?: string): Promise<Buffer>;
}

const eleven: Provider = {
  async generate(text, voiceId, language) {
    const key = process.env.ELEVENLABS_API_KEY!;
    const id =
      voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? "pNInz6obpgDQGcFmaJgB";
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${id}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.85,
            style: 0.5,
            use_speaker_boost: true,
          },
          language_code: language === "he" ? "he" : undefined,
        }),
      },
    );
    if (!res.ok) {
      throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
    }
    return Buffer.from(await res.arrayBuffer());
  },
};

const openai: Provider = {
  async generate(text) {
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
        input: text,
        response_format: "mp3",
        speed: 1.05,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    return Buffer.from(await res.arrayBuffer());
  },
};

const pickProvider = (): Provider => {
  if (process.env.ELEVENLABS_API_KEY) return eleven;
  if (process.env.OPENAI_API_KEY) return openai;
  throw new Error(
    "Set ELEVENLABS_API_KEY or OPENAI_API_KEY to generate the voice-over.",
  );
};

export async function generateVoiceover(planPath: string): Promise<{
  audioPath: string;
  timingPath: string;
}> {
  const planJson = JSON.parse(readFileSync(planPath, "utf-8"));
  const plan = ReelPlan.parse(planJson);

  const fullScript = plan.scenes
    .map((s) => s.narration?.trim() ?? "")
    .filter((t) => t.length > 0)
    .join(" ");

  if (!fullScript) {
    throw new Error("Plan has no narration text");
  }

  console.log(`→ generating voice-over for ${plan.meta.id} (${fullScript.length} chars)…`);
  const provider = pickProvider();
  const audio = await provider.generate(
    fullScript,
    plan.meta.voiceId,
    plan.meta.language,
  );

  const audioPath = resolve(OUT_DIR, `${plan.meta.id}.mp3`);
  writeFileSync(audioPath, audio);

  // Naive per-scene timing: distribute total duration proportional to
  // each scene's planned durationSeconds. A future pass with whisper.cpp
  // can rewrite this with word-level alignment.
  const totalDuration = plan.scenes.reduce(
    (a, s) => a + s.durationSeconds,
    0,
  );
  let cursor = 0;
  const timing = plan.scenes.map((s) => {
    const start = cursor;
    cursor += s.durationSeconds;
    return {
      sceneId: s.id,
      start,
      end: cursor,
      narration: s.narration ?? "",
    };
  });

  const timingPath = resolve(OUT_DIR, `${plan.meta.id}.timing.json`);
  writeFileSync(
    timingPath,
    JSON.stringify({ totalDuration, scenes: timing }, null, 2),
  );

  console.log(`✓ ${audioPath} (${(audio.length / 1024).toFixed(1)} KB)`);
  console.log(`✓ ${timingPath}`);
  return { audioPath, timingPath };
}

if (process.argv[1] && process.argv[1].endsWith("generate-tts.ts")) {
  const planPath = process.argv[2];
  if (!planPath) {
    console.error("usage: tsx src/audio/generate-tts.ts <plan.json>");
    process.exit(1);
  }
  generateVoiceover(resolve(planPath)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
