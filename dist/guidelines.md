# Second Act Design System Guidelines

AUTO-GENERATED from `src/tokens/` — do not hand-edit `dist/guidelines.md`.
Regenerate with: `npm run build:tokens`

When generating UI, consume the design system from the `@easysimplecool/design-system` npm package (`0.2.46`).
This system supports **Second Act** (default) and **Aware Super** (`data-brand="aware"`) brands.
Use only the tokens listed below. Never hardcode colours, typography, or spacing — always reference a token.

This package ships **CSS only** (no React components). Build Button, Input, and all other UI locally, styled with `--ds-*` and `--sa-*` variables.

---

## Token authority — READ FIRST

This project and `@easysimplecool/design-system` share ONE design system. The package is the single source of truth for `--ds-*` and `--sa-*` variables.

- NEVER redefine, override, or "bridge" any `--ds-*` or `--sa-*` variable in project CSS (`globals.css`, local `theme.css`, or anywhere else). The package stylesheets are the only place these variables are defined.
- Project-level aliases (`--foreground`, `--background`, `--border`, `--font-display`, `--space-*`, etc.) may point AT `--ds-*` / `--sa-*` tokens or fixed values. Nothing may point INTO package tokens. One direction only: alias ← DS token.
- Never create a circular reference (e.g. `--foreground: var(--ds-color-text-body)` together with `--ds-color-text-body: var(--foreground)`). CSS invalidates every variable in a cycle and components lose their styling entirely.
- Do not "align" or "restyle" components with token overrides — wire them directly to the package tokens from the start.
- If a token you need does not exist in the package, do NOT invent or override one. Use the closest existing token and add a code comment: `/* TODO: missing DS token */`.

---

## Figma Make kit setup

This package ships **CSS only** — no React components. Figma Make generates UI and styles it with design tokens from `@easysimplecool/design-system`.

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
    "@easysimplecool/design-system": "0.2.46"
  }
}
```

### Mandatory CSS imports

Import **both** stylesheets in the app entry file. Order matters: base first, theme second.

```jsx
import '@easysimplecool/design-system/variables.css';
import '@easysimplecool/design-system/theme.css';
```

All `var(--ds-*)` and `var(--sa-*)` variables are then available globally.

### Do NOT import

- `styles.css` — does not exist; use `variables.css` + `theme.css`
- `Button`, `Input`, or any named export from `@easysimplecool/design-system` — not exported
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
import '@easysimplecool/design-system/variables.css';
import '@easysimplecool/design-system/theme.css';
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


## Troubleshooting — "everything unstyled"

If the Make file renders with no colours, wrong fonts, or broken layout, work through this checklist **in order** before generating new UI.

### 1. CSS imports

- [ ] Both `@easysimplecool/design-system/variables.css` AND `@easysimplecool/design-system/theme.css` are imported in the app entry
- [ ] Import order is variables first, theme second
- [ ] No 404 errors in the browser console for CSS files
- [ ] Package version in `package.json` matches the published npm version

**Symptom:** All `var(--ds-*)` resolve to empty — page is completely unstyled.
**Fix:** Add both imports to the root app file (usually `main.jsx`, `App.jsx`, or `layout.jsx`).

### 2. Token authority / circular references

- [ ] Project CSS does NOT redefine any `--ds-*` or `--sa-*` variable
- [ ] No circular alias chains (alias → token → alias)
- [ ] No local `theme.css` that duplicates or overrides package theme blocks

**Symptom:** Some or all CSS variables are invalid; DevTools shows empty computed values for tokens that should exist.
**Fix:** Remove overrides from `globals.css`. Use one-direction aliases only (alias ← package token).

### 3. Web fonts

- [ ] Google Fonts (or equivalent) `<link>` is in `index.html`
- [ ] Font families match the active `data-type` axis
- [ ] When `data-brand="aware"`, Poppins is loaded

**Symptom:** Typography looks like system UI fonts; hero titles don't match design; label text wrong weight.
**Fix:** Add the font `<link>` from the bootstrap section for your active axes.

### 4. Theme axis attribute values

- [ ] `data-brand="aware"` is **lowercase** (not `"Aware"`)
- [ ] `data-brand="Second Act"` is **NOT set** — Second Act is the default with no attribute
- [ ] Accent values are lowercase: `green`, `pink`, `teal`, `purple`, `gold`, `terracotta`
- [ ] All axis attributes are on `<html>`, not `<body>` or a wrapper div

**Symptom:** Brand or accent colours don't switch; Aware styling never applies.
**Fix:** Use exact selector values documented in the Theme axes section.

### 5. Wrong import paths

- [ ] NOT importing `styles.css` (does not exist)
- [ ] NOT importing `{ Button, Input }` from `@easysimplecool/design-system` (not exported)
- [ ] NOT using `@easysimplecool/design-system` default export expecting a component library

**Symptom:** Build errors or runtime import failures.
**Fix:** Only import the two CSS paths listed above.

### 6. Hardcoded values instead of tokens

- [ ] No hex colours like `#191512`, `#7aab54`, `#db0081` in component styles
- [ ] No Tailwind colour classes (`text-gray-900`, `bg-teal-500`, etc.)
- [ ] No arbitrary `font-family: 'Anton'` without also loading the font

**Symptom:** UI looks close but wrong; doesn't respond to theme axis changes.
**Fix:** Replace every colour, font, radius, and shadow with the matching `var(--ds-*)` or `var(--sa-*)` token.

### 7. Debugging in DevTools

1. Inspect `<html>` — confirm `data-*` attributes are present
2. Inspect an element — check computed `color`, `background`, `font-family`
3. If a value shows as empty or invalid, trace the `var()` chain back to `:root`
4. In the Styles panel, search for `--ds-color-ink` — it should appear in `:root` from `variables.css`
5. Search for `--sa-accent` — it should appear in `:root` from `theme.css`

If `:root` has the variables but computed styles are empty, you likely have a circular reference in project CSS.


## Layout and spacing

This package does **not** ship spacing or layout tokens. Use the local scale below consistently across all components. Define these as project-level aliases in `globals.css` — they must point at fixed values, never at `--ds-*` or `--sa-*`.

### Local spacing scale (8px base)

Add to `globals.css`:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
}
```

| Alias | Value | Typical use |
| --- | --- | --- |
| `--space-1` | 4px | Icon gaps, tight inline spacing |
| `--space-2` | 8px | Compact list gaps |
| `--space-3` | 12px | Input padding (vertical) |
| `--space-4` | 16px | Standard gap between stacked elements |
| `--space-5` | 20px | Card inner padding (compact) |
| `--space-6` | 24px | Section sub-gaps, card padding |
| `--space-8` | 32px | Page horizontal padding (mobile) |
| `--space-10` | 40px | Nav item spacing |
| `--space-12` | 48px | Section vertical padding |
| `--space-16` | 64px | Large section gaps |
| `--space-24` | 96px | Hero vertical padding |

Use `var(--space-*)` in inline styles and components. Do not hardcode random pixel values like `padding: '37px'`.

### Layout conventions

| Pattern | Guidance |
| --- | --- |
| Page max width | `1200px`–`1440px` centred with `margin: '0 auto'` |
| Page horizontal padding | `var(--space-8)` mobile, `var(--space-12)` desktop |
| Section vertical padding | `var(--space-16)` to `var(--space-24)` |
| Stack gap (flex/grid) | `var(--space-4)` default, `var(--space-6)` for forms |
| Nav height | `64px`–`72px` |
| Hero min height | `100vh` or `minHeight: '100vh'` for full-bleed cinematic heroes |

### Full-bleed hero overlay

For cinematic heroes (Second Act), use a bottom gradient so text remains readable over photography:

```jsx
<div style={{
  position: 'relative',
  minHeight: '100vh',
  backgroundImage: 'url(/hero.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}}>
  <div style={{
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(25, 21, 18, 0.85) 0%, rgba(25, 21, 18, 0.3) 50%, transparent 100%)',
  }} />
  {/* content positioned at bottom */}
</div>
```

On dark canvas (`data-canvas="dark"`), adjust gradient stops to use `var(--ds-color-ink)` with alpha via `color-mix` or hardcoded rgba matching the active ink token.


## Second Act UI patterns

Second Act is the **default brand** (`:root`). Do not set `data-brand` for Second Act pages.

Default axes for cinematic film site:

```html
<html data-accent="green" data-type="cinematic" data-radius="round" data-canvas="warm" data-elevation="soft">
```

### Character accent map

Each mockumentary character / film has a signature accent. Set `data-accent` on `<html>` to match:

| Character / film | `data-accent` value | Token |
| --- | --- | --- |
| Little Suzy | `green` | `--ds-color-accent-green` |
| Pink figure / general pink | `pink` | `--ds-color-accent-pink` |
| The Stunt Guy (Film 02) | `teal` | `--ds-color-accent-teal` |
| Vincent Noir | `gold` | `--ds-color-accent-gold` |
| Babs Deluxe | `purple` | `--ds-color-accent-purple` |
| Terracotta variant | `terracotta` | `--ds-color-accent-terracotta` |

CTAs, links, and primary buttons follow `--sa-accent` which updates with `data-accent`.

### Top navigation

- Logo/wordmark: `--sa-font-display` or `--sa-font-label`, `--ds-color-ink`
- Nav links: `--sa-font-label`, `--ds-color-text-muted`, uppercase, `letterSpacing: '0.1em'`
- Active/hover link: `--ds-color-text-accent` or `--ds-color-ink`
- Ghost CTA ("Save my seat"): ghost button variant

```jsx
<nav style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--space-4) var(--space-8)',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
}}>
  <span style={{
    fontFamily: 'var(--sa-font-label)',
    color: 'var(--ds-color-ink)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontWeight: 'var(--sa-font-label-weight)',
  }}>
    Second Act
  </span>
  <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
    {['The Films', 'The Cast', 'Trailer', 'Quiz', 'Awards'].map((item) => (
      <a key={item} href="#" style={{
        fontFamily: 'var(--sa-font-label)',
        color: 'var(--ds-color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontSize: '11px',
        textDecoration: 'none',
      }}>
        {item}
      </a>
    ))}
  </div>
  <Button variant="ghost" size="sm">Save my seat</Button>
</nav>
```

### Cinematic hero

- Full-bleed background image with bottom gradient overlay
- Eyebrow: `--sa-font-label`, `--ds-color-text-subtle`, uppercase, wide tracking
- Title: `--sa-font-display`, `--ds-color-ink`, uppercase, very large
- Body copy: `--sa-font-body`, `--ds-color-text-body`
- Play CTA: overlay button variant with `--sa-shadow-play`

```jsx
<section style={{ position: 'relative', minHeight: '100vh', color: 'var(--ds-color-ink)' }}>
  {/* gradient overlay — see Layout section */}
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 'var(--space-24) var(--space-8)',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-8)',
    alignItems: 'end',
  }}>
    <div>
      <p style={{
        fontFamily: 'var(--sa-font-label)',
        color: 'var(--ds-color-text-subtle)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        fontSize: '11px',
      }}>
        Aware Super presents · A mockumentary series · 30 films
      </p>
      <h1 style={{
        fontFamily: 'var(--sa-font-display)',
        fontWeight: 'var(--sa-font-display-weight)',
        textTransform: 'uppercase',
        fontSize: 'clamp(4rem, 12vw, 10rem)',
        lineHeight: 0.9,
        marginTop: 'var(--space-4)',
      }}>
        Second Act.
      </h1>
      <p style={{
        fontFamily: 'var(--sa-font-label)',
        color: 'var(--ds-color-text-subtle)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginTop: 'var(--space-6)',
        fontSize: '11px',
      }}>
        Now showing · Film 02
      </p>
      <p style={{
        fontFamily: 'var(--sa-font-body)',
        color: 'var(--ds-color-ink)',
        fontSize: '1.25rem',
        marginTop: 'var(--space-2)',
      }}>
        The Stunt Guy Takes a Fee to the Face
      </p>
    </div>
    <div>
      <p style={{
        fontFamily: 'var(--sa-font-body)',
        color: 'var(--ds-color-text-body)',
        maxWidth: '400px',
        marginLeft: 'auto',
      }}>
        What happens to the screen's biggest characters when the cameras stop?
        A documentary crew finds out — one retirement at a time.
      </p>
      <Button variant="overlay" style={{ marginTop: 'var(--space-6)', boxShadow: 'var(--sa-shadow-play)' }}>
        ▶ Watch Film 02 · Out now
      </Button>
    </div>
  </div>
</section>
```

For Film 02 / The Stunt Guy page, set `data-accent="teal"` on `<html>`.

### Bottom release bar

Fixed footer bar with glass surface and countdown metadata:

```jsx
<footer style={{
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-4) var(--space-8)',
  background: 'var(--sa-surface-glass)',
  backdropFilter: 'blur(12px)',
  borderTop: '1px solid var(--ds-color-border-subtle)',
}}>
  <div style={{
    fontFamily: 'var(--sa-font-label)',
    color: 'var(--ds-color-text-subtle)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '11px',
  }}>
    Now showing — Film 02 · The Stunt Guy Takes a Fee to the Face
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
    <span style={{
      fontFamily: 'var(--sa-font-label)',
      color: 'var(--ds-color-text-muted)',
      textTransform: 'uppercase',
      fontSize: '11px',
    }}>
      Next film Thu, 30 July · 6PM · 4d 09:57:54
    </span>
    <Button variant="ghost" size="sm">Save my seat</Button>
  </div>
</footer>
```

### Dark canvas variant

For dark cinematic sections, set `data-canvas="dark"` on `<html>`. Surfaces, ink, borders, and text tokens all invert automatically via the theme block.


## Aware Super UI patterns

Aware Super is activated by setting `data-brand="aware"` on `<html>` (**lowercase only**).

```html
<html
  data-brand="aware"
  data-type="product"
  data-canvas="warm"
  data-radius="round"
  data-elevation="soft"
>
```

When the Aware brand block is active:

- Accent becomes magenta (`#db0081` / `#ad005f`) via `--sa-accent` / `--sa-accent-deep`
- All font roles become **Poppins** (load the Poppins Google Font)
- Buttons use pill radius (`999px`)
- Shadows are flat (`--sa-shadow-*: none`)
- Surfaces use warm neutral/lavender palette (`#fef6ef`, `#fcf7f4`, `#f6f2f7`)
- Ink/text becomes deep purple (`#55005a`)

The `data-accent` axis still works alongside Aware brand, but the brand block sets magenta as the default accent.

### Aware marketing hero

```jsx
<section style={{
  background: 'var(--ds-color-surface-secondary)',
  padding: 'var(--space-24) var(--space-8)',
  textAlign: 'center',
}}>
  <p style={{
    fontFamily: 'var(--sa-font-label)',
    color: 'var(--ds-color-text-subtle)',
    fontWeight: 'var(--sa-font-label-weight)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontSize: '13px',
  }}>
    Aware Super
  </p>
  <h1 style={{
    fontFamily: 'var(--sa-font-display)',
    fontWeight: 'var(--sa-font-display-weight)',
    color: 'var(--ds-color-ink)',
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    marginTop: 'var(--space-4)',
    lineHeight: 1.1,
  }}>
    Your super, your way
  </h1>
  <p style={{
    fontFamily: 'var(--sa-font-body)',
    fontWeight: 'var(--sa-font-body-weight)',
    color: 'var(--ds-color-text-body)',
    maxWidth: '560px',
    margin: 'var(--space-6) auto 0',
    fontSize: '1.125rem',
  }}>
    Build confidence in your retirement with Australia's leading industry fund.
  </p>
  <Button variant="primary" style={{ marginTop: 'var(--space-8)' }}>
    Get started
  </Button>
</section>
```

### Aware form pattern

Pill primary button, rounded input, Poppins throughout:

```jsx
<form style={{
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-4)',
  maxWidth: '480px',
  padding: 'var(--space-8)',
  background: 'var(--sa-surface-elevated)',
  borderRadius: 'var(--sa-radius-card)',
}}>
  <label style={{
    fontFamily: 'var(--sa-font-label)',
    fontWeight: 'var(--sa-font-label-weight)',
    color: 'var(--ds-color-ink)',
    fontSize: '14px',
  }}>
    Email address
  </label>
  <Input type="email" placeholder="name@example.com" />
  <Button variant="primary" type="submit">Subscribe</Button>
</form>
```

### Aware vs Second Act quick reference

| Property | Second Act (default) | Aware Super |
| --- | --- | --- |
| Brand activation | No `data-brand` attribute | `data-brand="aware"` |
| Display font | Anton (cinematic) | Poppins 700 |
| Label font | Space Mono | Poppins 600 |
| Body font | Space Grotesk | Poppins 400 |
| Primary accent | Character-driven via `data-accent` | Magenta `#db0081` |
| Button radius | Round (28px default) | Pill (999px) |
| Shadows | Soft elevation | Flat (none) |
| Surface palette | Warm cream tones | Lavender/neutral tones |
| Ink colour | `#191512` | `#55005a` |

### Combining axes on Aware pages

Aware brand + cool canvas:

```html
<html data-brand="aware" data-canvas="cool" data-type="product">
```

Aware brand + flat elevation (redundant — Aware already sets flat shadows):

```html
<html data-brand="aware" data-elevation="flat">
```


## Component recipes

**No components are exported from the package.** Build everything locally using the tokens below. Copy these recipes into your Make file and extend them — do not import from `@easysimplecool/design-system`.

### Button

```jsx
function Button({ variant = 'primary', size = 'md', children, ...props }) {
  const base = {
    border: '1px solid transparent',
    cursor: 'pointer',
    padding: size === 'sm' ? '8px 16px' : '12px 24px',
    font: size === 'sm' ? 'var(--ds-button-primary-label-sm)' : 'var(--ds-button-primary-label)',
    fontWeight: 'var(--sa-button-font-weight)',
    transition: 'background 0.2s, border-color 0.2s',
  };

  const variants = {
    primary: {
      background: 'var(--ds-button-primary-color-bg)',
      color: 'var(--ds-button-primary-color-fg)',
      borderRadius: 'var(--ds-button-primary-radius)',
    },
    ghost: {
      background: 'var(--ds-button-ghost-color-bg)',
      color: 'var(--ds-button-ghost-color-fg)',
      border: '1px solid var(--ds-button-ghost-border)',
      borderRadius: 'var(--ds-button-ghost-radius)',
    },
    overlay: {
      background: 'var(--ds-button-overlay-color-bg)',
      color: 'var(--ds-button-overlay-color-fg)',
      borderRadius: 'var(--ds-button-overlay-radius)',
    },
  };

  return (
    <button style={{ ...base, ...variants[variant] }} {...props}>
      {children}
    </button>
  );
}
```

Hover states — use CSS or onMouseEnter/onMouseLeave:

- Primary: `background: 'var(--ds-button-primary-color-bg-hover)'`
- Ghost: `background: 'var(--ds-button-ghost-color-bg-hover)'`
- Overlay: `background: 'var(--ds-button-overlay-color-bg-hover)'`

### Input

```jsx
function Input({ ...props }) {
  return (
    <input
      style={{
        fontFamily: 'var(--sa-font-body)',
        fontWeight: 'var(--sa-font-body-weight)',
        color: 'var(--ds-color-ink)',
        background: 'var(--ds-color-surface-secondary)',
        border: '1px solid var(--ds-color-border-subtle)',
        borderRadius: 'var(--ds-borderRadius-input)',
        padding: 'var(--space-3) var(--space-4)',
        width: '100%',
      }}
      {...props}
    />
  );
}
```

### NavLink

```jsx
function NavLink({ children, active, ...props }) {
  return (
    <a
      style={{
        fontFamily: 'var(--sa-font-label)',
        fontWeight: 'var(--sa-font-label-weight)',
        color: active ? 'var(--ds-color-ink)' : 'var(--ds-color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontSize: '11px',
        textDecoration: 'none',
      }}
      {...props}
    >
      {children}
    </a>
  );
}
```

### Eyebrow

```jsx
function Eyebrow({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--sa-font-label)',
      fontWeight: 'var(--sa-font-label-weight)',
      color: 'var(--ds-color-text-subtle)',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      fontSize: '11px',
      margin: 0,
    }}>
      {children}
    </p>
  );
}
```

### PromoCard

```jsx
function PromoCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--sa-surface-elevated)',
      border: '1px solid var(--ds-color-border-subtle)',
      borderRadius: 'var(--sa-radius-card)',
      boxShadow: 'var(--sa-shadow-sm)',
      padding: 'var(--space-6)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      <h3 style={{
        fontFamily: 'var(--sa-font-display)',
        fontWeight: 'var(--sa-font-display-weight)',
        color: 'var(--ds-color-ink)',
        textTransform: 'uppercase',
        margin: 0,
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'var(--sa-font-body)',
        fontWeight: 'var(--sa-font-body-weight)',
        color: 'var(--ds-color-text-muted)',
        marginTop: 'var(--space-4)',
      }}>
        {children}
      </p>
    </div>
  );
}
```

### FilmHero (Second Act)

Full-bleed hero wrapper — combine with nav and release bar patterns:

```jsx
function FilmHero({ eyebrow, title, subtitle, description, cta, imageUrl }) {
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(25, 21, 18, 0.85) 0%, rgba(25, 21, 18, 0.2) 60%, transparent 100%)',
      }} />
      <div style={{
        position: 'relative',
        padding: 'var(--space-24) var(--space-8)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-8)',
        alignItems: 'end',
      }}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--sa-font-display)',
            fontWeight: 'var(--sa-font-display-weight)',
            color: 'var(--ds-color-ink)',
            textTransform: 'uppercase',
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            lineHeight: 0.9,
            marginTop: 'var(--space-4)',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontFamily: 'var(--sa-font-body)',
              color: 'var(--ds-color-ink)',
              fontSize: '1.25rem',
              marginTop: 'var(--space-4)',
            }}>
              {subtitle}
            </p>
          )}
        </div>
        <div>
          {description && (
            <p style={{
              fontFamily: 'var(--sa-font-body)',
              color: 'var(--ds-color-text-body)',
              maxWidth: '400px',
              marginLeft: 'auto',
            }}>
              {description}
            </p>
          )}
          {cta}
        </div>
      </div>
    </section>
  );
}
```

### ReleaseBar (Second Act footer)

See Second Act patterns section for the full release bar recipe.

---

## Do's and don'ts

### Do

- Import both `variables.css` and `theme.css`
- Load web fonts for the active type/brand axis
- Set theme axes on `<html>` when the design calls for a non-default accent, canvas, or type
- Use `var(--ds-color-text-body)` for paragraph text
- Use `var(--ds-color-surface-secondary)` for section backgrounds
- Use `var(--sa-accent)` for CTAs and link hover states
- Build any UI as a LOCAL component using package tokens
- Use `data-brand="aware"` (lowercase) for Aware Super pages
- Omit `data-brand` for Second Act pages

### Don't

- Redefine any `--ds-*` or `--sa-*` variable in project CSS — the package owns them all
- Import `Button`, `Input`, or any component from `@easysimplecool/design-system` — they are not exported
- Import `styles.css` — use `variables.css` + `theme.css`
- Set `data-brand="Second Act"` or `data-brand="Aware"` — invalid selectors
- Create circular variable references between aliases and package tokens
- Hardcode `font-size: 16px` — use `var(--ds-button-primary-label)` or body font roles
- Hardcode `color: #191512` — use `var(--ds-color-ink)`
- Use arbitrary hex colours or Tailwind colour approximations
- Mix this design system with other UI libraries (shadcn, Material, etc.)


---

## Theme axes

Set axis attributes on `<html>`. Each axis switches one token set — axes compose independently; not every permutation is pre-built.

| Axis | Second Act | Aware Super | Exact HTML attribute |
| --- | --- | --- | --- |
| brand | Default — omit `data-brand` (`:root`) | Set `data-brand="aware"` (**lowercase**) | `data-brand="aware"` only |
| `data-accent` | Character colours per film | Magenta from brand block; axis still composes | `green`, `pink`, `teal`, `purple`, `gold`, `terracotta` |
| `data-type` | cinematic (default) | Poppins forced by brand block | `cinematic`, `editorial`, `product`, `mono` |
| `data-radius` | round (default), soft, square | Pill radii via brand block | `round`, `soft`, `square` |
| `data-canvas` | warm (default), cool, dark | Brand surfaces override; axis still composes | `warm`, `cool`, `dark` |
| `data-elevation` | soft (default), flat, dramatic | Flat shadows via brand block | `soft`, `flat`, `dramatic` |

### Default axis values (Second Act — `:root`)

Omit `data-brand` for Second Act. Defaults:

- `data-accent="green"`
- `data-type="cinematic"`
- `data-radius="round"`
- `data-canvas="warm"`
- `data-elevation="soft"`

```html
<html
  data-accent="green"
  data-type="cinematic"
  data-radius="round"
  data-canvas="warm"
  data-elevation="soft"
>
```

### Worked examples

**Second Act film page (The Stunt Guy — teal accent):**

```html
<html data-accent="teal" data-type="cinematic" data-canvas="warm" data-radius="round" data-elevation="soft">
```

**Second Act with pink accent character:**

```html
<html data-accent="pink" data-type="cinematic" data-canvas="warm">
```

**Aware Super marketing page:**

```html
<html data-brand="aware" data-type="product" data-canvas="warm" data-elevation="soft">
```

**Second Act dark canvas:**

```html
<html data-accent="gold" data-type="cinematic" data-canvas="dark" data-elevation="dramatic">
```

---

## Typography

Map text by content role using font-role tokens from `theme.css`. Do not hardcode font families.

| Role | CSS | Use for |
| --- | --- | --- |
| Display | `font-family: var(--sa-font-display)`, `font-weight: var(--sa-font-display-weight)` | Hero titles, massive headlines (uppercase for Second Act) |
| Body | `font-family: var(--sa-font-body)`, `font-weight: var(--sa-font-body-weight)`, `color: var(--ds-color-text-body)` | Paragraphs, default copy |
| Label | `font-family: var(--sa-font-label)`, `font-weight: var(--sa-font-label-weight)`, `text-transform: uppercase`, `letter-spacing: 0.08em–0.12em` | Eyebrows, nav, metadata |
| Button md | `font: var(--ds-button-primary-label)`, `font-weight: var(--sa-button-font-weight)` | Primary button labels |
| Button sm | `font: var(--ds-button-primary-label-sm)` | Small buttons, chips |
| Mono outline | `font: var(--ds-button-outline-mono-sm-label)` | Outline / mono buttons |

Font roles change with `data-type`:

| `data-type` | Display | Label | Body |
| --- | --- | --- | --- |
| `cinematic` | Anton | Space Mono | Space Grotesk |
| `editorial` | Playfair Display | IBM Plex Mono | Inter |
| `product` | Space Grotesk | Space Mono | Inter |
| `mono` | Space Mono | Space Mono | Space Grotesk |

When `data-brand="aware"`, all roles become Poppins regardless of type axis.

**Fonts are not bundled.** Load the families for your active axes — see the bootstrap section.

---

## Token catalog (auto-generated)

Parsed from built CSS on every `npm run build:tokens`. Use these exact variable names.

Variables marked **themed** are overridden by `theme.css` axis blocks (`:root`, `[data-accent]`, `[data-canvas]`, etc.).

### `--ds-*` primitives (`variables.css`)

#### Colour — accent

| Variable | Value |
| --- | --- |
| `--ds-color-accent-gold` | `#d3a044` |
| `--ds-color-accent-gold-deep` | `#a3762a` |
| `--ds-color-accent-green` | `#7aab54` |
| `--ds-color-accent-green-deep` | `#557f36` |
| `--ds-color-accent-pink` | `#db0081` |
| `--ds-color-accent-pink-deep` | `#ad005f` |
| `--ds-color-accent-purple` | `#8668bd` |
| `--ds-color-accent-purple-deep` | `#5f4494` |
| `--ds-color-accent-teal` | `#2f9b91` |
| `--ds-color-accent-teal-deep` | `#1c7069` |
| `--ds-color-accent-terracotta` | `#c25538` |
| `--ds-color-accent-terracotta-deep` | `#96371e` |

#### Colour — brand

| Variable | Value |
| --- | --- |
| `--ds-color-brand-dark-magenta` | `#db0081` |
| `--ds-color-brand-darkest-magenta` | `#ad005f` |
| `--ds-color-brand-deep-purple` | `#55005a` |
| `--ds-color-brand-light-neutral` | `#fcf7f4` |
| `--ds-color-brand-light-purple` | `#f6f2f7` |
| `--ds-color-brand-neutral` | `#fef6ef` |

#### Colour — surface & ink

| Variable | Value |
| --- | --- |
| `--ds-color-surface-hover` | `#f2ecdf` |
| `--ds-color-surface-primary` | `#ffffff` |
| `--ds-color-surface-secondary` | `#f7f3ec` |
| `--ds-color-surface-tertiary` | `#ece5d8` |
| `--ds-color-ink` | `#191512` |
| `--ds-color-text-accent` | `#7aab54` |
| `--ds-color-text-body` | `rgba(25, 21, 18, 0.82)` |
| `--ds-color-text-muted` | `rgba(25, 21, 18, 0.65)` |
| `--ds-color-text-subtle` | `rgba(25, 21, 18, 0.5)` |

#### Colour — border

| Variable | Value |
| --- | --- |
| `--ds-color-border-default` | `rgba(25, 21, 18, 0.25)` |
| `--ds-color-border-strong` | `rgba(25, 21, 18, 0.35)` |
| `--ds-color-border-subtle` | `rgba(25, 21, 18, 0.14)` |

#### Button

| Variable | Value |
| --- | --- |
| `--ds-button-ghost-border` | `rgba(25, 21, 18, 0.25)` |
| `--ds-button-ghost-color-bg` | `rgba(0, 0, 0, 0)` |
| `--ds-button-ghost-color-bg-hover` | `rgba(25, 21, 18, 0.05)` |
| `--ds-button-ghost-color-fg` | `#191512` |
| `--ds-button-ghost-radius` | `16px` |
| `--ds-button-outline-mono-sm-label` | `400 11px/1.4 'Space Mono'` |
| `--ds-button-overlay-color-bg` | `rgba(0, 0, 0, 0.65)` |
| `--ds-button-overlay-color-bg-hover` | `rgba(0, 0, 0, 0.8)` |
| `--ds-button-overlay-color-fg` | `#ffffff` |
| `--ds-button-overlay-radius` | `6px` |
| `--ds-button-primary-color-bg` | `#7aab54` |
| `--ds-button-primary-color-bg-hover` | `#ad005f` |
| `--ds-button-primary-color-fg` | `#ffffff` |
| `--ds-button-primary-label` | `600 16px/1 Montserrat` |
| `--ds-button-primary-label-sm` | `600 13px/1 Montserrat` |
| `--ds-button-primary-radius` | `28px` |

#### Border radius

| Variable | Value |
| --- | --- |
| `--ds-borderRadius-card` | `12px` |
| `--ds-borderRadius-input` | `14px` |
| `--ds-borderRadius-pill` | `28px` |
| `--ds-borderRadius-pill-sm` | `16px` |

#### Font families

| Variable | Value |
| --- | --- |
| `--ds-font-body` | `var(--ds-fontFamilies-body)` |
| `--ds-font-display` | `var(--ds-fontFamilies-space-grotesk)` |
| `--ds-font-family` | `var(--ds-fontFamilies-body)` |
| `--ds-font-mono` | `var(--ds-fontFamilies-mono)` |
| `--ds-fontFamilies-body` | `Montserrat` |
| `--ds-fontFamilies-mono` | `'Space Mono'` |
| `--ds-fontFamilies-space-grotesk` | `'Space Grotesk'` |
| `--ds-fontWeights-medium` | `500` |
| `--ds-fontWeights-regular` | `400` |
| `--ds-fontWeights-semibold` | `600` |

### `--sa-*` semantics (`theme.css` `:root`)

#### Semantic — accent & surfaces

| Variable | Value |
| --- | --- |
| `--sa-accent` | `var(--ds-color-accent-green) **themed**` |
| `--sa-accent-deep` | `var(--ds-color-accent-green-deep) **themed**` |
| `--sa-surface-elevated` | `#fffdf9 **themed**` |
| `--sa-surface-glass` | `color-mix(in srgb,var(--ds-color-surface-secondary) 88%,t…` |

#### Semantic — typography

| Variable | Value |
| --- | --- |
| `--sa-font-body` | `var(--ds-fontFamilies-space-grotesk),system-ui,sans-serif…` |
| `--sa-font-body-weight` | `400 **themed**` |
| `--sa-font-display` | `'Anton',sans-serif **themed**` |
| `--sa-font-display-weight` | `400 **themed**` |
| `--sa-font-label` | `var(--ds-fontFamilies-mono),monospace **themed**` |
| `--sa-font-label-weight` | `400 **themed**` |

#### Semantic — elevation & radius

| Variable | Value |
| --- | --- |
| `--sa-shadow-lg` | `0 30px 80px rgba(15, 10, 5, 0.4) **themed**` |
| `--sa-shadow-md` | `0 22px 60px rgba(25, 21, 18, 0.18) **themed**` |
| `--sa-shadow-play` | `0 12px 40px rgba(0, 0, 0, 0.35) **themed**` |
| `--sa-shadow-sm` | `0 6px 18px rgba(25, 21, 18, 0.08) **themed**` |
| `--sa-radius-card` | `var(--ds-borderRadius-card) **themed**` |
| `--sa-radius-modal` | `20px **themed**` |
| `--sa-hover-lift` | `-4px **themed**` |

### Theme axis selectors (`theme.css`)

| CSS selector | Axis |
| --- | --- |
| `:root` | Second Act default (all axes at default values) |
| `[data-accent="green"],[data-theme="green"]` | `data-accent="green"` |
| `[data-accent="pink"],[data-theme="pink"]` | `data-accent="pink"` |
| `[data-accent="teal"],[data-theme="teal"]` | `data-accent="teal"` |
| `[data-accent="purple"],[data-theme="purple"]` | `data-accent="purple"` |
| `[data-accent="gold"],[data-theme="gold"]` | `data-accent="gold"` |
| `[data-accent="terracotta"],[data-theme="terracotta"]` | `data-accent="terracotta"` |
| `[data-type="cinematic"]` | `data-type="cinematic"` |
| `[data-type="editorial"]` | `data-type="editorial"` |
| `[data-type="product"]` | `data-type="product"` |
| `[data-type="mono"]` | `data-type="mono"` |
| `[data-canvas="cool"]` | `data-canvas="cool"` |
| `[data-canvas="dark"]` | `data-canvas="dark"` |
| `[data-elevation="flat"]` | `data-elevation="flat"` |
| `[data-elevation="dramatic"]` | `data-elevation="dramatic"` |
| `[data-radius="soft"]` | `data-radius="soft"` |
| `[data-radius="square"]` | `data-radius="square"` |
| `[data-brand="aware"]` | `data-brand="aware"` |

Legacy `data-theme="<accent>"` selectors still work for accent-only switching (paired with each `[data-accent]` block).

Accent colour for CTAs and links follows `--sa-accent` / `--ds-color-text-accent` (driven by `data-accent`).

---
