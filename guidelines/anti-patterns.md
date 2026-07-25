# Anti-patterns

Do not do these in Figma Make projects that use `@easysimplecool/design-system`.

## Forbidden styling

| Forbidden | Use instead |
|---|---|
| Hex/rgb for brand surfaces, ink, borders, accents (`#fff`, `#191512`, `rgb(...)`) | `var(--ds-*)` / `var(--sa-*)` |
| Tailwind palette utilities (`bg-gray-100`, `text-slate-600`, `bg-white`, `bg-green-500`) | Surface/text/accent tokens |
| shadcn / Base UI theme tokens (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, `bg-card`) | This package’s variables |
| Arbitrary radius / shadow (`rounded-[12px]`, `shadow-[0_4px_...]`) | `--sa-radius-*`, `--ds-borderRadius-*`, `--sa-shadow-*` |
| `calc(var(--ds-borderRadius-card) * 1px)` | `var(--ds-borderRadius-card)` (values already have units) |
| Hardcoded `'Inter'`, `'Roboto'`, `'Arial'`, `system-ui` as the main face | `--sa-font-display\|label\|body` |
| Large fills with `--sa-accent` or accent palette | Accent for CTAs/links only |
| `.dark` class theme switching | `data-canvas="dark"` |
| Invented `--ds-spacing-*` / `--sa-space-*` tokens | Rem ladder in `foundations/typography.md` |
| CSS name `colour` | `color` (published vars use `color`) |

## Forbidden package misuse

| Forbidden | Why |
|---|---|
| `import { Button } from '@easysimplecool/design-system'` | Package is CSS-only |
| Editing `node_modules/.../dist/variables.css` or `theme.css` | Overwritten on install; source is Tokens Studio |
| Reintroducing Style Dictionary / token build in the Make app | Build lives in this repo / CI |
| Loading only `variables.css` and skipping `theme.css` | `--sa-*` and axis overrides missing |
| Redefining `:root { --sa-accent: ... }` in local CSS to “fix” a look | Set `data-accent` / other axes |

## Forbidden composition habits

- Multiple primary CTAs in one section
- Mixing random corner radii when axis tokens exist
- Leaving Base UI unstyled (default greys) instead of applying tokens
- Baking a single theme snapshot (hardcoded warm-green hex) so `data-*` axes cannot work
- Using Figma library variables under different names without mapping them to the same `var(--ds-*)` / `var(--sa-*)` code syntax — **npm CSS wins on conflict**

## Quick self-check before finishing generation

- [ ] Both CSS files imported (variables then theme)
- [ ] Colors/radii/shadows/fonts use `var(--ds-*)` or `var(--sa-*)`
- [ ] No Tailwind grey/white/green palette classes for brand UI
- [ ] No shadcn semantic classnames for theme
- [ ] Buttons use `--ds-button-*` tokens
- [ ] Theme changes go through `data-*` on `<html>`
