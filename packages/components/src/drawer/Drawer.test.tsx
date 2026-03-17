import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from './Drawer';

expect.extend(toHaveNoViolations);

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  title: 'Test drawer',
};

describe('Drawer', () => {
  // ── Rendering ──────────────────────────────────────────

  it('renders as a dialog when open', () => {
    render(<Drawer {...defaultProps}>Content</Drawer>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Drawer {...defaultProps} open={false}>
        Content
      </Drawer>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has accessible title via aria-label', () => {
    render(<Drawer {...defaultProps}>Content</Drawer>);
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-label',
      'Test drawer',
    );
  });

  // ── Side variants ──────────────────────────────────────

  it('defaults to right side', () => {
    render(<Drawer {...defaultProps}>Content</Drawer>);
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain('ds-drawer__panel--right');
  });

  it('applies left side class', () => {
    render(
      <Drawer {...defaultProps} side="left">
        Content
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain('ds-drawer__panel--left');
  });

  // ── Custom width ───────────────────────────────────────

  it('applies custom width via CSS variable', () => {
    render(
      <Drawer {...defaultProps} width="400px">
        Content
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.style.getPropertyValue('--drawer-width')).toBe('400px');
  });

  it('does not set --drawer-width when width is not provided', () => {
    render(<Drawer {...defaultProps}>Content</Drawer>);
    const panel = screen.getByRole('dialog');
    expect(panel.style.getPropertyValue('--drawer-width')).toBe('');
  });

  // ── Close behavior ─────────────────────────────────────

  it('calls onOpenChange(false) when close button is clicked', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer {...defaultProps} onOpenChange={onOpenChange}>
        Content
      </Drawer>,
    );

    await user.click(screen.getByLabelText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(false) on Escape key', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Drawer {...defaultProps} onOpenChange={onOpenChange}>
        Content
      </Drawer>,
    );

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // ── Custom className ───────────────────────────────────

  it('forwards custom className', () => {
    render(
      <Drawer {...defaultProps} className="custom-drawer">
        Content
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain('custom-drawer');
  });

  // ── Accessibility ──────────────────────────────────────

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Drawer {...defaultProps}>Content</Drawer>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
