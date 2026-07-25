# Typography tokens

This package exposes **font roles and weights**, not a full type-size scale. Pair role fonts with the **allowed size ladder** below. Do not invent Inter/`system-ui` as the brand face, and do not use Tailwind’s default type scale as if it were design-system tokens.

## Font roles (prefer these)

Driven by `data-type` / `data-brand` via `theme.css`:

| Token | Typical use |
|---|---|
| `--sa-font-display` | Hero titles, display headlines |
| `--sa-font-label` | Labels, overlines, mono-ish UI labels |
| `--sa-font-body` | Body copy, UI text |
| `--sa-font-display-weight` | Weight for display |
| `--sa-font-label-weight` | Weight for labels |
| `--sa-font-body-weight` | Weight for body |
| `--sa-button-font` | Button label family |
| `--sa-button-font-weight` | Button label weight |

```css
.hero {
  font-family: var(--sa-font-display);
  font-weight: var(--sa-font-display-weight);
}
.body {
  font-family: var(--sa-font-body);
  font-weight: var(--sa-font-body-weight);
}
.label {
  font-family: var(--sa-font-label);
  font-weight: var(--sa-font-label-weight);
}
```

## Primitive families / weights

Use when a role token is not enough (rare), or for aliases:

| Token | Notes |
|---|---|
| `--ds-fontFamilies-body` | Montserrat |
| `--ds-fontFamilies-mono` | Space Mono |
| `--ds-fontFamilies-space-grotesk` | Space Grotesk |
| `--ds-font-family` / `--ds-font-body` | Aliases → body |
| `--ds-font-display` | Alias → Space Grotesk |
| `--ds-font-mono` | Alias → mono |
| `--ds-fontWeights-regular` | 400 |
| `--ds-fontWeights-medium` | 500 |
| `--ds-fontWeights-semibold` | 600 |

Change personality with `data-type` (`cinematic` | `editorial` | `product` | `mono`) or `data-brand="aware"` — do not hardcode `'Anton'` / `'Playfair Display'` / `'Poppins'` in components.

## Allowed size ladder (Make layout only)

No `--ds-fontSize-*` tokens ship today. Use **only** these sizes for generated UI so Make does not invent random px values:

| Role | Size | Line height | Use |
|---|---|---|---|
| Display | `2.5rem` (40px) | `1.1` | Page hero / one display line |
| Title | `1.75rem` (28px) | `1.2` | Screen title |
| Heading | `1.25rem` (20px) | `1.3` | Section heading |
| Body | `1rem` (16px) | `1.5` | Body copy |
| Label | `0.875rem` (14px) | `1.4` | Form labels, secondary UI |
| Caption | `0.75rem` (12px) | `1.4` | Metadata, timestamps |
| Button | use `--ds-button-primary-label` / `-label-sm` or `1rem` / `0.8125rem` with `--sa-button-font` | — | See `buttons.md` |

```css
/* CORRECT — role font + allowed size */
h1 {
  font-family: var(--sa-font-display);
  font-weight: var(--sa-font-display-weight);
  font-size: 2.5rem;
  line-height: 1.1;
  color: var(--ds-color-ink);
}
p {
  font-family: var(--sa-font-body);
  font-weight: var(--sa-font-body-weight);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--ds-color-text-body);
}
```

## Layout spacing (no spacing tokens)

There is **no** `--ds-spacing-*` scale. For padding/gap/margin in Make projects, use only this ladder (rem):

| Step | Value | Typical use |
|---|---|---|
| 1 | `0.25rem` (4px) | Icon gaps |
| 2 | `0.5rem` (8px) | Tight stacks |
| 3 | `0.75rem` (12px) | Compact lists |
| 4 | `1rem` (16px) | Default control padding / screen gutter (mobile) |
| 5 | `1.5rem` (24px) | Section padding |
| 6 | `2rem` (32px) | Large section gaps |
| 7 | `3rem` (48px) | Hero vertical rhythm |

Do not invent tokens named `--ds-spacing-*` or `--sa-space-*`. Do not treat Tailwind `p-4` / `gap-6` as design-system documentation — if you use utility classes, map them to these rem values only.

## Decision tree

```
┌─ Hero / display headline?
│  └─ font-family: var(--sa-font-display); size 2.5rem
│
├─ Screen title?
│  └─ font-family: var(--sa-font-display) or body role; size 1.75rem
│
├─ Section heading?
│  └─ font-family: var(--sa-font-body); size 1.25rem; ink
│
├─ Body copy?
│  └─ font-family: var(--sa-font-body); size 1rem; text-body
│
├─ Form / UI label?
│  └─ font-family: var(--sa-font-label); size 0.875rem
│
└─ Button label?
   └─ foundations/buttons.md
```

## Rules

- Always set `font-family` from `--sa-font-*` (or documented `--ds-font*` aliases)
- Only use sizes from the ladder above
- Do not use Inter, Roboto, Arial, or system UI as the primary brand face
- Do not set opacity to fake muted text — use `--ds-color-text-muted` / `-subtle`
