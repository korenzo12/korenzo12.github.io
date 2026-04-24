# Setup Claude Code in 30 Seconds — Reel Generator

Programmatic, fully-automated vertical reel (1080×1920, 30 fps) built with
[Remotion](https://remotion.dev).

The output is a polished 30-second how-to in the style of `@alex.snippet`:
warm-amber gradient, expanding glow rings, animated cursor, popup word
captions, plus screen-recording-style scenes for the browser, VS Code site,
macOS desktop and terminal — all driven entirely from code so you can
re-render the video any time the steps change.

## Quick start

```bash
cd video
npm install
npx playwright install chromium       # only needed for real browser recording
npm run dev                            # opens the Remotion Studio in the browser
```

Render to MP4:

```bash
npm run build       # standard quality
npm run build:hq    # higher quality
```

## Pipeline

```
        ┌─────────────────────┐
        │ data/script.ts      │  narration text + timing cues
        └──────────┬──────────┘
                   │
   ┌───────────────┼─────────────────┐
   │               │                 │
   ▼               ▼                 ▼
audio/        scenes/+components/  automation/playwright/
generate-tts  Remotion render      real browser recordings
   │               │                 │
   ▼               ▼                 ▼
voiceover.mp3   final MP4          recordings/*.webm
```

### Generate voice-over

```bash
ELEVENLABS_API_KEY=... npm run tts        # best quality
# or
OPENAI_API_KEY=... npm run tts            # cheaper fallback
```

### Align captions to the voice-over (optional)

```bash
npx tsx src/audio/sync-captions.ts
```

This runs `whisper.cpp` locally and writes word-level timestamps that you
can plug into `script.ts` so every popup caption lands on the exact frame
its word is spoken.

### Record real browser footage (optional)

The default scenes use pixel-perfect React mockups (`MockGoogleSearch`,
`MockVSCodeWebsite`) so the demo never breaks when an external site
changes. If you'd rather use real recordings, run:

```bash
npm run record:browser
```

Output appears in `public/recordings/`. Replace the relevant `<MockBrowser>`
contents with `<Video src={staticFile("/recordings/google.webm")} />`.

## Directory layout

```
video/
├─ src/
│  ├─ Root.tsx                 # composition registry
│  ├─ index.ts                 # registerRoot() entry
│  ├─ compositions/            # top-level composition
│  ├─ scenes/                  # one file per scene
│  ├─ components/              # reusable UI: bg, rings, cursor, mocks
│  ├─ theme/                   # colors / typography / easing tokens
│  ├─ data/script.ts           # narration + timing
│  ├─ utils/animation.ts       # spring / lerp / bezier helpers
│  ├─ audio/                   # TTS + caption sync scripts
│  └─ automation/playwright/   # real browser recording scripts
├─ public/
│  ├─ audio/                   # generated voice-over + captions JSON
│  ├─ recordings/              # generated browser recordings
│  └─ images/                  # any static images used in scenes
├─ package.json
├─ remotion.config.ts
└─ tsconfig.json
```

## Customising

- **Narration & timing:** edit `src/data/script.ts`.
- **Colors:** edit `src/theme/colors.ts`.
- **Length:** change `script.totalDurationFrames` and the per-scene `from`/`to`
  cues; the master composition picks them up automatically.
- **Captions style:** edit `src/components/PopupCaption.tsx`.
- **Cursor path:** edit the `cursorPath` array inside each scene.

## License

Personal/educational use only.
