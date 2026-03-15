import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Ordered list of breadcrumb items. Last item is treated as current page. */
  items: BreadcrumbItem[];
  /** Custom separator between items. Defaults to "/" */
  separator?: ReactNode;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator = '/', className, ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={['ds-breadcrumb', className].filter(Boolean).join(' ')}
      {...props}
    >
      <ol className="ds-breadcrumb__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="ds-breadcrumb__item">
              {isLast ? (
                <span className="ds-breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  {item.href ? (
                    <a href={item.href} className="ds-breadcrumb__link">
                      {item.label}
                    </a>
                  ) : (
                    <span className="ds-breadcrumb__link">{item.label}</span>
                  )}
                  <span className="ds-breadcrumb__separator" aria-hidden="true">
                    {separator}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
Breadcrumb.displayName = 'Breadcrumb';
