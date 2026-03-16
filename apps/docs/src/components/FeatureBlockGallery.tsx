import { FeatureBlock } from '@ds/components';
import { makePlaceholder } from '../lib/placeholder';

export function FeatureBlockDefault() {
  return (
    <FeatureBlock
      title="Engineered for Everyday Protection"
      description="Woven from 600D aramid fiber — the same material used in aerospace and body armor — this case delivers military-grade impact resistance at just 0.65mm thin."
      image={<img src={makePlaceholder('Feature', '#C8C1B6', '#4E473D')} alt="Feature image" style={{ aspectRatio: '5/4', objectFit: 'cover' }} />}
    />
  );
}

export function FeatureBlockReverse() {
  return (
    <FeatureBlock
      reverse
      title="Seamless MagSafe Integration"
      description="Precision-aligned magnets ensure a perfect snap every time. Charge wirelessly, attach your favorite accessories, and never worry about compatibility."
      image={<img src={makePlaceholder('Reversed', '#B3AC9F', '#413A31')} alt="Reversed feature image" style={{ aspectRatio: '5/4', objectFit: 'cover' }} />}
    />
  );
}
