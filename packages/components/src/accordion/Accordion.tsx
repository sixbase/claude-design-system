import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import './Accordion.css';

// ─── Types ────────────────────────────────────────────────

export type AccordionSize = 'sm' | 'md' | 'lg';

export type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  /** Size variant — controls padding and font size */
  size?: AccordionSize;
};

export interface AccordionItemProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

export interface AccordionTriggerProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  /** Size variant — controls padding and font size */
  size?: AccordionSize;
}

export interface AccordionContentProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
  /** Size variant — controls padding */
  size?: AccordionSize;
}

// ─── Chevron Icon ────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg
      className="ds-accordion__chevron"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Root ─────────────────────────────────────────────────

/**
 * Accordion
 *
 * A vertically stacked set of collapsible sections.
 * Built on Radix UI Accordion for full keyboard and screen reader support.
 *
 * Compound component API:
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section title</AccordionTrigger>
 *     <AccordionContent>Section content</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion({ size = 'md', className, ...props }, ref) {
    const classes = [
      'ds-accordion',
      `ds-accordion--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <AccordionPrimitive.Root ref={ref} className={classes} {...props} />;
  },
);
Accordion.displayName = 'Accordion';

// ─── Item ─────────────────────────────────────────────────

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ className, ...props }, ref) {
    const classes = ['ds-accordion__item', className].filter(Boolean).join(' ');
    return <AccordionPrimitive.Item ref={ref} className={classes} {...props} />;
  },
);
AccordionItem.displayName = 'AccordionItem';

// ─── Trigger ──────────────────────────────────────────────

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, ...props }, ref) {
    const classes = ['ds-accordion__trigger', className].filter(Boolean).join(' ');
    return (
      <AccordionPrimitive.Header className="ds-accordion__header">
        <AccordionPrimitive.Trigger ref={ref} className={classes} {...props}>
          <span className="ds-accordion__trigger-text">{children}</span>
          <ChevronIcon />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  },
);
AccordionTrigger.displayName = 'AccordionTrigger';

// ─── Content ──────────────────────────────────────────────

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...props }, ref) {
    const classes = ['ds-accordion__content', className].filter(Boolean).join(' ');
    return (
      <AccordionPrimitive.Content ref={ref} className={classes} {...props}>
        <div className="ds-accordion__content-inner">{children}</div>
      </AccordionPrimitive.Content>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';
