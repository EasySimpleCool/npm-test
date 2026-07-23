# Second Act Design System Guidelines

Source of truth for Figma Make kit content: **`dist/guidelines.md`**, regenerated on every `npm run build:tokens`.

Copy the contents of `dist/guidelines.md` into your Make kit guidelines after each token publish. You can also read it from the published package at `@easysimplecool/design-system/guidelines.md`.

The generated file covers both **Second Act** and **Aware Super** brands: bootstrap setup, troubleshooting, theme axes, typography, auto-generated token catalogs, UI patterns, and local component recipes — aligned with the CSS-only package (`variables.css` + `theme.css`).

Curated content lives in [`guidelines/fragments/`](fragments/); the build merges fragments with auto-generated token tables in [`scripts/generate-make-guidelines.mjs`](../scripts/generate-make-guidelines.mjs).
