# Contributing

## Local setup

```bash
npm install
npm test           # 8 tests, ~1s
npm run build      # regenerates dist/ from src/tokens/
```

Node 20+ (matches CI in `.github/workflows/sync-tokens.yml`).

## Before every commit

```bash
npm run validate:tokens   # metadata sanity
npm test                  # includes a full build + golden diff
```

CI runs both on push to `main`.

## What you can and can't edit

See the ownership table in `project.md`. Short version:

- **Edit freely:** `scripts/`, `test/`, `guidelines/`, `docs/`, `CLAUDE.md`, `.cursor/rules/`, `style-dictionary.config.js`, `README.md`
- **Never edit:** `src/tokens/*.json` (Tokens Studio owns), `dist/*.css` (generated)

## Changing token values

You can't — those come from Figma via the Tokens Studio plugin. If a value is wrong, flag it. Someone with Tokens Studio access will change it in Figma and push, then CI will regenerate `dist/`.

## Changing what the theme output looks like

1. Update `test/fixtures/theme-golden.css` to the intended shape (see `scripts.md` "Golden-fixture caveat")
2. If the change needs new tokens or new resolution logic, edit `scripts/build-theme.mjs`, `scripts/compile-value.mjs`, or `scripts/resolve-theme.mjs`
3. `npm run build` and diff `dist/theme.css`
4. `npm test` — golden test asserts what you added

## Adding a new theme axis or axis value

See `../guidelines/parametric-theming.md` "Rules for contributors" — one theme entry in `$themes.json` for a new value, one axis group + one selector block for a new dimension.

## Publishing

**Don't publish locally.** CI does it. The workflow (`.github/workflows/sync-tokens.yml`):

1. Runs validate + test + build
2. Commits regenerated `dist/*.css` if changed
3. `npm version patch` — bumps the version, tags, pushes
4. `npm publish --access public`
5. Prints the new version + copy-paste snippet in the GitHub Actions summary

If you need a manual release, use the workflow's `workflow_dispatch` trigger. Do not run `npm publish` from your machine.

## Style

- `scripts/`: `.mjs`, ES modules, no top-level side effects except in the `if (process.argv[1] === fileURLToPath(...))` guard
- Prefer named exports
- No new dependencies without a note in the PR — this package's dep tree is deliberately tiny (Style Dictionary + sd-transforms only)

## Tests

- `test/schema.test.mjs` — token JSON shape invariants
- `test/resolve.test.mjs` — theme merging and reference resolution
- `test/golden.test.mjs` — full build + byte-close diff against the fixture

Tests run sequentially (`--test-concurrency=1`) because they all share `dist/`.
