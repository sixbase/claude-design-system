import { forwardRef, useId } from 'react';
import type { HTMLAttributes } from 'react';
import './StarRating.css';

export type StarRatingSize = 'sm' | 'md' | 'lg';

export interface StarRatingProps extends HTMLAttributes<HTMLDivElement> {
  /** Rating value from 0 to 5. Supports half values (e.g. 4.5). */
  rating: number;
  /** Total number of reviews. */
  reviewCount?: number;
  /** Size variant. */
  size?: StarRatingSize;
}

const STAR_COUNT = 5;

function StarIcon({ fill, clipId }: { fill: 'full' | 'half' | 'empty'; clipId: string }) {
  return (
    <svg
      className={`ds-star-rating__star ds-star-rating__star--${fill}`}
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      {fill === 'half' ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width="10" height="20" />
            </clipPath>
          </defs>
          <path
            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z"
            className="ds-star-rating__star-bg"
          />
          <path
            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z"
            clipPath={`url(#${clipId})`}
            className="ds-star-rating__star-fill"
          />
        </>
      ) : (
        <path
          d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7 6 11.21l-4-3.9 5.53-.8L10 1.5z"
          className={
            fill === 'full'
              ? 'ds-star-rating__star-fill'
              : 'ds-star-rating__star-bg'
          }
        />
      )}
    </svg>
  );
}

export const StarRating = forwardRef<HTMLDivElement, StarRatingProps>(
  function StarRating(
    { rating, reviewCount, size = 'md', className, ...props },
    ref,
  ) {
    const clipId = useId();
    const clamped = Math.max(0, Math.min(STAR_COUNT, rating));

    const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
      if (clamped >= i + 1) return 'full' as const;
      if (clamped >= i + 0.5) return 'half' as const;
      return 'empty' as const;
    });

    return (
      <div
        ref={ref}
        className={[
          'ds-star-rating',
          `ds-star-rating--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={`${clamped} out of ${STAR_COUNT} stars`}
        role="img"
        {...props}
      >
        <span className="ds-star-rating__stars">
          {stars.map((fill, i) => (
            <StarIcon key={i} fill={fill} clipId={`${clipId}-half`} />
          ))}
        </span>
        {reviewCount != null && (
          <span className="ds-star-rating__count">
            ({reviewCount.toLocaleString()}{' '}
            {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        )}
      </div>
    );
  },
);
StarRating.displayName = 'StarRating';
