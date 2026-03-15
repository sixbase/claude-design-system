import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import './Typography.css';

// ─── Heading ──────────────────────────────────────────────────

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** HTML heading level and visual size */
  as?: HeadingLevel;
  muted?: boolean;
  truncate?: boolean;
}

/**
 * Heading
 *
 * Renders semantic heading elements (h1–h4) with consistent typographic scale.
 *
 * @example
 * <Heading as="h1">Page title</Heading>
 * <Heading as="h3" muted>Section subtitle</Heading>
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { as: Tag = 'h2', muted = false, truncate = false, className, children, ...props },
  ref,
) {
  const classes = [
    'ds-heading',
    `ds-heading--${Tag}`,
    muted && 'ds-heading--muted',
    truncate && 'ds-heading--truncate',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={classes} {...props}>
      {children}
    </Tag>
  );
});

Heading.displayName = 'Heading';

// ─── Text ─────────────────────────────────────────────────────

export type TextSize = 'sm' | 'base' | 'lg';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextElement = 'p' | 'span' | 'div' | 'label' | 'strong' | 'em';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextElement;
  size?: TextSize;
  weight?: TextWeight;
  muted?: boolean;
  truncate?: boolean;
  children?: ReactNode;
}

/**
 * Text
 *
 * General-purpose text component for body copy, labels, and inline text.
 *
 * @example
 * <Text size="base">Body copy</Text>
 * <Text as="span" size="sm" muted>Helper text</Text>
 */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    as: Tag = 'p' as ElementType,
    size = 'base',
    weight,
    muted = false,
    truncate = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const classes = [
    'ds-text',
    `ds-text--${size}`,
    weight && `ds-text--${weight}`,
    muted && 'ds-text--muted',
    truncate && 'ds-text--truncate',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref as never} className={classes} {...props}>
      {children}
    </Tag>
  );
});

Text.displayName = 'Text';

// ─── Caption ─────────────────────────────────────────────────

export interface CaptionProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

/**
 * Caption
 *
 * Extra-small muted text for metadata, timestamps, and secondary labels.
 *
 * @example
 * <Caption>Last updated 2 hours ago</Caption>
 */
export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(function Caption(
  { className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={['ds-caption', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  );
});

Caption.displayName = 'Caption';

// ─── Code ─────────────────────────────────────────────────────

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

/**
 * Code
 *
 * Inline monospace code snippet with subtle background.
 *
 * @example
 * <Text>Use the <Code>import</Code> statement.</Text>
 */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { className, children, ...props },
  ref,
) {
  return (
    <code ref={ref} className={['ds-code', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </code>
  );
});

Code.displayName = 'Code';
