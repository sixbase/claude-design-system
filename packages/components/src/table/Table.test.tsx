import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Table } from './Table';

/** Helper: renders a basic table with header + body */
function renderTable(props: Record<string, unknown> = {}) {
  return render(
    <Table {...props}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Value</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Width</Table.Cell>
          <Table.Cell>100cm</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Height</Table.Cell>
          <Table.Cell>50cm</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>,
  );
}

describe('Table', () => {
  /* ─── Rendering ──────────────────────────────────────────── */

  it('renders a table element', () => {
    renderTable();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders header cells as th with scope="col"', () => {
    renderTable();
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveAttribute('scope', 'col');
  });

  it('renders body cells as td', () => {
    renderTable();
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(4);
  });

  it('renders rows', () => {
    renderTable();
    // 1 header row + 2 body rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
  });

  /* ─── Variant classes ────────────────────────────────────── */

  it('applies default variant class', () => {
    renderTable();
    expect(screen.getByRole('table')).toHaveClass('ds-table--default');
  });

  it('applies striped variant class', () => {
    renderTable({ variant: 'striped' });
    expect(screen.getByRole('table')).toHaveClass('ds-table--striped');
  });

  /* ─── Size classes ───────────────────────────────────────── */

  it('applies default md size class', () => {
    renderTable();
    expect(screen.getByRole('table')).toHaveClass('ds-table--md');
  });

  it('applies sm size class', () => {
    renderTable({ size: 'sm' });
    expect(screen.getByRole('table')).toHaveClass('ds-table--sm');
  });

  /* ─── Sticky header ─────────────────────────────────────── */

  it('applies sticky header class', () => {
    renderTable({ stickyHeader: true });
    expect(screen.getByRole('table')).toHaveClass('ds-table--sticky-header');
  });

  it('does not apply sticky header class by default', () => {
    renderTable();
    expect(screen.getByRole('table')).not.toHaveClass('ds-table--sticky-header');
  });

  /* ─── Scroll wrapper ────────────────────────────────────── */

  it('wraps table in a scrollable region', () => {
    renderTable();
    const region = screen.getByRole('region');
    expect(region).toBeInTheDocument();
    expect(region).toHaveClass('ds-table-wrapper');
  });

  it('scroll region is keyboard focusable', () => {
    renderTable();
    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('tabindex', '0');
  });

  /* ─── Sort indicator ────────────────────────────────────── */

  it('renders ascending sort indicator', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head sorted="asc">Price</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>$10</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const header = screen.getByRole('columnheader');
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(header).toHaveClass('ds-table__head--sorted');
  });

  it('renders descending sort indicator', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head sorted="desc">Price</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>$10</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const header = screen.getByRole('columnheader');
    expect(header).toHaveAttribute('aria-sort', 'descending');
  });

  /* ─── Empty state ───────────────────────────────────────── */

  it('renders empty state message', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Value</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Empty colSpan={2} />
        </Table.Body>
      </Table>,
    );
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders custom empty message', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Empty colSpan={1} message="No products found" />
        </Table.Body>
      </Table>,
    );
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  /* ─── HTML attributes ───────────────────────────────────── */

  it('passes through custom className', () => {
    renderTable({ className: 'custom-class' });
    expect(screen.getByRole('region')).toHaveClass('custom-class');
  });

  /* ─── Accessibility ─────────────────────────────────────── */

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Table aria-label="Product specifications">
        <Table.Header>
          <Table.Row>
            <Table.Head>Property</Table.Head>
            <Table.Head>Value</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Width</Table.Cell>
            <Table.Cell>100cm</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations with striped variant', async () => {
    const { container } = render(
      <Table variant="striped" aria-label="Size chart">
        <Table.Header>
          <Table.Row>
            <Table.Head>Size</Table.Head>
            <Table.Head>Chest</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>S</Table.Cell>
            <Table.Cell>86cm</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>M</Table.Cell>
            <Table.Cell>92cm</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
