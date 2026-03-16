import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './Carousel.css';

export type CarouselSize = 'sm' | 'md' | 'lg';

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  /** Carousel content — typically CarouselSlide elements. */
  children: ReactNode;
  /** Gap between slides. */
  gap?: 'sm' | 'md' | 'lg';
}

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {
  /** Slide content. */
  children: ReactNode;
  /** Slide width preset across breakpoints. */
  size?: CarouselSize;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  function Carousel({ children, gap = 'md', className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={[
          'ds-carousel',
          `ds-carousel--gap-${gap}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <div className="ds-carousel__track ds-scroll-hidden">
          {children}
        </div>
      </div>
    );
  },
);
Carousel.displayName = 'Carousel';

export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(
  function CarouselSlide({ children, size = 'md', className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={[
          'ds-carousel__slide',
          `ds-carousel__slide--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CarouselSlide.displayName = 'CarouselSlide';
