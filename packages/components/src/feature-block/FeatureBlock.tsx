import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Heading, Text } from '../typography/Typography';
import './FeatureBlock.css';

export interface FeatureBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** Title text. */
  title: string;
  /** Description text. */
  description: string;
  /** Image element or node rendered alongside text. */
  image: ReactNode;
  /** Swap image and text positions on tablet+. */
  reverse?: boolean;
}

export const FeatureBlock = forwardRef<HTMLDivElement, FeatureBlockProps>(
  function FeatureBlock(
    { title, description, image, reverse = false, className, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={[
          'ds-feature-block',
          reverse && 'ds-feature-block--reverse',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <div className="ds-feature-block__image">{image}</div>
        <div className="ds-feature-block__text">
          <Heading as="h2" size="xl" weight="normal" className="ds-feature-block__title">{title}</Heading>
          <Text size="base" muted>{description}</Text>
        </div>
      </div>
    );
  },
);
FeatureBlock.displayName = 'FeatureBlock';
