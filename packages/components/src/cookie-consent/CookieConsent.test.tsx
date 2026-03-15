import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { CookieConsent } from './CookieConsent';
import type { CookieCategory } from './CookieConsent';

expect.extend(toHaveNoViolations);

const defaultCategories: CookieCategory[] = [
  { id: 'essential', label: 'Strictly Necessary Cookies', description: 'These cookies are essential for the website to function and cannot be switched off.', required: true },
  { id: 'functional', label: 'Functional Cookies', description: 'These cookies enable enhanced functionality and personalization.' },
  { id: 'performance', label: 'Performance Cookies', description: 'These cookies help us understand how visitors interact with the website.' },
  { id: 'targeting', label: 'Targeting Cookies', description: 'These cookies are used to deliver personalized advertisements.' },
];

describe('CookieConsent', () => {
  // ─── Rendering ──────────────────────────────────────────

  it('renders banner with heading and description', () => {
    render(<CookieConsent />);
    expect(screen.getByText('We value your privacy')).toBeInTheDocument();
    expect(screen.getByText(/We use cookies/)).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<CookieConsent open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders with defaultOpen true (uncontrolled)', () => {
    render(<CookieConsent defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders custom heading and description', () => {
    render(
      <CookieConsent heading="Custom Title" description="Custom message" />,
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  // ─── Button interactions ────────────────────────────────

  it('calls onAccept with all category IDs when Accept All is clicked', async () => {
    const onAccept = vi.fn();
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} onAccept={onAccept} />);

    await user.click(screen.getByText('Accept All'));
    expect(onAccept).toHaveBeenCalledWith(['essential', 'functional', 'performance', 'targeting']);
  });

  it('calls onReject when Reject All is clicked (no categories)', async () => {
    const onReject = vi.fn();
    const user = userEvent.setup();
    render(<CookieConsent onReject={onReject} />);

    await user.click(screen.getByText('Reject All'));
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it('shows Preferences button when categories are provided', () => {
    render(<CookieConsent categories={defaultCategories} />);
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  it('shows Reject All button when no categories are provided', () => {
    render(<CookieConsent />);
    expect(screen.getByText('Reject All')).toBeInTheDocument();
    expect(screen.queryByText('Preferences')).not.toBeInTheDocument();
  });

  // ─── Preferences panel (accordion-based) ─────────────────

  it('shows accordion sections when Preferences is clicked', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    expect(screen.queryByText('Strictly Necessary Cookies')).not.toBeInTheDocument();

    await user.click(screen.getByText('Preferences'));
    expect(screen.getByText('Strictly Necessary Cookies')).toBeInTheDocument();
    expect(screen.getByText('Functional Cookies')).toBeInTheDocument();
    expect(screen.getByText('Performance Cookies')).toBeInTheDocument();
    expect(screen.getByText('Targeting Cookies')).toBeInTheDocument();
  });

  it('shows all 4 action buttons in preferences view', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    await user.click(screen.getByText('Preferences'));
    expect(screen.getByText('Accept All')).toBeInTheDocument();
    expect(screen.getByText('Reject All')).toBeInTheDocument();
    expect(screen.getByText('Save Preferences')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('essential category checkbox is disabled', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    await user.click(screen.getByText('Preferences'));
    const essentialCheckbox = screen.getByRole('checkbox', { name: 'Strictly Necessary Cookies' });
    expect(essentialCheckbox).toBeDisabled();
  });

  it('non-essential categories can be toggled', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    await user.click(screen.getByText('Preferences'));
    const functionalCheckbox = screen.getByRole('checkbox', { name: 'Functional Cookies' });
    expect(functionalCheckbox).not.toBeDisabled();
    await user.click(functionalCheckbox);
    expect(functionalCheckbox).toHaveAttribute('data-state', 'checked');
  });

  it('Save Preferences calls onAccept with only selected category IDs', async () => {
    const onAccept = vi.fn();
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} onAccept={onAccept} />);

    await user.click(screen.getByText('Preferences'));
    // Toggle functional on
    await user.click(screen.getByRole('checkbox', { name: 'Functional Cookies' }));
    await user.click(screen.getByText('Save Preferences'));

    // Essential is always included (required), functional was toggled on
    expect(onAccept).toHaveBeenCalledWith(
      expect.arrayContaining(['essential', 'functional']),
    );
    const accepted = onAccept.mock.calls[0][0] as string[];
    expect(accepted).not.toContain('performance');
    expect(accepted).not.toContain('targeting');
  });

  it('Accept All in preferences view calls onAccept with all IDs', async () => {
    const onAccept = vi.fn();
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} onAccept={onAccept} />);

    await user.click(screen.getByText('Preferences'));
    await user.click(screen.getByText('Accept All'));
    expect(onAccept).toHaveBeenCalledWith(['essential', 'functional', 'performance', 'targeting']);
  });

  it('Reject All in preferences view calls onReject', async () => {
    const onReject = vi.fn();
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} onReject={onReject} />);

    await user.click(screen.getByText('Preferences'));
    await user.click(screen.getByText('Reject All'));
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it('Close button starts closing animation', async () => {
    const user = userEvent.setup();
    const { container } = render(<CookieConsent categories={defaultCategories} />);

    await user.click(screen.getByText('Preferences'));
    await user.click(screen.getByText('Close'));
    const banner = container.querySelector('.ds-cookie-consent');
    expect(banner?.className).toContain('ds-cookie-consent--closing');
  });

  // ─── Keyboard ───────────────────────────────────────────

  it('starts closing animation when Escape is pressed', async () => {
    const user = userEvent.setup();
    const { container } = render(<CookieConsent open />);

    await user.keyboard('{Escape}');
    const banner = container.querySelector('.ds-cookie-consent');
    expect(banner?.className).toContain('ds-cookie-consent--closing');
  });

  // ─── ARIA / Accessibility ──────────────────────────────

  it('has role="dialog"', () => {
    render(<CookieConsent />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-labelledby pointing to the heading', () => {
    render(<CookieConsent />);
    const dialog = screen.getByRole('dialog');
    const heading = screen.getByText('We value your privacy');
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('has aria-modal set to false (non-blocking)', () => {
    render(<CookieConsent />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'false');
  });

  // ─── Class names ────────────────────────────────────────

  it('applies ds-cookie-consent root class', () => {
    render(<CookieConsent />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('ds-cookie-consent');
  });

  it('forwards custom className', () => {
    render(<CookieConsent className="custom-banner" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('custom-banner');
  });

  // ─── Accessibility audit ────────────────────────────────

  it('has no accessibility violations', async () => {
    const { container } = render(<CookieConsent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with preferences expanded', async () => {
    const user = userEvent.setup();
    const { container } = render(<CookieConsent categories={defaultCategories} />);
    await user.click(screen.getByText('Preferences'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
