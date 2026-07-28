# CLAUDE.md

Entry point for Claude Code sessions on this repo. Cursor uses `.cursor/rules/design-tokens.mdc` which points here.

## What this repo is

`@easysimplecool/design-system` — CSS design tokens published to npm. Two files ship: `dist/variables.css` (primitives + component vars) and `dist/theme.css` (multidimensional axis blocks). No JS, no React.

Tokens flow: **Figma → Tokens Studio plugin → `src/tokens/*.json` → Style Dictionary + custom theme builder → `dist/*.css` → npm.**

## Read before working

1. **`docs/project.md`** — pipeline overview, repo tour, ownership table
2. **`guidelines/parametric-theming.md`** — the mental model (three-layer vars, six data-* axes, parametric composition). Non-negotiable for any UI or build-logic change.
3. **`docs/scripts.md`** — what each build script does; note the "golden fixture caveat"
4. **`docs/contributing.md`** — local workflow, tests, publishing

## Ownership (read-only files)

**Never hand-edit:**

- `src/tokens/*.json` — Tokens Studio (Figma plugin) owns this. Hand edits get silently overwritten on the next plugin push. If a token value looks wrong, **flag it** — don't fix it here.
- `dist/*.css` — Style Dictionary + `scripts/build-theme.mjs` own this. Regenerate with `npm run build`; do not edit the CSS by hand.

**Edit freely:** `scripts/`, `test/`, `guidelines/`, `docs/`, `CLAUDE.md`, `.cursor/rules/`, config files, `README.md`.

## Common commands

```bash
npm install
npm run build              # regenerate dist/
npm test                   # 8 tests, ~1s
npm run validate:tokens    # metadata sanity check
```

Node 20+. No child processes in the build; it's all in-process.

## Style rules for this repo

- Scripts are `.mjs`, ES modules, named exports.
- No new dependencies without discussion. Current deps: `style-dictionary` + `@tokens-studio/sd-transforms`. That's it.
- Small files. If a script grows past ~200 lines, look for a factoring.
- No comments explaining WHAT; comments only for non-obvious WHY.
- No error handling for cases that can't happen. Trust the internal invariants.

## Design-system rules (for any UI you generate)

**Read `guidelines/parametric-theming.md` first.** Short version:

- Style with `var(--ds-*)` and `var(--sa-*)`. Never hardcode hex/rgb that has a token.
- Never reassign `--sa-*` inside a component. Reassign only at the `data-*` axis boundary (which the build handles for you).
- Change theme with `data-accent` / `data-canvas` / `data-type` / `data-elevation` / `data-radius` / `data-brand` on `<html>` — never with `.dark` classes, never with per-component overrides.
- Components read layer 3 (`--ds-button-*`) or layer 2 (`--sa-*`) — never layer 1 primitives (`--ds-color-accent-green`).
- One primary CTA per section. Accent stays sparse.

Full anti-patterns list in `guidelines/anti-patterns.md`.

## Publishing

**Don't `npm publish` locally.** CI (`.github/workflows/sync-tokens.yml`) handles version bump + publish on every push to `main` that touches tokens or build.

## When you're unsure

- Token value seems wrong → flag it, don't edit `src/tokens/`.
- Build output changed unexpectedly → check `test/fixtures/theme-golden.css` — if you didn't change it, something upstream did.
- Adding a new axis or axis value → `guidelines/parametric-theming.md` "Rules for contributors".
- Adding a new script → follow `docs/scripts.md` "Adding a script" and add a row to that file.
