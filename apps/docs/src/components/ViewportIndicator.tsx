import { useState, useEffect } from 'react';

const breakpoints = [
  { name: 'xs', min: 0 },
  { name: 'sm', min: 640 },
  { name: 'md', min: 768 },
  { name: 'lg', min: 1024 },
  { name: 'xl', min: 1280 },
];

function getBreakpoint(width: number): string {
  for (let i = breakpoints.length - 1; i >= 0; i--) {
    if (width >= breakpoints[i].min) return breakpoints[i].name;
  }
  return 'xs';
}

export function ViewportIndicator() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    let raf: number;
    const handleResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!width) return null;

  const bp = getBreakpoint(width);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--spacing-4)',
        right: 'var(--spacing-4)',
        zIndex: 'var(--z-index-tooltip)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-2)',
        padding: 'var(--spacing-1) var(--spacing-3)',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-foreground)',
        fontFamily: 'var(--font-family-code)',
        fontSize: 'var(--font-size-xs)',
        lineHeight: 'var(--line-height-normal)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: bp === 'xs' || bp === 'sm' ? '#E07060' : bp === 'md' ? '#D4A040' : '#5E8F50',
        }}
      />
      {width}px — {bp}
    </div>
  );
}
