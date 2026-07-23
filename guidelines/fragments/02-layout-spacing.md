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
