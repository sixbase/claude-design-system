import { useState } from 'react';
import { Breadcrumb, ImageGallery, QuantitySelector, Button } from '@ds/components';
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
            <Button style={{ width: '100%' }} size="lg" variant="secondary">Save to Wishlist</Button>
          </div>
        </div>
      </div>
    </>
  );
}
