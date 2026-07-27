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

This package ships CSS only (no Button/Input components).

#### 3. Add guidelines to the Make kit

Copy the Make kit translation guidelines from [`guidelines/`](guidelines/) into the kit (start at `Guidelines.md`). They teach Make how to map `--ds-*` / `--sa-*` and `data-*` theme axes instead of default Tailwind/shadcn styling.

Set axis attributes on `<html>` (e.g. `data-accent="teal"`, `data-canvas="warm"`) — see [Second Act `theme.js`](https://github.com/EasySimpleCool/secondact/blob/main/theme.js) for a reference runtime.

#### 4. Assemble the Make kit

1. In Figma Make → create or edit your Make kit
2. Add the npm dependency (step 1)
3. Copy the `guidelines/` contents into kit guidelines, starting at `Guidelines.md` (step 3)
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

Output: `dist/variables.css` + `dist/theme.css`. Consumer apps should not run this.

## Folder structure

```
npm-test/
├── CLAUDE.md                # agent entry point (Claude Code)
├── .cursor/rules/           # Cursor auto-rules (thin pointer to CLAUDE.md)
├── src/tokens/              # Tokens Studio source of truth (multifile + $themes.json)
├── dist/                    # generated + committed CSS (ships to npm)
│   ├── variables.css        # primitives + component vars
│   └── theme.css            # multidimensional axis blocks
├── guidelines/              # CONSUMER docs (shipped in npm — Figma Make kit + apps)
│   ├── Guidelines.md        # consumer entry point
│   ├── parametric-theming.md   # the theming model
│   ├── setup.md, themes.md, anti-patterns.md
│   └── foundations/         # color, typography, radius-elevation, buttons
├── docs/                    # CONTRIBUTOR docs (NOT shipped in npm)
│   ├── project.md           # pipeline overview + repo tour
│   ├── scripts.md           # build scripts reference
│   └── contributing.md      # local workflow, tests, publishing
├── scripts/                 # build + validation
├── test/                    # schema, resolve, golden tests
├── style-dictionary.config.js
└── .github/workflows/sync-tokens.yml
```
