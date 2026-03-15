import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Card, CardBody, CardFooter, CardImage } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders as a div', () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId('card').tagName).toBe('DIV');
  });

  it('applies elevated variant by default', () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('ds-card--elevated');
  });

  it('applies outlined variant', () => {
    render(<Card variant="outlined" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('ds-card--outlined');
  });

  it('applies interactive class', () => {
    render(<Card interactive data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('ds-card--interactive');
  });

  it('renders CardBody', () => {
    render(<Card><CardBody>Body content</CardBody></Card>);
    expect(screen.getByText('Body content')).toHaveClass('ds-card-body');
  });

  it('renders CardFooter', () => {
    render(<Card><CardFooter>Footer content</CardFooter></Card>);
    expect(screen.getByText('Footer content')).toHaveClass('ds-card-footer');
  });

  it('renders CardImage with alt text', () => {
    render(<CardImage src="/image.jpg" alt="Product photo" />);
    expect(screen.getByAltText('Product photo')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <CardBody>Card content</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
