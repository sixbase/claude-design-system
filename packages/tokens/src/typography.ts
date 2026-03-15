export const fontFamily = {
  sans:  'var(--font-family-sans)',
  mono:  'var(--font-family-mono)',
  serif: 'var(--font-family-serif)',
} as const;

export const fontSize = {
  xs:   'var(--font-size-xs)',
  sm:   'var(--font-size-sm)',
  base: 'var(--font-size-base)',
  lg:   'var(--font-size-lg)',
  xl:   'var(--font-size-xl)',
  '2xl': 'var(--font-size-2xl)',
  '3xl': 'var(--font-size-3xl)',
  '4xl': 'var(--font-size-4xl)',
  '5xl': 'var(--font-size-5xl)',
} as const;

export const fontWeight = {
  normal:   'var(--font-weight-normal)',
  medium:   'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold:     'var(--font-weight-bold)',
} as const;

export const lineHeight = {
  none:    'var(--line-height-none)',
  tight:   'var(--line-height-tight)',
  snug:    'var(--line-height-snug)',
  normal:  'var(--line-height-normal)',
  relaxed: 'var(--line-height-relaxed)',
  loose:   'var(--line-height-loose)',
} as const;

export const letterSpacing = {
  tighter: 'var(--letter-spacing-tighter)',
  tight:   'var(--letter-spacing-tight)',
  normal:  'var(--letter-spacing-normal)',
  wide:    'var(--letter-spacing-wide)',
  wider:   'var(--letter-spacing-wider)',
} as const;
