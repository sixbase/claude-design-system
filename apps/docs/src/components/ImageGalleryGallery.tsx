import { ImageGallery } from '@ds/components';
import { Preview } from './Preview';

function makePlaceholder(label: string, fill: string, textFill: string) {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="${fill}"/><text x="400" y="500" text-anchor="middle" fill="${textFill}" font-size="32" font-family="sans-serif">${label}</text></svg>`,
  )}`;
}

const sampleImages = [
  { src: makePlaceholder('Front', '#E3DED6', '#675F56'), alt: 'Product image 1' },
  { src: makePlaceholder('Back', '#C8C2B8', '#4E473F'), alt: 'Product image 2' },
  { src: makePlaceholder('Side', '#A59E94', '#342F2A'), alt: 'Product image 3' },
  { src: makePlaceholder('Detail', '#847D73', '#FAF9F7'), alt: 'Product image 4' },
];

export function ImageGalleryDefault() {
  return (
    <Preview>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <ImageGallery images={sampleImages} />
      </div>
    </Preview>
  );
}

export function ImageGalleryAspectRatios() {
  return (
    <Preview stack>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <ImageGallery images={sampleImages} aspectRatio="1/1" />
      </div>
    </Preview>
  );
}

export function ImageGalleryThumbsLeft() {
  return (
    <Preview>
      <div style={{ maxWidth: 500, width: '100%' }}>
        <ImageGallery images={sampleImages} thumbnailPosition="left" />
      </div>
    </Preview>
  );
}
