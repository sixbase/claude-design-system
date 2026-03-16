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

function getDotClass(bp: string): string {
  if (bp === 'xs' || bp === 'sm') return 'ds-viewport-indicator__dot--narrow';
  if (bp === 'md') return 'ds-viewport-indicator__dot--mid';
  return 'ds-viewport-indicator__dot--wide';
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
    <div className="ds-viewport-indicator">
      <span className={`ds-viewport-indicator__dot ${getDotClass(bp)}`} />
      {width}px — {bp}
    </div>
  );
}
