import { forwardRef } from 'react';
import type { SVGAttributes, ReactNode } from 'react';
import './Icon.css';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps extends SVGAttributes<SVGElement> {
  /** Icon size — sm (16px), md (20px), lg (24px) */
  size?: IconSize;
  /** Accessible label — required when decorative={false} */
  label?: string;
  /** When true (default), icon is hidden from assistive tech */
  decorative?: boolean;
  /** Pass an SVG element directly */
  children?: ReactNode;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  function Icon(
    {
      size = 'md',
      label,
      decorative = true,
      children,
      className,
      ...props
    },
    ref,
  ) {
    if (!children) {
      return null;
    }

    const classes = [
      'ds-icon',
      `ds-icon--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const ariaProps = decorative
      ? { 'aria-hidden': true as const }
      : { role: 'img' as const, 'aria-label': label };

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
        {...ariaProps}
        {...props}
      >
        {children}
      </svg>
    );
  },
);

Icon.displayName = 'Icon';
