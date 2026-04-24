/**
 * Generates a reel plan from a free-form topic using the Claude API.
 *
 * Usage (programmatic):
 *   import { generatePlan } from "./plan-with-claude";
 *   const plan = await generatePlan({ topic: "How to install Cursor in 30 seconds" });
 *
 * Or via the CLI: see bin/create.ts
 *
 * Environment:
 *   ANTHROPIC_API_KEY — required
 *   CLAUDE_MODEL      — optional, defaults to claude-sonnet-4-6
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { ReelPlan } from "@/types/plan";
import { PLAN_SYSTEM_PROMPT } from "./system-prompt";

export interface GeneratePlanOptions {
  topic: string;
  language?: "en" | "he";
  durationSeconds?: number;
  /** Optional path to a sample plan to give Claude as a few-shot example */
  examplePath?: string;
  model?: string;
}

const DEFAULT_MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-6";

const stripJsonFence = (s: string): string => {
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  return (fenced?.[1] ?? s).trim();
};

export async function generatePlan({
  topic,
  language = "en",
  durationSeconds = 30,
  examplePath,
  model = DEFAULT_MODEL,
}: GeneratePlanOptions): Promise<ReelPlan> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const client = new Anthropic({ apiKey });

  const example = examplePath
    ? readFileSync(resolve(examplePath), "utf-8")
    : readFileSync(
        resolve(process.cwd(), "plans/setup-claude-code.json"),
        "utf-8",
      );

  const userMessage = [
    `Topic: ${topic}`,
    `Language: ${language}`,
    `Target duration: ${durationSeconds} seconds`,
    "",
    "Example of a valid plan in the same style (study its structure, then write a NEW plan for the topic above):",
    example,
    "",
    "Output ONLY the JSON for the new plan.",
  ].join("\n");

  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    system: PLAN_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text block");
  }
  const json = stripJsonFence(textBlock.text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error(
      `Claude returned invalid JSON:\n${json}\n\nParse error: ${(e as Error).message}`,
    );
  }

  const result = ReelPlan.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Plan failed schema validation:\n${result.error.toString()}\n\nReceived:\n${JSON.stringify(parsed, null, 2)}`,
    );
  }
  return result.data;
}
