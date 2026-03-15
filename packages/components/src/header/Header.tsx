import { forwardRef, useState, useEffect, useCallback } from 'react';
import './Header.css';

export interface HeaderNavItem {
  label: string;
  href: string;
}

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Logo image URL */
  logoSrc: string;
  /** Logo alt text */
  logoAlt?: string;
  /** Logo link destination */
  logoHref?: string;
  /** Main navigation links */
  navItems?: HeaderNavItem[];
  /** Cart icon link destination */
  cartHref?: string;
  /** Number of items in cart */
  cartCount?: number;
  /** Show dark/light theme toggle */
  showThemeToggle?: boolean;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      logoSrc,
      logoAlt = 'Home',
      logoHref = '/',
      navItems = [],
      cartHref = '/cart',
      cartCount = 0,
      showThemeToggle = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = useCallback(() => {
      const next = !isDark;
      setIsDark(next);
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('ds-theme', next ? 'dark' : 'light');
    }, [isDark]);

    const classes = ['ds-header', className].filter(Boolean).join(' ');

    return (
      <header ref={ref} className={classes} {...props}>
        <div className="ds-header__inner">
          <a href={logoHref} className="ds-header__logo" aria-label={logoAlt}>
            <img src={logoSrc} alt={logoAlt} className="ds-header__logo-img" />
          </a>

          {navItems.length > 0 && (
            <nav className="ds-header__nav" aria-label="Main">
              {navItems.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          <div className="ds-header__actions">
            {showThemeToggle && (
              <button
                type="button"
                className="ds-header__icon-btn ds-header__theme-toggle"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
              >
                <svg
                  className="ds-header__theme-icon ds-header__theme-icon--sun"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <svg
                  className="ds-header__theme-icon ds-header__theme-icon--moon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </button>
            )}

            <a
              href={cartHref}
              className="ds-header__icon-btn ds-header__cart"
              aria-label={`Shopping bag (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </a>
          </div>
        </div>
      </header>
    );
  },
);

Header.displayName = 'Header';
