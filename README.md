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

This package ships **CSS only** — no React components. Figma Make generates UI and styles it with your tokens.

See [Bring your design system package to a Make kit](https://developers.figma.com/docs/code/bring-your-design-system-package/) for kit assembly details.

#### 1. Pin the package

Use the version from npm after each token publish (CI prints this in the workflow summary):

```json
{
  "dependencies": {
    "@easysimplecool/design-system": "0.2.46"
  }
}
```

#### 2. Import both stylesheets

```js
import "@easysimplecool/design-system/variables.css";
import "@easysimplecool/design-system/theme.css";
```

#### 3. Add guidelines to the Make kit

After `npm run build`, copy [`dist/guidelines.md`](dist/guidelines.md) into your Make kit guidelines. The file is also published at `@easysimplecool/design-system/guidelines.md` and lists every theme axis from `$themes.json`.

Set axis attributes on `<html>` (e.g. `data-accent="teal"`, `data-canvas="warm"`) — see [Second Act `theme.js`](https://github.com/EasySimpleCool/secondact/blob/main/theme.js) for a reference runtime.

#### 4. Assemble the Make kit

1. In Figma Make → create or edit your Make kit
2. Add the npm dependency (step 1)
3. Paste `dist/guidelines.md` into kit guidelines (step 3)
4. Optionally import your Figma Design library variables (complements the npm CSS)
5. Publish the kit to your org or set as default for new Make files

After each token publish, update the kit dependency version and refresh guidelines from the new npm release.

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

Output: `dist/variables.css` + `dist/theme.css` + `dist/guidelines.md`. Consumer apps should not run this.

## Folder structure

```
npm-test/
├── src/tokens/              # Tokens Studio source of truth (multifile + $themes.json)
├── dist/
│   ├── variables.css        # Core + Button — generated + committed
│   ├── theme.css            # Multidimensional axis blocks — generated + committed
│   └── guidelines.md        # Figma Make kit guidelines — generated + committed
├── guidelines/
│   └── guidelines.md        # Pointer to dist/guidelines.md for Make kit authors
├── scripts/
│   ├── load-tokens.mjs
│   ├── build-all.mjs
│   ├── build-theme.mjs
│   ├── generate-make-guidelines.mjs
│   └── validate-tokens.mjs
├── test/                    # schema, resolve, golden, build tests
├── style-dictionary.config.js
└── .github/workflows/sync-tokens.yml
```
