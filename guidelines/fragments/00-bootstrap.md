## Figma Make kit setup

This package ships **CSS only** — no React components. Figma Make generates UI and styles it with design tokens from `${packageName}`.

### Make kit checklist

1. Add npm dependency (pin exact version below)
2. Paste this entire guidelines file into your Make kit guidelines
3. Ensure the app entry imports **both** stylesheets (see below)
4. Load web fonts for the active `data-type` / `data-brand` axis
5. Set theme axis attributes on `<html>` (see Theme axes section)
6. Optionally import your Figma Design library variables (complements npm CSS)
7. After each token publish, bump the dependency version and refresh guidelines

### Pin the package

```json
{
  "dependencies": {
    "${packageName}": "${packageVersion}"
  }
}
```

### Mandatory CSS imports

Import **both** stylesheets in the app entry file. Order matters: base first, theme second.

```jsx
import '${packageName}/variables.css';
import '${packageName}/theme.css';
```

All `var(--ds-*)` and `var(--sa-*)` variables are then available globally.

### Do NOT import

- `styles.css` — does not exist; use `variables.css` + `theme.css`
- `Button`, `Input`, or any named export from `${packageName}` — not exported
- Only `variables.css` without `theme.css` — accent, fonts, shadows, and themed surfaces will be wrong or missing

### Token layers

| Prefix | Source | Use for |
| --- | --- | --- |
| `--ds-*` | `variables.css` | Primitives: palette, surfaces, borders, button tokens, radii |
| `--sa-*` | `theme.css` | Themed semantics: accent, fonts, shadows, elevated surfaces |

Prefer `--sa-*` for accent colour, font roles, shadows, and elevated surfaces.
Use `--ds-*` for layout, raw palette access, and component-specific tokens.

---

## App bootstrap template

Every Make file must bootstrap the design system before generating UI. Use this canonical layout.

### 1. Load fonts in `index.html` (before any CSS)

Fonts are **not bundled** in the package. Load the families for your active type axis.

**Cinematic (Second Act default — `data-type="cinematic"`):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono&display=swap" rel="stylesheet">
```

**Editorial (`data-type="editorial"`):**

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=IBM+Plex+Mono&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**Product (`data-type="product"`):**

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**Mono (`data-type="mono"`):**

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono&display=swap" rel="stylesheet">
```

**Aware Super brand (`data-brand="aware"` — lowercase):**

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

When using Aware, include Poppins even if another type axis is set — the brand block overrides all font roles to Poppins.

### 2. Import CSS in app entry

```jsx
import '${packageName}/variables.css';
import '${packageName}/theme.css';
```

### 3. Set `<html>` theme attributes

**Second Act (default brand)** — omit `data-brand`. Second Act is the `:root` default.

```html
<html
  data-accent="green"
  data-type="cinematic"
  data-radius="round"
  data-canvas="warm"
  data-elevation="soft"
>
```

**Aware Super** — set `data-brand="aware"` (**lowercase**, exact match required):

```html
<html
  data-brand="aware"
  data-accent="green"
  data-type="product"
  data-radius="round"
  data-canvas="warm"
  data-elevation="soft"
>
```

**Important:** Do NOT set `data-brand="Second Act"` or `data-brand="Aware"` — those selectors do not exist in CSS. Second Act = no attribute; Aware = `data-brand="aware"`.

### 4. Safe project aliases (optional)

If you need shorthand variables, define them in project CSS pointing **at** package tokens only:

```css
/* globals.css — ALLOWED */
:root {
  --foreground: var(--ds-color-ink);
  --background: var(--ds-color-surface-primary);
  --border: var(--ds-color-border-subtle);
  --font-display: var(--sa-font-display);
  --font-body: var(--sa-font-body);
}

/* FORBIDDEN — never redefine package tokens */
/* --ds-color-ink: var(--foreground);  ← circular, breaks everything */
/* --sa-accent: #db0081;              ← override, breaks theme axes */
```

Anti-patterns Make commonly generates (never use):

- Tailwind `@theme` blocks redefining `--ds-*` or `--sa-*`
- shadcn HSL bridges that write back into `--ds-color-*`
- Local `theme.css` that redefines package variables
- Importing both this package AND another UI library's global CSS that conflicts
