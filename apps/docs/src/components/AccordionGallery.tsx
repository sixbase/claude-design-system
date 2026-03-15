import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@ds/components';
import { Preview } from './Preview';

export function AccordionDefault() {
  return (
    <Preview stack>
      <div style={{ width: '100%' }}>
        <Accordion type="single" collapsible>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
            <AccordionContent>
              Free standard shipping on orders over $50. Express shipping available
              at checkout. Most orders arrive within 3–5 business days.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>Returns & Exchanges</AccordionTrigger>
            <AccordionContent>
              We accept returns within 30 days of purchase. Items must be unworn
              and in original packaging. Free return shipping on all orders.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="care">
            <AccordionTrigger>Care Instructions</AccordionTrigger>
            <AccordionContent>
              Machine wash cold with like colors. Tumble dry low. Do not bleach.
              Iron on low heat if needed.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Preview>
  );
}

export function AccordionMultiple() {
  return (
    <Preview stack>
      <div style={{ width: '100%' }}>
        <Accordion type="multiple" defaultValue={['features', 'specs']}>
          <AccordionItem value="features">
            <AccordionTrigger>Features</AccordionTrigger>
            <AccordionContent>
              Lightweight aramid fiber construction. MagSafe compatible.
              Precision-cut for all ports and buttons.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="specs">
            <AccordionTrigger>Specifications</AccordionTrigger>
            <AccordionContent>
              Weight: 12g. Thickness: 0.65mm. Material: Aramid fiber.
              Compatible with iPhone 17 Pro Max.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="warranty">
            <AccordionTrigger>Warranty</AccordionTrigger>
            <AccordionContent>
              Covered by a 1-year limited warranty against manufacturing defects.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Preview>
  );
}

export function AccordionSizes() {
  return (
    <Preview stack>
      <div style={{ width: '100%' }}>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-foreground-muted)', margin: '0 0 var(--spacing-2)' }}>Small</p>
        <Accordion type="single" collapsible size="sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>Small accordion item</AccordionTrigger>
            <AccordionContent>Compact content for dense layouts.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div style={{ width: '100%' }}>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-foreground-muted)', margin: '0 0 var(--spacing-2)' }}>Medium (default)</p>
        <Accordion type="single" collapsible size="md">
          <AccordionItem value="item-1">
            <AccordionTrigger>Medium accordion item</AccordionTrigger>
            <AccordionContent>Default size for most use cases.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div style={{ width: '100%' }}>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-foreground-muted)', margin: '0 0 var(--spacing-2)' }}>Large</p>
        <Accordion type="single" collapsible size="lg">
          <AccordionItem value="item-1">
            <AccordionTrigger>Large accordion item</AccordionTrigger>
            <AccordionContent>Spacious layout for prominent sections.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Preview>
  );
}
