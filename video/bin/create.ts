#!/usr/bin/env -S npx tsx
/**
 * One-shot CLI: turn a topic into a finished MP4.
 *
 * Pipeline:
 *   1. Ask Claude for a plan JSON       (skip with --plan <path> to use an existing plan)
 *   2. Pause for human edit              (skip with --no-edit)
 *   3. Generate voice-over via TTS       (skip with --no-tts; renders silent video)
 *   4. Render the MP4 with Remotion      (skip with --no-render)
 *
 * Usage:
 *   npx tsx bin/create.ts "How to install Cursor in 30 seconds"
 *   npx tsx bin/create.ts --plan plans/setup-claude-code.json --no-edit
 *   npx tsx bin/create.ts "Setup Docker in 30 seconds" --language en --duration 28
 *
 * Environment:
 *   ANTHROPIC_API_KEY          (for plan generation)
 *   ELEVENLABS_API_KEY | OPENAI_API_KEY  (for TTS)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, basename } from "node:path";
import { spawn } from "node:child_process";
import { generatePlan } from "@/generator/plan-with-claude";
import { generateVoiceover } from "@/audio/generate-tts";
import { ReelPlan } from "@/types/plan";

interface Args {
  topic?: string;
  planPath?: string;
  language: "en" | "he";
  duration: number;
  edit: boolean;
  tts: boolean;
  render: boolean;
}

const parseArgs = (): Args => {
  const argv = process.argv.slice(2);
  let topic: string | undefined;
  let planPath: string | undefined;
  let language: "en" | "he" = "en";
  let duration = 30;
  let edit = true;
  let tts = true;
  let render = true;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a === "--plan") planPath = argv[++i]!;
    else if (a === "--language") language = argv[++i] as "en" | "he";
    else if (a === "--duration") duration = Number(argv[++i]);
    else if (a === "--no-edit") edit = false;
    else if (a === "--no-tts") tts = false;
    else if (a === "--no-render") render = false;
    else if (!a.startsWith("--")) topic = topic ? `${topic} ${a}` : a;
  }

  return { topic, planPath, language, duration, edit, tts, render };
};

const promptUser = async (msg: string): Promise<void> => {
  process.stdout.write(msg);
  await new Promise<void>((res) => {
    const onData = (chunk: Buffer) => {
      if (chunk.toString().includes("\n")) {
        process.stdin.off("data", onData);
        process.stdin.pause();
        res();
      }
    };
    process.stdin.resume();
    process.stdin.on("data", onData);
  });
};

const run = (cmd: string, args: string[]): Promise<void> =>
  new Promise((res, rej) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) =>
      code === 0 ? res() : rej(new Error(`${cmd} exited with ${code}`)),
    );
  });

async function main() {
  const args = parseArgs();

  // ─── Step 1: get a plan ─────────────────────────────────────────────────
  let planPath: string;
  if (args.planPath) {
    planPath = resolve(args.planPath);
    console.log(`→ using existing plan: ${planPath}`);
  } else {
    if (!args.topic) {
      console.error('usage: tsx bin/create.ts "<topic>" [options]');
      process.exit(1);
    }
    console.log(`→ asking Claude for a plan on: "${args.topic}"`);
    const plan = await generatePlan({
      topic: args.topic,
      language: args.language,
      durationSeconds: args.duration,
    });
    mkdirSync(resolve(process.cwd(), "plans"), { recursive: true });
    planPath = resolve(process.cwd(), "plans", `${plan.meta.id}.json`);
    writeFileSync(planPath, JSON.stringify(plan, null, 2));
    console.log(`✓ plan written: ${planPath}`);
  }

  // ─── Step 2: optional edit pause ────────────────────────────────────────
  if (args.edit) {
    console.log(
      `\n→ Edit ${planPath} now if you want to tweak anything (text, timings, cursor paths, captions).`,
    );
    await promptUser("  Press Enter when ready to continue, or Ctrl+C to abort… ");
  }

  // Reload plan after potential edit
  const plan = ReelPlan.parse(JSON.parse(readFileSync(planPath, "utf-8")));
  const planId = plan.meta.id;

  // ─── Step 3: voice-over ─────────────────────────────────────────────────
  let audioPath: string | null = null;
  if (args.tts) {
    try {
      const r = await generateVoiceover(planPath);
      audioPath = `/audio/${basename(r.audioPath)}`;
    } catch (e) {
      console.warn(`⚠ TTS failed: ${(e as Error).message}`);
      console.warn("  rendering silent video. set ELEVENLABS_API_KEY / OPENAI_API_KEY to enable voice-over.");
    }
  }

  // ─── Step 4: render ─────────────────────────────────────────────────────
  if (args.render) {
    mkdirSync(resolve(process.cwd(), "out"), { recursive: true });
    const outPath = resolve(process.cwd(), "out", `${planId}.mp4`);
    const inputProps = JSON.stringify({
      audioFile: audioPath,
      musicFile: null,
    });
    await run("npx", [
      "remotion",
      "render",
      "src/index.ts",
      planId,
      outPath,
      "--props",
      inputProps,
    ]);
    console.log(`\n✓ rendered: ${outPath}`);
  } else {
    console.log("\n✓ skipped render. Open the studio with: npm run dev");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
