## Component recipes

**No components are exported from the package.** Build everything locally using the tokens below. Copy these recipes into your Make file and extend them — do not import from `${packageName}`.

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
- Import `Button`, `Input`, or any component from `${packageName}` — they are not exported
- Import `styles.css` — use `variables.css` + `theme.css`
- Set `data-brand="Second Act"` or `data-brand="Aware"` — invalid selectors
- Create circular variable references between aliases and package tokens
- Hardcode `font-size: 16px` — use `var(--ds-button-primary-label)` or body font roles
- Hardcode `color: #191512` — use `var(--ds-color-ink)`
- Use arbitrary hex colours or Tailwind colour approximations
- Mix this design system with other UI libraries (shadcn, Material, etc.)
