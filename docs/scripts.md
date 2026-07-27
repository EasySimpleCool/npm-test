# Build scripts

Everything in `scripts/` and how it fits together.

## Entry points

| Command | What it does |
|---|---|
| `npm run build` | Alias for `build:tokens` |
| `npm run build:tokens` | Runs `scripts/build-all.mjs` → regenerates both `dist/variables.css` and `dist/theme.css` |
| `npm test` | `node --test --test-concurrency=1 test/*.test.mjs` |
| `npm run validate:tokens` | Runs `scripts/validate-tokens.mjs` — checks `$metadata.tokenSetOrder` matches actual files, catches duplicate set-name wrappers |

## Files in `scripts/`

| File | Role | Notes |
|---|---|---|
| `build-all.mjs` | Entry point for the full build. Runs Style Dictionary in-process for `variables.css`, then calls `buildTheme()` for `theme.css`. | ~15 lines. No child processes. |
| `build-theme.mjs` | Generates `dist/theme.css` — the multidimensional axis blocks. Iterates the golden fixture's selector order, resolves each theme via `resolve-theme`, compiles each value via `compile-value`. | The `ROOT_SUPPLEMENTAL` object injects four `:root` font-weight defaults that aren't in tokens. |
| `load-tokens.mjs` | Reads `src/tokens/**/*.json` into an in-memory tree. Handles nested folders, skips reserved files, exposes helpers for the design-system-only bundle. | Also defines `normalizeTokenSets` which defends against a Tokens Studio quirk (duplicate set-name wrappers). |
| `resolve-theme.mjs` | Given a theme (from `$themes.json`), merges its `selectedTokenSets` in order and resolves `{token.reference}` chains into flat `--css-var` values. | Uses `structuredClone` on token leaves to avoid mutation across themes. |
| `compile-value.mjs` | Turns a resolved token into its final CSS value: hex, `rgba()`, `box-shadow` composed string, font stack, `color-mix` for glass surfaces. | Contains the special-case rules for glass surfaces and primary-button color routing. |
| `parse-golden-css.mjs` | Parses `test/fixtures/theme-golden.css` into blocks + declarations. **Also used by the build** to know which selectors and vars to emit (see [caveat](#golden-fixture-caveat)). |
| `validate-tokens.mjs` | Standalone CLI that runs metadata reconciliation and prints actionable Tokens Studio fixes. | Called by CI before tests. |

## Two Style Dictionary invocations, one process

`build-all.mjs` runs Style Dictionary once in-process (for `variables.css`) using the config in `style-dictionary.config.js`. The config feeds tokens in-memory via SD's `tokens:` option — no intermediate JSON file on disk.

`build-theme.mjs` does not use Style Dictionary at all — it walks the token tree itself using `resolve-theme` and `compile-value`, because the multi-axis theme output needs a shape SD doesn't produce natively.

## Golden-fixture caveat

`test/fixtures/theme-golden.css` is the intended output shape. `build-theme.mjs` reads it to know which selectors and variable names to emit, then fills in the resolved values from tokens. `test/golden.test.mjs` then asserts the build matches the fixture.

**This means the fixture partly drives the build.** Changing what the theme should look like:

1. Change the fixture first (`test/fixtures/theme-golden.css`)
2. If you change values in the fixture, they need to match what the tokens resolve to — otherwise the golden test will fail
3. If you add a new selector or new var to the fixture, `build-theme.mjs` will start emitting it — provided the token graph can resolve it

The fixture is not authoritative for values (tokens are), but is authoritative for **shape** (which selectors/vars exist).

## Build performance

A full `npm run build` runs Style Dictionary once (in-process) and walks the token tree once for the theme file. Should complete in <2s on a warm cache. No child-process spawns.

## Adding a script

Keep scripts:

- Named for what they produce, not how (`build-theme.mjs`, not `run-theme-builder.mjs`)
- Executable directly (`node scripts/foo.mjs`) via the `if (process.argv[1] === fileURLToPath(...))` idiom
- Small — factor shared logic into a sibling module
- Documented in this file with one row and one paragraph
