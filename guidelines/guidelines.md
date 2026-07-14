# Design System Guidelines (Make Kit)

This project uses `@easysimplecool/design-system` — the **Second Act** design
system. Follow these rules exactly; do not deviate even if it seems like a
small convenience.

## Core rule

Always prefer a component from `@easysimplecool/design-system` over a raw HTML
element or a custom-built equivalent. If a component exists for the job,
use it. Do not invent a new one.

## Typography

Three font families, loaded by the consuming app (Google Fonts):

- **Anton** — display headings, large numerals (all caps via CSS)
- **Space Grotesk** — body text, buttons, UI labels
- **Space Mono** — nav links, tickers, metadata, legal

Use typography utility classes where available: `ds-text-display-hero`,
`ds-text-display-lg`, `ds-text-body-md`, `ds-text-mono-sm`, etc.

Do not hardcode font sizes or families.

## Colors

Warm neutral base (ink + cream surfaces) with five character accent colors:
teal, gold, terracotta, purple, green.

- Reference tokens: `colors.ink`, `colors.accent.gold`, etc.
- Use semantic text tokens: `text.primary`, `text.muted`, `text.on-dark`
- Do not hardcode hex values

## Components

### Button
- Import: `import { Button } from '@easysimplecool/design-system'`
- `variant="primary"` — main CTA (ink fill, white text, pill)
- `variant="secondary"` — hero supporting action (cream fill, border)
- `variant="ghost"` — low-emphasis links (watch film, quiz-adjacent)
- `variant="overlay"` — small controls on image cards (replace, edit)
- Do not add custom colors or border-radius via inline styles

### Input
- `variant="field"` (default) — labeled form input with optional error
- `variant="quiz"` — large clickable quiz answer pill; pass children for label text
- Always pass a `label` on field variant unless purpose is unambiguous

### NavBar + NavLink
- `NavBar` — logo left, links center, CTA right; pass `links` array and optional `cta`
- `NavLink` — uppercase mono link; use `onDark` when placed on dark backgrounds

### SectionContainer
- Wraps full-width page sections with warm or accent backgrounds
- `variant`: `primary | secondary | tertiary | accent-teal | accent-gold | accent-terracotta | accent-purple | accent-green`

### CastCard
- Character profile with image, gradient scrim, name + bio
- Optional `characterTheme` for accent-colored name
- Optional `actions` array renders overlay buttons

### FilmCard
- Thumbnail + title + episode/runtime for horizontal reels
- Optional `accent` for themed title color

### CountdownTimer
- Pass `targetDate` for live countdown, or static `values` object
- Last unit (seconds) uses gold accent by default

### MarqueeTicker
- Repeating horizontal announcement strip
- Props: `text`, `speed` (seconds per loop), `pauseOnHover`

## Tokens

- Import from `@easysimplecool/design-system`: `colors`, `spacing`, `fontFamilies`,
  `fontSizes`, `typography`, `radii`
- CSS custom properties are auto-included via the package entry point
- If a value you need doesn't exist in tokens, use the closest existing token

## Preview app

Run `npm run dev:preview` to open a composed landing page for visual QA.

## General

- If unsure whether a component or token exists, check
  `node_modules/@easysimplecool/design-system/dist/index.d.ts` for the full
  exported API before writing custom code.
- Keep all new UI consistent with Second Act styling (warm neutrals, Anton
  display, pill buttons) even when building something not explicitly covered here.
