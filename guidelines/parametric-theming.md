# Parametric props & multidimensional theming

The mental model behind `--ds-*` / `--sa-*` and the `data-*` axes. Read this before generating UI or extending the token pipeline — most bugs at this seam are model bugs, not code bugs.

## The problem this solves

A brand like Second Act has independent variation dimensions: which accent, which type personality, warm/cool/dark canvas, how much elevation, how round the corners, which brand shell. Each is a separate design decision.

Two naïve options both fail:

1. **Monolithic themes** — one class per full combination (`.theme-secondact-warm-green-round-soft`). With this repo's six axes and 2–6 values each, that's 6 × 6 × 4 × 3 × 3 × 2 = **2,592 concrete themes** to maintain. Adding a new accent means regenerating hundreds of variants.
2. **Ad-hoc overrides** — one component reaches in and rewrites `--sa-accent` to fake dark mode; the next component doesn't. State becomes untrackable.

The parametric answer: describe each dimension once, compose them at runtime via CSS cascade.

## The three-layer variable model

Every token in this system lives at one of three layers. Never skip a layer.

| Layer | Prefix | Example | Rule |
|---|---|---|---|
| **1. Primitives** | `--ds-color-*`, `--ds-fontFamilies-*`, `--ds-borderRadius-*` | `--ds-color-accent-green: #7aab54` | Raw values. Brand-neutral names. Never referenced by components. |
| **2. Parametric roles** | `--sa-*` | `--sa-accent: var(--ds-color-accent-green)` | The knobs. Reassigned by each `[data-*]` block. Components read these. |
| **3. Component vars** | `--ds-button-*`, `--ds-color-text-accent` | `--ds-button-primary-color-bg: var(--sa-accent)` | What components actually consume. Points at layer 2, never layer 1. |

The flow when you set `data-accent="pink"` on `<html>`:

```
data-accent="pink"                                           ← author sets one attr
  → [data-accent="pink"]{ --sa-accent: var(--ds-color-accent-pink); }   ← layer 2 flipped
    → --ds-button-primary-color-bg: var(--sa-accent)         ← layer 3 rides through
      → button { background: var(--ds-button-primary-color-bg) }        ← component unchanged
```

One attribute change. Zero component code touched. Every accent-bound var updates.

## The six axes (this project)

| Axis | Attribute | Values | Default | What it moves |
|---|---|---|---|---|
| Brand | `data-brand` | *(unset)*, `aware` | Second Act | Full sub-theme: accent, type, radius, elevation |
| Accent | `data-accent` (alias `data-theme`) | `green`, `pink`, `teal`, `purple`, `gold`, `terracotta` | `green` | `--sa-accent`, `--sa-accent-deep`, primary button, `--ds-color-text-accent` |
| Type | `data-type` | `cinematic`, `editorial`, `product`, `mono` | `cinematic` | `--sa-font-display`, `--sa-font-label`, `--sa-font-body` |
| Canvas | `data-canvas` | `warm`, `cool`, `dark` | `warm` | Surfaces, ink, borders, text, glass |
| Elevation | `data-elevation` | `soft`, `flat`, `dramatic` | `soft` | `--sa-shadow-*`, `--sa-hover-lift` |
| Radius | `data-radius` | `round`, `soft`, `square` | `round` | Button/pill/input radii, `--sa-radius-*` |

**2,592 possible combinations. 18 CSS blocks in `theme.css`.** That ratio is the point.

## Rules for consumers (generating or writing UI)

1. **Consume, don't reassign.** Components use `var(--sa-*)` and `var(--ds-*)`. They never write to those vars.
2. **Set axes on `<html>`.** Not on wrappers, not in inline styles per component. The one exception: scoped subtree previews (a card showing "how does this look with `data-accent="teal"`"), where the scoping is the point.
3. **Never fake a theme with hex.** If you want dark, set `data-canvas="dark"` — do not write `background: #191512` to simulate it. That value stops responding to axis changes.
4. **Layer 1 is invisible.** Never reference `--ds-color-accent-green` from a component. Always go through `--sa-accent`.
5. **One axis, one job.** Don't create a helper class that flips several axes together (`.theme-nightmode { ...canvas + elevation + accent }`). If a preset is worth having, add it as a brand (`data-brand="aware"` is the correct precedent).

## Rules for contributors (extending the pipeline)

1. **New axis value = one theme entry.** Add to `src/tokens/$themes.json` with the right `group`, register its overrides in the appropriate `<axis>/<value>.json` token set. The build emits one `[data-<axis>="<value>"]` block automatically.
2. **New axis (new dimension) = one theme group + one selector convention.** Add to `$themes.json`, add the axis to the golden fixture, add a row to `guidelines/themes.md` and the table above.
3. **Never emit a coupled selector.** No `[data-accent="pink"][data-canvas="dark"]{...}`. Coupling breaks parametricity — you're back to the 2,592-block explosion. If two axes genuinely interact, resolve it in layer 2 vars, not in the selector.
4. **Layer 2 is where axes reassign.** Every `[data-*]` block should touch `--sa-*` (and occasionally layer-3 component vars that depend on the axis). It should almost never touch layer-1 primitives.
5. **Add a new component var only when needed.** Prefer routing a component through an existing `--sa-*` role. New component vars are justified when the component has a semantics no role covers.

## Parametric props: the wider concept

This is the CSS-native form of the same idea behind:

- **Figma variant properties** — one component, N orthogonal props (size, variant, state)
- **Base UI / Radix data-attributes** — components render `data-state="open"` and the consumer styles by attribute
- **shadcn / cva variants** — one component, a variants config, composed at call time
- **MUI props API** — `<Button variant="contained" color="primary" size="small">`

All solve the same problem: describe orthogonal variation dimensions once, let a composition operator (CSS cascade here; JSX props elsewhere) build the concrete artifact.

Contrast with the failure modes it replaces:

- **BEM modifier classes** (`.btn--primary.btn--large.btn--loading`) — compile-time enumeration, no cascade composition
- **Sass mixin themes** — baked at build time, no runtime axis switching
- **Duplicating a component per variant** — breaks parametricity outright

## Anti-patterns

| Anti-pattern | Why it breaks |
|---|---|
| `background: #7aab54` on a button | Bakes in a single accent snapshot; `data-accent` stops working |
| `.dark { --sa-accent: white }` | Coupling class-based dark mode to a `--sa-*` overwrite; `data-canvas="dark"` already exists |
| `[data-accent="pink"][data-brand="aware"]{ ... }` | Coupled axis selector — do this once and combinatorial regressions follow |
| Naming a token `--sa-magenta` | Brand-specific role names lock you into one theme; roles must describe purpose (`--sa-accent`), not appearance |
| Component reads `--ds-color-accent-green` directly | Skips layer 2; component won't respond to `data-accent` changes |
| Emitting a preset that flips multiple axes at once via a class | Bypasses `data-*`; two authors set it two ways and drift |
| Setting `data-canvas="dark"` on a wrapper `<div>` inside a light page for a "hero" | Legitimate but easily abused — if the whole hero is meant to look dark, use `data-canvas`; if only the button, style the button |

## Debugging checklist

When a themed component looks wrong:

1. **Which layer are you reading?** Grep the component's CSS for `--ds-color-*` — if it's not `text`, `border`, `surface`, or `button`, you're probably skipping layer 2.
2. **Which axis owns the wrong value?** Toggle `data-*` attrs on `<html>` in devtools one at a time. The one that changes the broken value is the one to fix.
3. **Is the value baked?** Search the component for hex/rgb. If found, replace with a `var(--sa-*)` or `var(--ds-*)`.
4. **Is a `[data-*]` block missing an override?** Check `dist/theme.css` for the axis-value block. If your role isn't reassigned there, add it in the axis's token set.
