# Theme axes

Change theme by setting attributes on `<html>`. Do **not** hardcode new color/font values to simulate a theme. Do **not** use a `.dark` class — use `data-canvas="dark"`.

Axes are independent (one CSS block per value, not a full cartesian product). Omit an attribute to keep the `:root` default.

## Axis reference

| Axis | Attribute | Allowed values | Default (`:root`) | What it changes |
|---|---|---|---|---|
| Accent | `data-accent` (alias: `data-theme`) | `green`, `pink`, `teal`, `purple`, `gold`, `terracotta` | green | `--sa-accent`, `--sa-accent-deep`, primary button bg/hover, `--ds-color-text-accent` |
| Type | `data-type` | `cinematic`, `editorial`, `product`, `mono` | cinematic | `--sa-font-display`, `--sa-font-label`, `--sa-font-body` |
| Canvas | `data-canvas` | `warm` (default), `cool`, `dark` | warm | Surfaces, ink, borders, text muted/body, `--sa-surface-elevated`, glass |
| Elevation | `data-elevation` | `soft` (default), `flat`, `dramatic` | soft | `--sa-shadow-*`, `--sa-hover-lift` |
| Radius | `data-radius` | `round` (default), `soft`, `square` | round | Button/pill/input radii, `--sa-radius-card`, `--sa-radius-modal` |
| Brand | `data-brand` | omit (Second Act), `aware` | Second Act | Aware: magenta accent, Poppins stack, pillier radii, flat elevation, brand surfaces |

## When to set which

```
┌─ Need a different CTA / link color?
│  └─ data-accent="<green|pink|teal|purple|gold|terracotta>"
│
├─ Need a different typographic personality?
│  └─ data-type="<cinematic|editorial|product|mono>"
│
├─ Need light cool greys or a dark stage?
│  └─ data-canvas="<cool|dark>"   (warm = default)
│
├─ Need no shadows, or heavier drama?
│  └─ data-elevation="<flat|dramatic>"   (soft = default)
│
├─ Need tighter corners?
│  └─ data-radius="<soft|square>"   (round = default)
│
└─ Building Aware brand UI?
   └─ data-brand="aware"
```

## Examples

```html
<!-- Second Act, pink accent, dark canvas -->
<html data-accent="pink" data-canvas="dark" data-type="cinematic">

<!-- Aware brand (sets its own accent/type/radius/elevation) -->
<html data-brand="aware">
```

```tsx
document.documentElement.dataset.accent = "teal";
document.documentElement.dataset.canvas = "cool";
```

## Rules

- Prefer changing attributes over overriding CSS variables in component styles
- After setting `data-brand="aware"`, still use `--sa-*` / `--ds-*` — Aware rewrites those vars
- `data-theme` is only an accent alias; do not invent other `data-theme` values for canvas/type
- Generated UI must remain correct when axes change — always reference variables, never baked-in hex from a single theme snapshot
