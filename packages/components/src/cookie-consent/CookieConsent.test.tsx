import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { CookieConsent } from './CookieConsent';
import type { CookieCategory } from './CookieConsent';

expect.extend(toHaveNoViolations);

const defaultCategories: CookieCategory[] = [
  { id: 'essential', label: 'Strictly Necessary Cookies', description: 'These cookies are essential for the website to function and cannot be switched off.', required: true, learnMoreHref: '#essential' },
  { id: 'functional', label: 'Functional Cookies', description: 'These cookies enable enhanced functionality and personalization.', defaultChecked: true, learnMoreHref: '#functional' },
  { id: 'performance', label: 'Performance Cookies', description: 'These cookies help us understand how visitors interact with the website.', defaultChecked: true, learnMoreHref: '#performance' },
  { id: 'targeting', label: 'Targeting Cookies', description: 'These cookies are used to deliver personalized advertisements.', learnMoreHref: '#targeting' },
];

describe('CookieConsent', () => {
  // ─── Rendering ──────────────────────────────────────────

  it('renders banner with heading and description', () => {
    render(<CookieConsent />);
    expect(screen.getByText('We use cookies')).toBeInTheDocument();
    expect(screen.getByText(/cookies to improve your experience/)).toBeInTheDocument();
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

  // ─── Main dialog buttons ──────────────────────────────

  it('calls onAccept with all category IDs when Accept All is clicked', async () => {
    const onAccept = vi.fn();
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} onAccept={onAccept} />);

    await user.click(screen.getByText('Accept All'));
    expect(onAccept).toHaveBeenCalledWith(['essential', 'functional', 'performance', 'targeting']);
  });

  it('calls onReject when Decline All is clicked (no categories)', async () => {
    const onReject = vi.fn();
    const user = userEvent.setup();
    render(<CookieConsent onReject={onReject} />);

    await user.click(screen.getByText('Decline All'));
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it('shows Manage Preferences, Decline All, and Accept All when categories are provided', () => {
    render(<CookieConsent categories={defaultCategories} />);
    expect(screen.getByText('Manage Preferences')).toBeInTheDocument();
    expect(screen.getByText('Decline All')).toBeInTheDocument();
    expect(screen.getByText('Accept All')).toBeInTheDocument();
  });

  it('shows Decline All and Accept All when no categories are provided', () => {
    render(<CookieConsent />);
    expect(screen.getByText('Decline All')).toBeInTheDocument();
    expect(screen.getByText('Accept All')).toBeInTheDocument();
    expect(screen.queryByText('Manage Preferences')).not.toBeInTheDocument();
  });

  // ─── Preferences panel (accordion-based) ─────────────────

  it('shows accordion sections when Manage Preferences is clicked', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    expect(screen.queryByText('Strictly Necessary Cookies')).not.toBeInTheDocument();

    await user.click(screen.getByText('Manage Preferences'));
    expect(screen.getByText('Strictly Necessary Cookies')).toBeInTheDocument();
    expect(screen.getByText('Functional Cookies')).toBeInTheDocument();
    expect(screen.getByText('Performance Cookies')).toBeInTheDocument();
    expect(screen.getByText('Targeting Cookies')).toBeInTheDocument();
  });

  it('shows Back and Save Preferences buttons in preferences view', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    await user.click(screen.getByText('Manage Preferences'));
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Save Preferences')).toBeInTheDocument();
    // Main dialog buttons should not be visible in preferences view
    expect(screen.queryByText('Accept All')).not.toBeInTheDocument();
    expect(screen.queryByText('Decline All')).not.toBeInTheDocument();
  });

  it('essential category checkbox is disabled', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    await user.click(screen.getByText('Manage Preferences'));
    const essentialCheckbox = screen.getByRole('checkbox', { name: 'Strictly Necessary Cookies' });
    expect(essentialCheckbox).toBeDisabled();
  });

  it('non-essential categories can be toggled', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    await user.click(screen.getByText('Manage Preferences'));
    const functionalCheckbox = screen.getByRole('checkbox', { name: 'Functional Cookies' });
    expect(functionalCheckbox).not.toBeDisabled();
    await user.click(functionalCheckbox);
    // Was default on, now toggled off
    expect(functionalCheckbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('Save Preferences calls onAccept with only selected category IDs', async () => {
    const onAccept = vi.fn();
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} onAccept={onAccept} />);

    await user.click(screen.getByText('Manage Preferences'));
    // Toggle functional off (default on)
    await user.click(screen.getByRole('checkbox', { name: 'Functional Cookies' }));
    await user.click(screen.getByText('Save Preferences'));

    // Essential (required) + performance (default on, untouched)
    const accepted = onAccept.mock.calls[0][0] as string[];
    expect(accepted).toContain('essential');
    expect(accepted).toContain('performance');
    expect(accepted).not.toContain('functional');
    expect(accepted).not.toContain('targeting');
  });

  it('Back button returns to main dialog without saving', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    await user.click(screen.getByText('Manage Preferences'));
    expect(screen.getByText('Save Preferences')).toBeInTheDocument();

    await user.click(screen.getByText('Back'));
    // Should be back to main dialog
    expect(screen.getByText('Accept All')).toBeInTheDocument();
    expect(screen.getByText('Manage Preferences')).toBeInTheDocument();
    expect(screen.queryByText('Save Preferences')).not.toBeInTheDocument();
  });

  // ─── Per-category learn more links ─────────────────────

  it('renders learn more links for categories with learnMoreHref', async () => {
    const user = userEvent.setup();
    render(<CookieConsent categories={defaultCategories} />);

    await user.click(screen.getByText('Manage Preferences'));
    // Expand a category to see its content
    await user.click(screen.getByText('Functional Cookies'));

    const links = screen.getAllByText('Learn more');
    expect(links.length).toBeGreaterThanOrEqual(1);
    const functionalLink = links.find((el) => el.closest('a')?.getAttribute('href') === '#functional');
    expect(functionalLink).toBeInTheDocument();
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
    const heading = screen.getByText('We use cookies');
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
    await user.click(screen.getByText('Manage Preferences'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
