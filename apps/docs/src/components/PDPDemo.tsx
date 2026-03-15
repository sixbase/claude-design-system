import { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Breadcrumb, ImageGallery, QuantitySelector, Button, StarRating } from '@ds/components';
import { ViewportIndicator } from './ViewportIndicator';
import './PDPDemo.css';

function makePlaceholder(label: string, fill: string, textFill: string) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="${fill}"/><text x="400" y="500" text-anchor="middle" fill="${textFill}" font-size="32" font-family="sans-serif">${label}</text></svg>`,
  )}`;
}

const galleryImages = [
  { src: makePlaceholder('Front', '#E3DED6', '#675F56'), alt: 'Aramid Fiber Case — Front' },
  { src: makePlaceholder('Back', '#C8C2B8', '#4E473F'), alt: 'Aramid Fiber Case — Back' },
  { src: makePlaceholder('Side', '#A59E94', '#342F2A'), alt: 'Aramid Fiber Case — Side' },
  { src: makePlaceholder('Detail', '#847D73', '#FAF9F7'), alt: 'Aramid Fiber Case — Detail' },
];

function makeLifestylePlaceholder(label: string, fill: string, textFill: string) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800" viewBox="0 0 1000 800"><rect width="1000" height="800" fill="${fill}"/><text x="500" y="400" text-anchor="middle" fill="${textFill}" font-size="28" font-family="sans-serif">${label}</text></svg>`,
  )}`;
}

const lifestyleImages = [
  { src: makeLifestylePlaceholder('Lifestyle 1', '#D6D0C7', '#6B6359'), alt: 'Lifestyle — desk setup' },
  { src: makeLifestylePlaceholder('Lifestyle 2', '#C8C1B6', '#5A5248'), alt: 'Lifestyle — in hand' },
  { src: makeLifestylePlaceholder('Lifestyle 3', '#BEB7AC', '#4E473D'), alt: 'Lifestyle — pocket' },
  { src: makeLifestylePlaceholder('Lifestyle 4', '#B3AC9F', '#413A31'), alt: 'Lifestyle — outdoor' },
  { src: makeLifestylePlaceholder('Lifestyle 5', '#A9A295', '#342F27'), alt: 'Lifestyle — travel' },
];

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Accessories', href: '#' },
  { label: 'Phone Cases', href: '#' },
  { label: 'Aramid Fiber iPhone 17 Pro Max Case' },
];

export function PDPDemo() {
  const [qty, setQty] = useState(1);

  return (
    <>
      <ViewportIndicator />

      <div className="ds-pdp">
        <div className="ds-pdp__breadcrumb">
          <Breadcrumb items={breadcrumbItems} maxItems={3} />
        </div>

        <div className="ds-pdp__gallery">
          <ImageGallery
            images={galleryImages}
            aspectRatio="4/5"
            thumbnailPosition="bottom"
          />
        </div>

        <div className="ds-pdp__details">
          <div className="ds-pdp__header">
            <h1 className="ds-pdp__title">Aramid Fiber iPhone 17 Pro Max Case</h1>
            <p className="ds-pdp__price">$85.00</p>
            <StarRating rating={4.5} reviewCount={128} size="sm" />
          </div>

          <div className="ds-pdp__description">
            <p>
              Ultra-thin aramid fiber case with a precision-cut design.
              Weighs just 12g while providing military-grade protection.
              Compatible with MagSafe wireless charging.
            </p>
          </div>

          <div className="ds-pdp__option">
            <p className="ds-pdp__option-label">Color</p>
            <div className="ds-pdp__colors">
              <button className="ds-pdp__color-btn ds-pdp__color-btn--active" style={{ backgroundColor: '#342F2A' }} aria-label="Carbon Black" />
              <button className="ds-pdp__color-btn" style={{ backgroundColor: '#C8C2B8' }} aria-label="Stone Gray" />
              <button className="ds-pdp__color-btn" style={{ backgroundColor: '#4E473F' }} aria-label="Dark Olive" />
            </div>
          </div>

          <div className="ds-pdp__option">
            <p className="ds-pdp__option-label">Quantity</p>
            <QuantitySelector value={qty} onChange={setQty} min={1} max={10} />
          </div>

          <div className="ds-pdp__actions">
            <Button style={{ width: '100%' }} size="lg">Add to Bag</Button>
            <p className="ds-pdp__stock">
              <span className="ds-pdp__stock-dot" />
              In stock and ready to ship
            </p>
          </div>

          <Accordion type="multiple" size="sm">
            <AccordionItem value="details">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>
                <ul className="ds-pdp__accordion-list">
                  <li>600D aramid fiber construction</li>
                  <li>Weight: 12g</li>
                  <li>Thickness: 0.65mm</li>
                  <li>MagSafe compatible</li>
                  <li>Raised camera lip for lens protection</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
              <AccordionContent>
                <ul className="ds-pdp__accordion-list">
                  <li>Free standard shipping on orders over $50</li>
                  <li>Express delivery: 1–2 business days</li>
                  <li>Standard delivery: 3–5 business days</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>Returns & Warranty</AccordionTrigger>
              <AccordionContent>
                <ul className="ds-pdp__accordion-list">
                  <li>30-day free returns</li>
                  <li>1-year manufacturer warranty</li>
                  <li>Items must be unused and in original packaging</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <section className="ds-pdp__lifestyle">
        <div className="ds-pdp__lifestyle-track">
          {lifestyleImages.map((img) => (
            <div key={img.alt} className="ds-pdp__lifestyle-slide">
              <img src={img.src} alt={img.alt} className="ds-pdp__lifestyle-img" />
            </div>
          ))}
        </div>
      </section>

      <section className="ds-pdp__feature">
        <div className="ds-pdp__feature-image">
          <img
            src={makeLifestylePlaceholder('Engineered Protection', '#C8C1B6', '#4E473D')}
            alt="Aramid fiber weave close-up"
            className="ds-pdp__feature-img"
          />
        </div>
        <div className="ds-pdp__feature-text">
          <h2 className="ds-pdp__feature-title">Engineered for Everyday Protection</h2>
          <p className="ds-pdp__feature-desc">
            Woven from 600D aramid fiber — the same material used in aerospace
            and body armor — this case delivers military-grade impact resistance
            at just 0.65mm thin. The precision-cut design wraps your device
            without adding bulk, while the raised camera lip keeps your lenses
            safe on any surface.
          </p>
        </div>
      </section>

      <section className="ds-pdp__feature ds-pdp__feature--reverse">
        <div className="ds-pdp__feature-image">
          <img
            src={makeLifestylePlaceholder('MagSafe Ready', '#B3AC9F', '#413A31')}
            alt="MagSafe alignment magnets"
            className="ds-pdp__feature-img"
          />
        </div>
        <div className="ds-pdp__feature-text">
          <h2 className="ds-pdp__feature-title">Seamless MagSafe Integration</h2>
          <p className="ds-pdp__feature-desc">
            Precision-aligned magnets ensure a perfect snap every time. Charge
            wirelessly, attach your favorite accessories, and never worry about
            compatibility. The ultra-thin profile means zero interference with
            MagSafe's full magnetic strength.
          </p>
        </div>
      </section>

      <section className="ds-pdp__feature">
        <div className="ds-pdp__feature-image">
          <img
            src={makeLifestylePlaceholder('Featherlight', '#A9A295', '#342F27')}
            alt="Case on precision scale"
            className="ds-pdp__feature-img"
          />
        </div>
        <div className="ds-pdp__feature-text">
          <h2 className="ds-pdp__feature-title">12 Grams of Confidence</h2>
          <p className="ds-pdp__feature-desc">
            At just 12 grams, you'll forget it's there — until you need it.
            The minimal footprint preserves the feel of your device while adding
            a layer of protection that stands up to everyday drops, scratches,
            and pocket wear.
          </p>
        </div>
      </section>
    </>
  );
}
