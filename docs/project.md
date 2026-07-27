# Project overview

`@easysimplecool/design-system` publishes two CSS files: `dist/variables.css` (primitives + component vars) and `dist/theme.css` (multidimensional axis blocks). No JS, no React. Consumers import the CSS and use `var(--ds-*)` / `var(--sa-*)`.

## Pipeline

```
Figma (designer)
  ↓  Tokens Studio push
src/tokens/*.json              ← multifile Tokens Studio format
  ↓  git commit + push (or Tokens Studio direct push to main)
GitHub Actions (.github/workflows/sync-tokens.yml)
  ↓  npm run validate:tokens   ← metadata / duplicate-set sanity
  ↓  npm test                  ← schema + resolve + golden diff
  ↓  npm run build:tokens      ← Style Dictionary + theme builder
dist/variables.css + dist/theme.css   ← generated, committed, published
  ↓  npm version patch + npm publish
npm registry → consumer apps
```

## Repo tour

```
npm-test/
├── CLAUDE.md               ← agent entry point (read first)
├── README.md               ← package README (for npm/GitHub visitors)
├── src/tokens/             ← Tokens Studio source (Figma-owned; do not hand-edit)
│   ├── $metadata.json      ← set order (Tokens Studio manages)
│   ├── $themes.json        ← axis definitions (brand/accent/type/canvas/elevation/radius)
│   └── <n>. <Group>/       ← one folder per axis, one file per axis value
├── scripts/                ← build + validation (contributor-owned; edit freely)
├── style-dictionary.config.js  ← variables.css generator
├── test/                   ← schema, resolve, build/golden tests
├── dist/                   ← generated CSS (committed for consumers; do not hand-edit)
├── guidelines/             ← CONSUMER docs — shipped in npm
│   ├── Guidelines.md       ← consumer entry point
│   ├── parametric-theming.md   ← the theory
│   ├── setup.md, themes.md, anti-patterns.md
│   └── foundations/*.md
├── docs/                   ← CONTRIBUTOR docs — NOT shipped in npm (this folder)
├── .cursor/rules/          ← Cursor auto-rules (thin, point to CLAUDE.md)
└── .github/workflows/      ← CI: sync-tokens.yml
```

## What ships in the npm tarball

`package.json` `files: ["dist", "guidelines"]`. Nothing else. `docs/`, `scripts/`, `test/`, `src/tokens/`, and config all stay in the repo — consumers get the CSS + the kit guidance and nothing more.

## Who owns which file

| Owner | Files | Rule |
|---|---|---|
| **Tokens Studio (Figma)** | `src/tokens/*.json` | Never hand-edit. Plugin overwrites on next push. |
| **Style Dictionary + build scripts** | `dist/*.css` | Never hand-edit. Regenerate with `npm run build`. |
| **CI** | `dist/*.css` commits, version bumps, npm publish | Do not `npm publish` locally. |
| **Contributors** | Everything else (`scripts/`, `test/`, `guidelines/`, `docs/`, `CLAUDE.md`, configs) | Edit freely. |

If a token value looks wrong, flag it — do not fix it in `src/tokens/`. The Tokens Studio plugin is the source of truth and will silently overwrite hand edits.
