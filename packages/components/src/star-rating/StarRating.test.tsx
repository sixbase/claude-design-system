import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { StarRating } from './StarRating';

describe('StarRating', () => {
  it('renders 5 stars', () => {
    const { container } = render(<StarRating rating={3} />);
    expect(container.querySelectorAll('.ds-star-rating__star')).toHaveLength(5);
  });

  it('renders correct filled stars for whole rating', () => {
    const { container } = render(<StarRating rating={3} />);
    expect(container.querySelectorAll('.ds-star-rating__star--full')).toHaveLength(3);
    expect(container.querySelectorAll('.ds-star-rating__star--empty')).toHaveLength(2);
  });

  it('renders half star for fractional rating', () => {
    const { container } = render(<StarRating rating={4.5} />);
    expect(container.querySelectorAll('.ds-star-rating__star--full')).toHaveLength(4);
    expect(container.querySelectorAll('.ds-star-rating__star--half')).toHaveLength(1);
    expect(container.querySelectorAll('.ds-star-rating__star--empty')).toHaveLength(0);
  });

  it('renders zero stars for rating 0', () => {
    const { container } = render(<StarRating rating={0} />);
    expect(container.querySelectorAll('.ds-star-rating__star--full')).toHaveLength(0);
    expect(container.querySelectorAll('.ds-star-rating__star--empty')).toHaveLength(5);
  });

  it('clamps rating to 0-5 range', () => {
    const { container } = render(<StarRating rating={7} />);
    expect(container.querySelectorAll('.ds-star-rating__star--full')).toHaveLength(5);
  });

  it('displays review count', () => {
    render(<StarRating rating={4} reviewCount={128} />);
    expect(screen.getByText('(128 reviews)')).toBeInTheDocument();
  });

  it('uses singular "review" for count of 1', () => {
    render(<StarRating rating={5} reviewCount={1} />);
    expect(screen.getByText('(1 review)')).toBeInTheDocument();
  });

  it('does not render count when reviewCount is not provided', () => {
    const { container } = render(<StarRating rating={4} />);
    expect(container.querySelector('.ds-star-rating__count')).not.toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '4.5 out of 5 stars');
  });

  it('applies size class', () => {
    const { container } = render(<StarRating rating={3} size="lg" />);
    expect(container.querySelector('.ds-star-rating--lg')).toBeInTheDocument();
  });

  it('defaults to md size', () => {
    const { container } = render(<StarRating rating={3} />);
    expect(container.querySelector('.ds-star-rating--md')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<StarRating rating={4.5} reviewCount={128} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
