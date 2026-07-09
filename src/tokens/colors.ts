// Design tokens — the single source of truth for values used across components.
// Figma Make (and your team) should reference these rather than hardcoding
// colors, spacing, or type sizes anywhere else.

export const colors = {
  primary: '#4F46E5',
  primaryHover: '#4338CA',
  secondary: '#F3F4F6',
  secondaryHover: '#E5E7EB',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#D1D5DB',
  danger: '#DC2626',
  background: '#FFFFFF',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

export const typography = {
  fontFamily: `'Inter', -apple-system, sans-serif`,
  sizes: {
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '28px',
  },
  weights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
} as const;

export const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;
