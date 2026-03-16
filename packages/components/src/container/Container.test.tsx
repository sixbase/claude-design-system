import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Hello</Container>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies base class', () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).toHaveClass('ds-container');
  });

  it('does not apply size modifier for default xl', () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).not.toHaveClass('ds-container--xl');
  });

  it('applies size modifier for non-default sizes', () => {
    const { container } = render(<Container size="md">Content</Container>);
    expect(container.firstChild).toHaveClass('ds-container--md');
  });

  it('applies fluid modifier', () => {
    const { container } = render(<Container fluid>Content</Container>);
    expect(container.firstChild).toHaveClass('ds-container--fluid');
  });

  it('applies no-padding modifier', () => {
    const { container } = render(<Container noPadding>Content</Container>);
    expect(container.firstChild).toHaveClass('ds-container--no-padding');
  });

  it('merges custom className', () => {
    const { container } = render(<Container className="custom">Content</Container>);
    expect(container.firstChild).toHaveClass('ds-container', 'custom');
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Container ref={ref}>Content</Container>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through html attributes', () => {
    render(<Container data-testid="ctr">Content</Container>);
    expect(screen.getByTestId('ctr')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Container>
        <p>Page content</p>
      </Container>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
