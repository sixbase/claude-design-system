import { useState } from 'react';
import './Preview.css';

interface PreviewProps {
  children: React.ReactNode;
  /** Stack items vertically instead of wrapping horizontally */
  stack?: boolean;
  /** Remove canvas padding — for full-width components (Header, Footer) */
  flush?: boolean;
}

export function Preview({ children, stack = false, flush = false }: PreviewProps) {
  const [dark, setDark] = useState(false);

  const canvasClasses = [
    'ds-preview__canvas',
    stack && 'ds-preview__canvas--stack',
    flush && 'ds-preview__canvas--flush',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={['ds-preview', dark && 'dark'].filter(Boolean).join(' ')}>
      <div className="ds-preview__toolbar">
        <button
          className="ds-preview__toggle"
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? '☀ Light' : '☾ Dark'}
        </button>
      </div>
      <div className={canvasClasses}>
        {children}
      </div>
    </div>
  );
}
