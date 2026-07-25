# @easysimplecool/design-system — Figma Make Guidelines

This kit uses **CSS tokens only** from `@easysimplecool/design-system`. There are no React components (no Button, Input, etc.). Style HTML / Base UI with `var(--ds-*)` and `var(--sa-*)`.

## Product character

- **Brand**: Second Act by default; Aware via `data-brand="aware"`.
- **Theming**: Multidimensional axes on `<html>` (`data-accent`, `data-type`, `data-canvas`, `data-elevation`, `data-radius`, `data-brand`) — not a single light/dark class.
- **Surfaces**: Warm canvas (`--ds-color-surface-secondary`) with elevated cards (`--sa-surface-elevated` / `--ds-color-surface-primary`). Hierarchy comes from surface contrast, then shadows when elevation is soft/dramatic.
- **Accent**: Sparse. Use `--sa-accent` for primary CTAs, links, and small highlights — never as a large page or section fill.
- **Type**: Role fonts from `--sa-font-display|label|body`. Change personality with `data-type`, not by hardcoding Inter/Arial.

## Token namespaces

| Prefix | Sheet | Use for |
|---|---|---|
| `--sa-*` | `theme.css` | Themed UI first: accent, font roles, elevated/glass surfaces, card/modal radius, shadows |
| `--ds-*` | `variables.css` (+ theme overrides) | Primitives: palette, ink/text/border, base radii, font families/weights, button CSS vars |

**Priority:** prefer `--sa-*` when it exists for the decision. Fall back to `--ds-*`. Do not invent shadcn/Tailwind semantic names (`--background`, `--primary`, `bg-gray-100`).

## Format quirks (read first)

1. Colors, radii, and shadows are **already complete CSS values**. Use `var(--token)` directly. Do **not** wrap with `calc(var(...) * 1px)`.
2. Shadows (`--sa-shadow-*`) are full `box-shadow` strings.
3. This package publishes **no spacing scale**. Use the allowed spacing ladder in `foundations/typography.md` (layout section) — do not invent `--ds-spacing-*` tokens.
4. CSS names use American spelling: `color`, not `colour`.

## Reading order

**MUST READ before writing any code:**

1. This file (`Guidelines.md`)
2. `setup.md` — CSS imports + theme attributes
3. `foundations/color.md`
4. `foundations/typography.md`
5. `foundations/radius-elevation.md`
6. `foundations/buttons.md`
7. `themes.md`
8. `anti-patterns.md`

## Hard rules

- Always import **both** `variables.css` and `theme.css` (variables first).
- Style with `var(--ds-*)` / `var(--sa-*)` only for colors, radii, shadows, and font families/weights that exist as tokens.
- Do **not** hardcode hex/rgb for brand colors, surfaces, ink, borders, or accents.
- Do **not** use Tailwind palette utilities (`bg-gray-*`, `text-slate-*`, `bg-white`) for themed surfaces or text.
- Do **not** use shadcn/Base UI default theme tokens (`bg-background`, `text-foreground`, `bg-primary`, `border-border`).
- Do **not** import a Button/Input from this package — none exist. Style native elements with button tokens (see `foundations/buttons.md`).
- Do **not** toggle theme with a `.dark` class. Use `data-canvas="dark"` (and other `data-*` axes).
- Do **not** edit or regenerate token CSS inside a Make project. Request token changes in Tokens Studio / this package.
- One primary CTA per visible section; accent stays sparse.

## Workflows

### New screen

1. Confirm CSS imports + default `data-*` attrs on `<html>` (`setup.md`).
2. Pick canvas/surface/text from `foundations/color.md`.
3. Apply type roles from `foundations/typography.md`.
4. Apply radius/shadow from `foundations/radius-elevation.md`.
5. Wire buttons from `foundations/buttons.md`.

### Change theme personality

Set or change attributes on `<html>` per `themes.md`. Do not override `--sa-*` / `--ds-*` with hardcoded values to “fake” a theme.
