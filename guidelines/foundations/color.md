# Color tokens

Organize by the decision you are making. Prefer semantic/theme tokens (`--sa-*`) over raw accent palette (`--ds-color-accent-*`) when the accent axis should drive the UI.

Colors are complete CSS values — use `var(...)` directly.

## Choosing backgrounds

```
┌─ Page / app canvas?
│  └─ background: var(--ds-color-surface-secondary)
│
├─ Elevated card, panel, modal panel?
│  └─ background: var(--sa-surface-elevated)
│     (fallback: var(--ds-color-surface-primary))
│
├─ Nested / recessed surface inside a card?
│  └─ background: var(--ds-color-surface-tertiary)
│     or var(--ds-color-surface-primary)
│
├─ Hover fill on a clickable row/region?
│  └─ background: var(--ds-color-surface-hover)
│
├─ Frosted / translucent overlay panel?
│  └─ background: var(--sa-surface-glass)
│
└─ Primary CTA fill?
   └─ background: var(--ds-button-primary-color-bg)
      (theme-wired to --sa-accent — see buttons.md)
```

| Token | When to use |
|---|---|
| `--ds-color-surface-secondary` | Page canvas |
| `--ds-color-surface-primary` | Solid white/primary panels |
| `--sa-surface-elevated` | Cards / elevated content (theme-aware) |
| `--ds-color-surface-tertiary` | Recessed bands, well backgrounds |
| `--ds-color-surface-hover` | Hover states on surfaces |
| `--sa-surface-glass` | Glass / translucent panels |

IMPORTANT: Do not paint large regions with `--sa-accent` or `--ds-color-accent-*`. Accent is for small actions and highlights.

## Choosing text colors

```
┌─ Primary readable text / titles?
│  └─ color: var(--ds-color-ink)
│
├─ Body copy?
│  └─ color: var(--ds-color-text-body)
│
├─ Supporting / secondary labels?
│  └─ color: var(--ds-color-text-muted)
│
├─ Placeholder / lowest emphasis?
│  └─ color: var(--ds-color-text-subtle)
│
├─ Link or accent-colored inline text?
│  └─ color: var(--ds-color-text-accent)
│     (follows --sa-accent)
│
└─ Text on primary button / solid accent?
   └─ color: var(--ds-button-primary-color-fg)
```

| Token | When to use |
|---|---|
| `--ds-color-ink` | High-contrast titles, primary UI chrome |
| `--ds-color-text-body` | Body paragraphs |
| `--ds-color-text-muted` | Secondary labels, metadata |
| `--ds-color-text-subtle` | Placeholders, de-emphasized hints |
| `--ds-color-text-accent` | Links, accent labels |

## Choosing borders

| Token | When to use |
|---|---|
| `--ds-color-border-default` | Default control / card borders |
| `--ds-color-border-subtle` | Quiet dividers, secondary edges |
| `--ds-color-border-strong` | Strong separation, emphasis |

```css
border: 1px solid var(--ds-color-border-default);
```

Prefer surface contrast over borders for large layout regions. Borders are for interactive edges, cards that need definition, and dividers.

## Accent palette (primitives)

Use raw accent tokens only when you need a **fixed** accent that must not follow `data-accent` (rare). For normal themed UI, use `--sa-accent` / `--sa-accent-deep`.

| Token | Role |
|---|---|
| `--sa-accent` | Active theme accent |
| `--sa-accent-deep` | Hover / deeper accent |
| `--ds-color-accent-green` … `-terracotta` (+ `-deep`) | Fixed palette swatches |
| `--ds-color-brand-*` | Brand magenta / purple / neutrals (Aware-related primitives) |

## Correct vs incorrect

```css
/* CORRECT */
.page { background: var(--ds-color-surface-secondary); color: var(--ds-color-ink); }
.card { background: var(--sa-surface-elevated); border: 1px solid var(--ds-color-border-subtle); }
.link { color: var(--ds-color-text-accent); }

/* WRONG */
.page { background: #f7f3ec; color: #191512; }
.card { background: white; border-color: #e5e5e5; }
.link { color: #7aab54; }
.panel { background: var(--sa-accent); } /* accent as large fill — forbidden */
```

## Rules

- Prefer `--sa-*` surfaces/accent; use `--ds-color-*` for ink, text roles, borders, canvas
- Never hardcode hex for surfaces, ink, borders, or accents
- Never use Tailwind greys/whites as brand surfaces
- Accent stays sparse
