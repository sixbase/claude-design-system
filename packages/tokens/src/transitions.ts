export const transitionDuration = {
  fast:   'var(--transition-duration-fast)',
  normal: 'var(--transition-duration-normal)',
  slow:   'var(--transition-duration-slow)',
} as const;

export const transitionEasing = {
  default: 'var(--transition-easing-default)',
  in:      'var(--transition-easing-in)',
  out:     'var(--transition-easing-out)',
  inOut:   'var(--transition-easing-in-out)',
} as const;
