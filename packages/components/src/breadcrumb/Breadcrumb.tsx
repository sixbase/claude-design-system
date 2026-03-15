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
  /** Custom separator between items. Defaults to "›" */
  separator?: ReactNode;
  /** Max visible items. When exceeded, middle items collapse to "…". */
  maxItems?: number;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator = '\u203A', maxItems, className, ...props },
  ref,
) {
  const shouldCollapse = !!(maxItems && maxItems > 1 && items.length > maxItems);

  // Indices of middle items that get hidden on mobile when maxItems is set
  const collapsibleSet = new Set<number>();
  if (shouldCollapse) {
    const keepFromEnd = maxItems - 1;
    for (let i = 1; i < items.length - keepFromEnd; i++) {
      collapsibleSet.add(i);
    }
  }

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
          const isFirst = i === 0;
          const isCollapsible = collapsibleSet.has(i);
          return (
            <li
              key={item.label}
              className={[
                'ds-breadcrumb__item',
                isCollapsible && 'ds-breadcrumb__item--collapsible',
              ]
                .filter(Boolean)
                .join(' ')}
            >
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
                  {shouldCollapse && isFirst && (
                    <>
                      <span className="ds-breadcrumb__ellipsis" aria-hidden="true">
                        …
                      </span>
                      <span
                        className="ds-breadcrumb__separator ds-breadcrumb__separator--after-ellipsis"
                        aria-hidden="true"
                      >
                        {separator}
                      </span>
                    </>
                  )}
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
