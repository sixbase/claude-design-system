import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  describe('rendering', () => {
    it('renders a nav element with pagination role', () => {
      render(<Pagination currentPage={1} totalPages={5} />);
      expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    });

    it('renders nothing when totalPages is 1', () => {
      const { container } = render(<Pagination currentPage={1} totalPages={1} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when totalPages is 0', () => {
      const { container } = render(<Pagination currentPage={1} totalPages={0} />);
      expect(container.firstChild).toBeNull();
    });

    it('applies size class', () => {
      render(<Pagination currentPage={1} totalPages={5} size="sm" />);
      expect(screen.getByRole('navigation')).toHaveClass('ds-pagination--sm');
    });

    it('defaults to md size', () => {
      render(<Pagination currentPage={1} totalPages={5} />);
      expect(screen.getByRole('navigation')).toHaveClass('ds-pagination--md');
    });

    it('merges custom className', () => {
      render(<Pagination currentPage={1} totalPages={5} className="custom" />);
      expect(screen.getByRole('navigation')).toHaveClass('custom');
    });
  });

  describe('page numbers', () => {
    it('shows all pages when totalPages <= 7', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
      const nav = screen.getByRole('navigation');
      for (let i = 1; i <= 5; i++) {
        if (i === 3) {
          expect(within(nav).getByLabelText('Page 3')).toBeInTheDocument();
        } else {
          expect(within(nav).getByLabelText(`Go to page ${i}`)).toBeInTheDocument();
        }
      }
    });

    it('shows ellipsis for large page counts', () => {
      render(<Pagination currentPage={10} totalPages={20} onPageChange={() => {}} />);
      const nav = screen.getByRole('navigation');
      // Desktop view should contain ellipsis characters
      const desktop = nav.querySelector('.ds-pagination__desktop');
      expect(desktop?.textContent).toContain('…');
    });

    it('always shows first and last page', () => {
      render(<Pagination currentPage={10} totalPages={20} onPageChange={() => {}} />);
      const nav = screen.getByRole('navigation');
      expect(within(nav).getByLabelText('Go to page 1')).toBeInTheDocument();
      expect(within(nav).getByLabelText('Go to page 20')).toBeInTheDocument();
    });

    it('marks current page with aria-current', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />);
      const currentEl = screen.getByLabelText('Page 5');
      expect(currentEl).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('disabled states', () => {
    it('disables Previous on first page', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
      const prevButton = screen.getAllByLabelText('Go to previous page')[0];
      expect(prevButton).toBeDisabled();
    });

    it('disables Next on last page', () => {
      render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
      const nextButton = screen.getAllByLabelText('Go to next page')[0];
      expect(nextButton).toBeDisabled();
    });

    it('enables both buttons on middle page', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
      const prevButtons = screen.getAllByLabelText('Go to previous page');
      const nextButtons = screen.getAllByLabelText('Go to next page');
      expect(prevButtons[0]).not.toBeDisabled();
      expect(nextButtons[0]).not.toBeDisabled();
    });
  });

  describe('SPA mode (onPageChange)', () => {
    it('calls onPageChange when a page button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

      await user.click(screen.getByLabelText('Go to page 4'));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('calls onPageChange with previous page when Previous is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

      const prevButtons = screen.getAllByLabelText('Go to previous page');
      await user.click(prevButtons[0]);
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange with next page when Next is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

      const nextButtons = screen.getAllByLabelText('Go to next page');
      await user.click(nextButtons[0]);
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('does not call onPageChange when Previous is disabled', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

      const prevButton = screen.getAllByLabelText('Go to previous page')[0];
      await user.click(prevButton);
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('renders buttons, not links', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
      const nav = screen.getByRole('navigation');
      expect(nav.querySelector('a')).toBeNull();
    });
  });

  describe('SSR mode (baseUrl)', () => {
    it('renders anchor tags', () => {
      render(<Pagination currentPage={3} totalPages={5} baseUrl="/products" />);
      const nav = screen.getByRole('navigation');
      const links = nav.querySelectorAll('a[href]');
      expect(links.length).toBeGreaterThan(0);
    });

    it('generates correct URLs', () => {
      render(<Pagination currentPage={3} totalPages={5} baseUrl="/products" />);
      const link = screen.getByLabelText('Go to page 4');
      expect(link.closest('a')?.getAttribute('href') ?? link.getAttribute('href')).toContain('page=4');
    });

    it('page 1 URL is the baseUrl without query param', () => {
      render(<Pagination currentPage={3} totalPages={5} baseUrl="/products" />);
      const link = screen.getByLabelText('Go to page 1');
      const href = link.closest('a')?.getAttribute('href') ?? link.getAttribute('href');
      expect(href).toBe('/products');
    });

    it('appends to existing query params with &', () => {
      render(
        <Pagination currentPage={1} totalPages={5} baseUrl="/products?sort=price" />,
      );
      const link = screen.getByLabelText('Go to page 2');
      const href = link.closest('a')?.getAttribute('href') ?? link.getAttribute('href');
      expect(href).toBe('/products?sort=price&page=2');
    });
  });

  describe('truncation edge cases', () => {
    it('shows all pages for 2 pages (no ellipsis)', () => {
      render(<Pagination currentPage={1} totalPages={2} onPageChange={() => {}} />);
      const nav = screen.getByRole('navigation');
      expect(nav.textContent).not.toContain('…');
    });

    it('handles 100+ pages without breaking', () => {
      render(<Pagination currentPage={50} totalPages={100} onPageChange={() => {}} />);
      const nav = screen.getByRole('navigation');
      expect(within(nav).getByLabelText('Go to page 1')).toBeInTheDocument();
      expect(within(nav).getByLabelText('Go to page 100')).toBeInTheDocument();
      expect(within(nav).getByLabelText('Page 50')).toBeInTheDocument();
    });

    it('shows correct pattern at beginning: 1 [2] 3 … 20', () => {
      render(<Pagination currentPage={2} totalPages={20} onPageChange={() => {}} />);
      const desktop = screen.getByRole('navigation').querySelector('.ds-pagination__desktop');
      expect(desktop?.textContent).toContain('…');
      expect(within(screen.getByRole('navigation')).getByLabelText('Page 2')).toBeInTheDocument();
    });

    it('shows correct pattern at end: 1 … 18 [19] 20', () => {
      render(<Pagination currentPage={19} totalPages={20} onPageChange={() => {}} />);
      const desktop = screen.getByRole('navigation').querySelector('.ds-pagination__desktop');
      expect(desktop?.textContent).toContain('…');
      expect(within(screen.getByRole('navigation')).getByLabelText('Page 19')).toBeInTheDocument();
    });
  });

  describe('mobile layout', () => {
    it('renders page info text', () => {
      render(<Pagination currentPage={5} totalPages={20} onPageChange={() => {}} />);
      const mobile = screen.getByRole('navigation').querySelector('.ds-pagination__mobile');
      expect(mobile?.textContent).toContain('Page 5 of 20');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Pagination currentPage={5} totalPages={20} onPageChange={() => {}} />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations in SSR mode', async () => {
      const { container } = render(
        <Pagination currentPage={3} totalPages={10} baseUrl="/products" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('nav has aria-label', () => {
      render(<Pagination currentPage={1} totalPages={5} />);
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination');
    });

    it('previous and next buttons have aria-labels', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
      expect(screen.getAllByLabelText('Go to previous page').length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText('Go to next page').length).toBeGreaterThan(0);
    });
  });
});
