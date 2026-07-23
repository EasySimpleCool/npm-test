# @easysimplecool/design-system

CSS custom properties generated from Figma via Tokens Studio + Style Dictionary.
Consumers get **only** `dist/variables.css` — no React, no Style Dictionary.

## Pipeline

1. Edit tokens in Figma → Tokens Studio **push** → updates `src/tokens/tokens.json`
2. GitHub Action runs Style Dictionary → commits `dist/variables.css` → publishes to npm
3. Apps import the CSS and use `var(--ds-…)`

## Consume (CSS only)

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
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@easysimplecool/design-system/dist/variables.css"
/>
```

Pin a version for a frozen snapshot (replace with the version you want):

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@easysimplecool/design-system@0.2.43/dist/variables.css"
/>
```

## Local kitchen build (maintainers only)

```bash
npm install
npm run build
```

Output: `dist/variables.css`. Consumer apps should not run this.

## Folder structure

```
npm-test/
├── src/tokens/tokens.json   # Tokens Studio source of truth
├── dist/variables.css       # generated + committed artifact
├── style-dictionary.config.js
├── scripts/validate-tokens.mjs
└── .github/workflows/sync-tokens.yml
```
