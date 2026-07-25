# Project setup

## Required CSS imports

Import **both** stylesheets. Order matters: base variables first, theme second.

```tsx
import "@easysimplecool/design-system/variables.css";
import "@easysimplecool/design-system/theme.css";
```

Import them once at the app entry (e.g. `src/main.tsx` or the root CSS file). Do not re-declare token values in local CSS.

## Make kit dependency

Pin the published package version in the kit (update after each token publish):

```json
"@easysimplecool/design-system": "0.2.46"
```

This package ships **CSS only**. There is no JS entry, no `ThemeProvider`, and no components.

## Theme attributes on `<html>`

Set multidimensional theme axes as attributes on the document element. Defaults match `:root` in `theme.css` when attributes are omitted (green accent, cinematic type, warm canvas, soft elevation, round radius, Second Act brand).

```tsx
useEffect(() => {
  const root = document.documentElement;
  root.dataset.accent = "green";
  root.dataset.type = "cinematic";
  root.dataset.canvas = "warm"; // warm is default; omit or set explicitly
  root.dataset.elevation = "soft";
  root.dataset.radius = "round";
  // root.dataset.brand = "aware"; // only when using Aware brand
}, []);
```

Or in plain HTML:

```html
<html
  data-accent="green"
  data-type="cinematic"
  data-canvas="warm"
  data-elevation="soft"
  data-radius="round"
>
```

Allowed values and when to change them: see `themes.md`.

Legacy alias: `data-theme="<accent>"` also sets accent (same as `data-accent`). Prefer `data-accent`.

## Build notes

- Make uses Vite + React 18. The design-system package is plain CSS — no Vite plugins required for it.
- Do not add Style Dictionary, Tokens Studio, or token build scripts to the Make project.
- Do not add `@source` / Tailwind theme bridges for this package unless you explicitly map utilities to the same `var(--ds-*)` / `var(--sa-*)` names. Prefer inline CSS / CSS modules / style props that call `var(...)`.

## Rules

- Always load `variables.css` then `theme.css`
- Always style themed UI through CSS variables from those sheets
- Change look via `data-*` on `<html>`, not by editing generated CSS
- Do not invent a parallel theme file that redefines brand colors
