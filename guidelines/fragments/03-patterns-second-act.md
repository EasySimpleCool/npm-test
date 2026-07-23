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
