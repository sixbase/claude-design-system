import { forwardRef, useState, useCallback, useRef } from 'react';
import type { HTMLAttributes, KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import './ImageGallery.css';

export interface GalleryImage {
  src: string;
  alt: string;
  /** Optional thumbnail src (falls back to src) */
  thumbSrc?: string;
}

export interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of images to display */
  images: GalleryImage[];
  /** Aspect ratio for the main image */
  aspectRatio?: '1/1' | '4/5' | '3/4' | '4/3' | '16/9';
  /** Initial selected index */
  defaultIndex?: number;
  /** Thumbnail position on desktop */
  thumbnailPosition?: 'bottom' | 'left';
}

const SWIPE_THRESHOLD = 50;

export const ImageGallery = forwardRef<HTMLDivElement, ImageGalleryProps>(function ImageGallery(
  {
    images,
    aspectRatio = '4/5',
    defaultIndex = 0,
    thumbnailPosition = 'bottom',
    className,
    ...props
  },
  ref,
) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(images.length - 1, index));
      setActiveIndex(clamped);
    },
    [images.length],
  );

  const handleThumbKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isHorizontal = thumbnailPosition === 'bottom';
      const prev = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
      const next = isHorizontal ? 'ArrowRight' : 'ArrowDown';

      if (e.key === prev) {
        e.preventDefault();
        goTo(activeIndex - 1);
      } else if (e.key === next) {
        e.preventDefault();
        goTo(activeIndex + 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(images.length - 1);
      }
    },
    [activeIndex, goTo, images.length, thumbnailPosition],
  );

  const handlePointerDown = useCallback((e: ReactPointerEvent) => {
    pointerStartX.current = e.clientX;
  }, []);

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent) => {
      if (pointerStartX.current === null) return;
      const delta = e.clientX - pointerStartX.current;
      pointerStartX.current = null;
      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        goTo(delta < 0 ? activeIndex + 1 : activeIndex - 1);
      }
    },
    [activeIndex, goTo],
  );

  const activeImage = images[activeIndex];
  if (!activeImage) return null;

  return (
    <div
      ref={ref}
      className={[
        'ds-image-gallery',
        `ds-image-gallery--thumbs-${thumbnailPosition}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <div
        className="ds-image-gallery__main"
        style={{ '--gallery-ratio': aspectRatio } as React.CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <img
          key={activeIndex}
          src={activeImage.src}
          alt={activeImage.alt}
          className="ds-image-gallery__img"
          draggable={false}
        />
      </div>

      {images.length > 1 && (
        <div
          ref={thumbsRef}
          className="ds-image-gallery__thumbs ds-scroll-hidden"
          role="tablist"
          tabIndex={-1}
          aria-label="Product images"
          onKeyDown={handleThumbKeyDown}
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={img.alt}
              className={[
                'ds-image-gallery__thumb',
                i === activeIndex && 'ds-image-gallery__thumb--active',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => goTo(i)}
              tabIndex={i === activeIndex ? 0 : -1}
            >
              <img
                src={img.thumbSrc ?? img.src}
                alt=""
                className="ds-image-gallery__thumb-img"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
ImageGallery.displayName = 'ImageGallery';
