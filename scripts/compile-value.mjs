const FONT_FALLBACKS = {
  Anton: "'Anton',sans-serif",
  'Playfair Display': "'Playfair Display',serif",
  Poppins: "'Poppins',sans-serif",
  'Space Mono': 'var(--ds-fontFamilies-mono),monospace',
  'Space Grotesk': 'var(--ds-fontFamilies-space-grotesk),system-ui,sans-serif',
  'IBM Plex Mono': 'var(--ds-fontFamilies-ibm-plex),monospace',
  Inter: 'var(--ds-fontFamilies-inter),system-ui,sans-serif',
};

const SURFACE_GLASS_RULES = {
  warm: 'color-mix(in srgb,var(--ds-color-surface-secondary) 88%,transparent)',
  cool: 'color-mix(in srgb,var(--ds-color-surface-secondary) 88%,transparent)',
  dark: 'color-mix(in srgb,var(--ds-color-surface-primary) 88%,transparent)',
  aware: 'color-mix(in srgb,#fef6ef 88%,transparent)',
};

function parseReference(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(/^\{([^}]+)\}$/);
  return match ? match[1] : null;
}

function refToCssVar(ref) {
  return `var(--${ref.replace(/\./g, '-')})`;
}

function compileBoxShadow(value) {
  if (value === 'none' || value === null) return 'none';
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return String(value);

  const { x = '0', y = '0', blur = '0', spread = '0', color = 'transparent' } = value;
  const num = (n) => Number(String(n).replace('px', ''));
  const px = (n) => {
    const str = String(n);
    return str.endsWith('px') ? str : `${str}px`;
  };

  if (num(x) === 0 && num(y) === 0 && num(blur) === 0 && num(spread) === 0) {
    return 'none';
  }

  if (num(spread) === 0) {
    return `${num(x)} ${px(y)} ${px(blur)} ${color}`;
  }

  return `${num(x)} ${px(y)} ${px(blur)} ${px(spread)} ${color}`;
}

function compileDimension(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return `${value}px`;
  const str = String(value);
  if (str === '0') return '0';
  if (/^-?\d+(\.\d+)?$/.test(str)) return `${str}px`;
  return str;
}

function compileFontFamily(value, cssVar) {
  if (cssVar === '--sa-font-display' && value === 'Space Grotesk') {
    return 'var(--ds-fontFamilies-space-grotesk),system-ui,sans-serif';
  }
  return FONT_FALLBACKS[value] ?? `'${value}',sans-serif`;
}

function compileAccentColor(ref) {
  const accentMatch = ref.match(/^colour\.accent\.(.+)$/);
  if (!accentMatch) return null;
  return `var(--ds-color-accent-${accentMatch[1]})`;
}

function compileTokenReference(token, resolvedValue) {
  const ref = parseReference(token.value);
  if (ref) {
    if (ref.startsWith('colour.accent.')) return compileAccentColor(ref);
    if (ref.startsWith('ds.') || ref.startsWith('sa.')) return refToCssVar(ref);
  }

  if (typeof resolvedValue === 'string' && resolvedValue.startsWith('{')) {
    const innerRef = resolvedValue.slice(1, -1);
    if (innerRef.startsWith('colour.accent.')) return compileAccentColor(innerRef);
    if (innerRef.startsWith('ds.') || innerRef.startsWith('sa.')) return refToCssVar(innerRef);
  }

  return null;
}

export function compileTokenValue({ cssVar, token, resolvedValue }, context = {}) {
  if (cssVar === '--sa-surface-glass') {
    if (context.canvas === 'cool' || context.canvas === 'warm') {
      return SURFACE_GLASS_RULES[context.canvas];
    }
    if (context.canvas === 'dark') return SURFACE_GLASS_RULES.dark;
    if (context.brand === 'aware') return SURFACE_GLASS_RULES.aware;
    if (context.selector === ':root') return SURFACE_GLASS_RULES.warm;
  }

  const referenceValue = compileTokenReference(token, resolvedValue);
  if (referenceValue) {
    if (
      cssVar === '--ds-button-primary-color-bg' ||
      cssVar === '--ds-button-primary-color-bg-hover' ||
      cssVar === '--ds-color-text-accent'
    ) {
      if (cssVar === '--ds-button-primary-color-bg-hover') return 'var(--sa-accent-deep)';
      return 'var(--sa-accent)';
    }
    return referenceValue;
  }

  if (token.type === 'boxShadow') return compileBoxShadow(resolvedValue);
  if (token.type === 'fontFamilies') return compileFontFamily(resolvedValue, cssVar);
  if (token.type === 'fontWeights') return String(resolvedValue);
  if (token.type === 'borderRadius' || token.type === 'dimension') return compileDimension(resolvedValue);
  if (token.type === 'color') return resolvedValue;

  return String(resolvedValue);
}

export function formatCssDeclaration(cssVar, value) {
  return `  ${cssVar}:${value};`;
}
