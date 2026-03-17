import { ImageGallery } from '@ds/components';
import { Preview } from './Preview';
import { makePlaceholder } from '../lib/placeholder';

const portrait = { width: 800, height: 1000, fontSize: 32 };

const sampleImages = [
  { src: makePlaceholder('Front', '#E3DED6', '#675F56', portrait), alt: 'Product image 1' },
  { src: makePlaceholder('Back', '#C8C2B8', '#4E473F', portrait), alt: 'Product image 2' },
  { src: makePlaceholder('Side', '#A59E94', '#342F2A', portrait), alt: 'Product image 3' },
  { src: makePlaceholder('Detail', '#847D73', '#FAF9F7', portrait), alt: 'Product image 4' },
];

export function ImageGalleryDefault() {
  return (
    <Preview>
      <div className="ds-gallery-constrained">
        <ImageGallery images={sampleImages} />
      </div>
    </Preview>
  );
}

export function ImageGalleryAspectRatios() {
  return (
    <Preview stack>
      <div className="ds-gallery-constrained">
        <ImageGallery images={sampleImages} aspectRatio="1/1" />
      </div>
    </Preview>
  );
}

export function ImageGalleryThumbsLeft() {
  return (
    <Preview>
      <div className="ds-gallery-constrained--md">
        <ImageGallery images={sampleImages} thumbnailPosition="left" />
      </div>
    </Preview>
  );
}
