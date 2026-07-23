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
