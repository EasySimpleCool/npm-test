# Design System Guidelines

This project ships **CSS tokens only** via `@easysimplecool/design-system`.

## Tokens

- Import: `import "@easysimplecool/design-system/variables.css"`
- Reference values with `var(--ds-*)` (e.g. `var(--ds-color-ink)`).
- Do not hardcode hex colors, px spacing, or font sizes that already exist as tokens.
- If a value you need doesn't exist in tokens, do not invent one — use the closest existing token or request it in Tokens Studio.

## General

- Do not reintroduce Style Dictionary or token build tooling in consumer apps.
- Components (Button, Input, etc.) are out of scope for this package.
