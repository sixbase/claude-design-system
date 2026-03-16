import { Carousel, CarouselSlide } from '@ds/components';
import { Preview } from './Preview';
import { makePlaceholder } from '../lib/placeholder';

export function CarouselDefault() {
  return (
    <Carousel>
      <CarouselSlide>
        <img src={makePlaceholder('Slide 1', '#D6D0C7', '#6B6359')} alt="Slide 1" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-lg)' }} />
      </CarouselSlide>
      <CarouselSlide>
        <img src={makePlaceholder('Slide 2', '#C8C1B6', '#5A5248')} alt="Slide 2" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-lg)' }} />
      </CarouselSlide>
      <CarouselSlide>
        <img src={makePlaceholder('Slide 3', '#BEB7AC', '#4E473D')} alt="Slide 3" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-lg)' }} />
      </CarouselSlide>
    </Carousel>
  );
}

export function CarouselSizes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Small</p>
        <Carousel>
          <CarouselSlide size="sm">
            <img src={makePlaceholder('Sm 1', '#D6D0C7', '#6B6359')} alt="Small slide 1" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-lg)' }} />
          </CarouselSlide>
          <CarouselSlide size="sm">
            <img src={makePlaceholder('Sm 2', '#C8C1B6', '#5A5248')} alt="Small slide 2" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-lg)' }} />
          </CarouselSlide>
          <CarouselSlide size="sm">
            <img src={makePlaceholder('Sm 3', '#BEB7AC', '#4E473D')} alt="Small slide 3" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-lg)' }} />
          </CarouselSlide>
        </Carousel>
      </div>
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Large</p>
        <Carousel>
          <CarouselSlide size="lg">
            <img src={makePlaceholder('Lg 1', '#D6D0C7', '#6B6359')} alt="Large slide 1" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-lg)' }} />
          </CarouselSlide>
          <CarouselSlide size="lg">
            <img src={makePlaceholder('Lg 2', '#C8C1B6', '#5A5248')} alt="Large slide 2" style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-lg)' }} />
          </CarouselSlide>
        </Carousel>
      </div>
    </div>
  );
}
