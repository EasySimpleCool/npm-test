## Troubleshooting — "everything unstyled"

If the Make file renders with no colours, wrong fonts, or broken layout, work through this checklist **in order** before generating new UI.

### 1. CSS imports

- [ ] Both `${packageName}/variables.css` AND `${packageName}/theme.css` are imported in the app entry
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
- [ ] NOT importing `{ Button, Input }` from `${packageName}` (not exported)
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
