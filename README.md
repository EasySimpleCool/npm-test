# @easysimplecool/design-system

CSS custom properties generated from Figma via Tokens Studio + Style Dictionary.
Consumers get **`dist/variables.css`** (base `--ds-*` primitives) and **`dist/theme.css`** (multidimensional theme axes) — no React, no Style Dictionary.

## Pipeline

1. Edit tokens in Figma → Tokens Studio **push** → updates `src/tokens/*.json`
2. GitHub Action runs Style Dictionary + theme builder → commits `dist/variables.css` and `dist/theme.css` → publishes to npm
3. Apps import the CSS and use `var(--ds-…)` / `var(--sa-…)`

## Consume (CSS only)

### Base tokens only

```js
import "@easysimplecool/design-system/variables.css";
```

### Multidimensional theme switcher

Load **both** stylesheets (theme second). Axis options come from `$themes.json` — one CSS block per axis value (accent, type, canvas, elevation, radius, brand), not every permutation.

```js
import "@easysimplecool/design-system/variables.css";
import "@easysimplecool/design-system/theme.css";
```

Set axis attributes on `<html>` (e.g. `data-accent`, `data-canvas`, `data-brand`) from your app — see [Second Act `theme.js`](https://github.com/EasySimpleCool/secondact/blob/main/theme.js) for a reference runtime.

### Cursor / Claude Code / any Node project

```bash
npm install @easysimplecool/design-system
```

```js
import "@easysimplecool/design-system/variables.css";
```

Then use tokens in your CSS or inline styles:

```css
.button {
  color: var(--ds-color-ink);
  background: var(--ds-color-surface-secondary);
}
```

### Figma Make

Pin the package in the Make kit dependencies (use the version from npm after each token publish):

```json
"@easysimplecool/design-system": "0.2.43"
```

Import the stylesheet the same way — this package ships CSS only (no Button/Input components).

```js
import "@easysimplecool/design-system/variables.css";
```

### Static sites / no package manager

Link the published file via jsDelivr (mirrors npm):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@easysimplecool/design-system/dist/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@easysimplecool/design-system/dist/theme.css">
```

Pin a version for a frozen snapshot (replace with the version you want):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@easysimplecool/design-system@0.2.46/dist/variables.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@easysimplecool/design-system@0.2.46/dist/theme.css">
```

## Local kitchen build (maintainers only)

```bash
npm install
npm run build
```

Output: `dist/variables.css` + `dist/theme.css`. Consumer apps should not run this.

## Folder structure

```
npm-test/
├── src/tokens/              # Tokens Studio source of truth (multifile + $themes.json)
├── dist/
│   ├── variables.css        # Core + Button — generated + committed
│   └── theme.css            # Multidimensional axis blocks — generated + committed
├── scripts/
│   ├── load-tokens.mjs
│   ├── build-all.mjs
│   ├── build-theme.mjs
│   └── validate-tokens.mjs
├── test/                    # schema, resolve, golden, build tests
├── style-dictionary.config.js
└── .github/workflows/sync-tokens.yml
```
