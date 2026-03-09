# TypeSlow

A typing analytics and training app with detailed performance breakdowns, adaptive practice drills, and session history.

## Features

- **Typing Test** — Timed (15/30/60/120s) or word count (10/25/50/100) modes with common words, quotes, or programming keywords
- **Analytics Dashboard** — Keyboard heatmap, bigram/trigram tables, finger/hand/row stats, error patterns, trend charts
- **Practice Drills** — Auto-generated exercises targeting your weakest bigrams and slowest fingers
- **Session History** — Track progress over time with export/import support

## Tech Stack

- SvelteKit (Svelte 5 with runes)
- TypeScript
- Tailwind CSS v4 (Tokyonight dark theme)
- Chart.js (trend lines)
- Static SPA (`@sveltejs/adapter-static`)
- localStorage for persistence

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview
```

Static output goes to `build/`.

## Project Structure

```
src/
├── lib/
│   ├── config/       # Keyboard layout mappings (key→finger/hand/row)
│   ├── types/        # TypeScript interfaces
│   ├── engine/       # Pure TS: typing engine, bigram/trigram analysis, WPM, text generation
│   ├── services/     # localStorage persistence, quote fetching
│   ├── stores/       # Svelte 5 rune-based state (test, analytics, history, settings)
│   └── components/   # UI: typing/, analytics/, practice/, layout/, shared/
├── routes/
│   ├── +page.svelte           # Typing test
│   ├── analytics/+page.svelte # Analytics dashboard
│   ├── practice/+page.svelte  # Practice drills
│   └── history/+page.svelte   # Session history
└── static/data/               # Bundled word lists, quotes, programming keywords
```

## Architecture

- Raw keystrokes are the single source of truth — all analytics are derived from `Keystroke[]`
- The typing engine (`lib/engine/`) is pure TypeScript with zero Svelte imports, making it unit-testable
- Keyboard heatmap uses HTML/CSS divs (not Canvas/SVG)
- Chart.js is used only for line/bar charts (trends, finger stats)
- Quotes use stale-while-revalidate: cached in localStorage, refreshed in background
- Raw keystroke data is capped at 50 sessions; older sessions keep summaries only
