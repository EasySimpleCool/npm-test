# Radius and elevation

Radii and shadows are complete CSS values — use `var(...)` directly (no `calc(... * 1px)`).

Radius and elevation respond to `data-radius` and `data-elevation` (and `data-brand="aware"`). Prefer theme tokens so axes keep working.

## Choosing radius

```
┌─ Card / content panel?
│  └─ border-radius: var(--sa-radius-card)
│
├─ Modal / dialog shell?
│  └─ border-radius: var(--sa-radius-modal)
│
├─ Text input / select?
│  └─ border-radius: var(--ds-borderRadius-input)
│
├─ Pill / chip / primary button shape?
│  └─ border-radius: var(--ds-borderRadius-pill)
│     or button-specific: var(--ds-button-primary-radius)
│
├─ Smaller pill / ghost button?
│  └─ border-radius: var(--ds-borderRadius-pill-sm)
│     or var(--ds-button-ghost-radius)
│
└─ Overlay control on media?
   └─ border-radius: var(--ds-button-overlay-radius)
```

| Token | When to use |
|---|---|
| `--sa-radius-card` | Cards, panels |
| `--sa-radius-modal` | Modals, large overlays |
| `--ds-borderRadius-input` | Inputs |
| `--ds-borderRadius-pill` | Pills, primary-like chips |
| `--ds-borderRadius-pill-sm` | Compact pills |
| `--ds-button-primary-radius` | Primary buttons |
| `--ds-button-ghost-radius` | Ghost buttons |
| `--ds-button-overlay-radius` | Overlay buttons |

Do not use arbitrary `rounded-[12px]` / `border-radius: 12px` when a token exists. Change global corner language with `data-radius` (`round` | `soft` | `square`), not one-off px.

## Choosing elevation

| Token | When to use |
|---|---|
| `--sa-shadow-sm` | Subtle lift (menus, small cards) |
| `--sa-shadow-md` | Standard elevated card / popover |
| `--sa-shadow-lg` | Strong modal / dramatic stage |
| `--sa-shadow-play` | Media / play-focus emphasis |
| `--sa-hover-lift` | `translateY` on hover (e.g. `transform: translateY(var(--sa-hover-lift))`) |
| `--sa-surface-glass` | Translucent elevated surface (pairs with blur if you add it locally) |

```css
.card {
  background: var(--sa-surface-elevated);
  border-radius: var(--sa-radius-card);
  box-shadow: var(--sa-shadow-md);
}
.card:hover {
  transform: translateY(var(--sa-hover-lift));
}
```

With `data-elevation="flat"` (or Aware brand), shadows resolve to `none` and hover-lift to `0` — still reference the variables so the axis works.

## Rules

- Prefer `--sa-radius-*` / `--sa-shadow-*` for themed chrome
- Never hand-write `box-shadow: 0 4px 6px rgba(...)` for brand elevation
- Never mix random corner radii on the same screen when axis tokens cover the case
- Surface color creates hierarchy first; shadows second
