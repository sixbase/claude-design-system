import { useState } from 'react';
import './Preview.css';

interface PreviewProps {
  children: React.ReactNode;
  /** Stack items vertically instead of wrapping horizontally */
  stack?: boolean;
}

export function Preview({ children, stack = false }: PreviewProps) {
  const [dark, setDark] = useState(false);

  return (
    <div className={`ds-preview${dark ? ' dark' : ''}`}>
      <div className="ds-preview__toolbar">
        <button
          className="ds-preview__toggle"
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? '☀ Light' : '☾ Dark'}
        </button>
      </div>
      <div className={`ds-preview__canvas${stack ? ' ds-preview__canvas--stack' : ''}`}>
        {children}
      </div>
    </div>
  );
}
