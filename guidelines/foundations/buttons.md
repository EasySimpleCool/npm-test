# Buttons (CSS tokens only)

This package does **not** export a `Button` component. Style `<button>` (or Base UI button trigger) with the CSS variables below.

Primary fill tracks `--sa-accent` when `theme.css` is loaded.

## Variants

| Variant | When to use |
|---|---|
| Primary | Main CTA — one per visible section |
| Ghost | Secondary / outline actions |
| Overlay | Controls on top of media / dark imagery |

## Primary

```css
.btn-primary {
  font: var(--ds-button-primary-label); /* 600 16px/1 Montserrat — or compose below */
  font-family: var(--sa-button-font);
  font-weight: var(--sa-button-font-weight);
  font-size: 1rem;
  line-height: 1;
  color: var(--ds-button-primary-color-fg);
  background: var(--ds-button-primary-color-bg);
  border: none;
  border-radius: var(--ds-button-primary-radius);
  padding: 0.75rem 1rem;
  cursor: pointer;
}
.btn-primary:hover {
  background: var(--ds-button-primary-color-bg-hover);
}
.btn-primary-sm {
  font: var(--ds-button-primary-label-sm); /* 600 13px/1 */
  /* or: font-size: 0.8125rem; same family/weight as primary */
}
```

Tokens: `--ds-button-primary-color-bg`, `-bg-hover`, `-color-fg`, `-radius`, `-label`, `-label-sm`.

## Ghost

```css
.btn-ghost {
  font-family: var(--sa-button-font);
  font-weight: var(--sa-button-font-weight);
  font-size: 1rem;
  color: var(--ds-button-ghost-color-fg);
  background: var(--ds-button-ghost-color-bg);
  border: 1px solid var(--ds-button-ghost-border);
  border-radius: var(--ds-button-ghost-radius);
  padding: 0.75rem 1rem;
  cursor: pointer;
}
.btn-ghost:hover {
  background: var(--ds-button-ghost-color-bg-hover);
}
```

## Overlay

```css
.btn-overlay {
  font-family: var(--sa-button-font);
  font-weight: var(--sa-button-font-weight);
  font-size: 0.875rem;
  color: var(--ds-button-overlay-color-fg);
  background: var(--ds-button-overlay-color-bg);
  border: none;
  border-radius: var(--ds-button-overlay-radius);
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}
.btn-overlay:hover {
  background: var(--ds-button-overlay-color-bg-hover);
}
```

## Compact mono label (optional)

For dense mono captions on controls:

```css
.btn-mono-sm {
  font: var(--ds-button-outline-mono-sm-label); /* 400 11px/1.4 Space Mono */
}
```

## Decision tree

```
┌─ Main call-to-action (one per section)?
│  └─ Primary
│
├─ Secondary action beside primary?
│  └─ Ghost
│
└─ Control sitting on a photo / video / dark media?
   └─ Overlay
```

## Rules

- Do not `import { Button } from '@easysimplecool/design-system'` — it does not exist
- Do not use shadcn/`Button` default variants as a substitute for these tokens
- Only one primary button per visible section
- Prefer token-backed colors/radii over Tailwind `bg-green-600` / `rounded-full`
- Hover states must use the matching `*-hover` tokens
