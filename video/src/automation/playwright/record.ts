/**
 * Automated browser recording pipeline.
 *
 * Generates real screen recordings of:
 *   1. Google search for "vs code" (with cursor moving to first result)
 *   2. Visual Studio Code download page (cursor moving to "Download for macOS")
 *
 * Recordings are saved to /public/recordings/ and can be swapped into
 * the Remotion compositions in place of the mock components.
 *
 * Run:
 *   npm run record:browser
 *
 * Requires:
 *   npx playwright install chromium
 */
import { chromium, Page } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve(process.cwd(), "public/recordings");
mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORT = { width: 1080, height: 1500 } as const;
const RECORD_OPTS = {
  recordVideo: { dir: OUT_DIR, size: { ...VIEWPORT } },
  viewport: VIEWPORT,
  deviceScaleFactor: 2,
} as const;

/** Smoothly move the mouse to a target with N intermediate points. */
const smoothMove = async (
  page: Page,
  to: { x: number; y: number },
  steps = 25,
) => {
  await page.mouse.move(to.x, to.y, { steps });
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function recordGoogle() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext(RECORD_OPTS);
  const page = await ctx.newPage();

  await page.goto("https://www.google.com/search?q=vs+code", {
    waitUntil: "networkidle",
  });
  await wait(1200);
  await smoothMove(page, { x: 540, y: 200 }, 20);
  await wait(800);
  await smoothMove(page, { x: 460, y: 760 }, 40);
  await wait(900);

  await ctx.close();
  await browser.close();
  console.log("✓ google recording saved to", OUT_DIR);
}

async function recordVSCode() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext(RECORD_OPTS);
  const page = await ctx.newPage();

  await page.goto("https://code.visualstudio.com", { waitUntil: "networkidle" });
  await wait(1200);
  // Scroll the download CTA into view
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: "smooth" }));
  await wait(900);
  await smoothMove(page, { x: 540, y: 700 }, 30);
  await wait(1200);

  await ctx.close();
  await browser.close();
  console.log("✓ vscode recording saved to", OUT_DIR);
}

async function main() {
  await recordGoogle();
  await recordVSCode();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
