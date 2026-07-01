import { Highlights, Highlight } from '@ds/components';
import { makePlaceholder } from '../lib/placeholder';

const ITEMS = [
  {
    title: 'Thoughtfully sourced materials',
    description:
      'Organic cotton, vegetable-tanned leather, and sustainably harvested wood — partnered direct from mills and tanneries.',
    image: makePlaceholder('Materials', '#E3DED6', '#847D73'),
  },
  {
    title: 'Designed to last',
    description:
      'Stress-tested and refined until they meet a standard of durability that makes fast fashion obsolete.',
    image: makePlaceholder('Durability', '#E3DED6', '#847D73'),
  },
  {
    title: 'Small-batch, zero waste',
    description:
      'Produced in small runs to minimize overstock; off-cuts repurposed and packaging fully recyclable.',
    image: makePlaceholder('Zero Waste', '#E3DED6', '#847D73'),
  },
];

export function HighlightsDefault() {
  return (
    <Highlights>
      {ITEMS.map((item) => (
        <Highlight
          key={item.title}
          title={item.title}
          description={item.description}
          image={<img src={item.image} alt="" className="ds-highlights__img" />}
        />
      ))}
    </Highlights>
  );
}
