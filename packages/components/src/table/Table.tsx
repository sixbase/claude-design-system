import { forwardRef } from 'react';
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { Text } from '../typography';
import './Table.css';

// ─── Table ──────────────────────────────────────────────────

export type TableVariant = 'default' | 'striped';
export type TableSize = 'sm' | 'md';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Row style variant */
  variant?: TableVariant;
  /** Cell padding density */
  size?: TableSize;
  /** Sticky header on vertical scroll */
  stickyHeader?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { variant = 'default', size = 'md', stickyHeader = false, className, children, ...props },
  ref,
) {
  const classes = [
    'ds-table-wrapper',
    className,
  ].filter(Boolean).join(' ');

  const tableClasses = [
    'ds-table',
    `ds-table--${variant}`,
    `ds-table--${size}`,
    stickyHeader && 'ds-table--sticky-header',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="region" aria-label={props['aria-label'] ?? 'Data table'}>
      <table ref={ref} className={tableClasses} {...props} aria-label={undefined}>
        {children}
      </table>
    </div>
  );
}) as TableComponent;

Table.displayName = 'Table';

// ─── Table.Header ───────────────────────────────────────────

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { className, ...props },
  ref,
) {
  const classes = ['ds-table__header', className].filter(Boolean).join(' ');
  return <thead ref={ref} className={classes} {...props} />;
});

TableHeader.displayName = 'Table.Header';

// ─── Table.Body ─────────────────────────────────────────────

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...props },
  ref,
) {
  const classes = ['ds-table__body', className].filter(Boolean).join(' ');
  return <tbody ref={ref} className={classes} {...props} />;
});

TableBody.displayName = 'Table.Body';

// ─── Table.Row ──────────────────────────────────────────────

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, ...props },
  ref,
) {
  const classes = ['ds-table__row', className].filter(Boolean).join(' ');
  return <tr ref={ref} className={classes} {...props} />;
});

TableRow.displayName = 'Table.Row';

// ─── Table.Head ─────────────────────────────────────────────

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Sort direction indicator (visual only — does not sort) */
  sorted?: 'asc' | 'desc' | false;
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { sorted, className, children, ...props },
  ref,
) {
  const classes = [
    'ds-table__head',
    sorted && 'ds-table__head--sorted',
    className,
  ].filter(Boolean).join(' ');

  return (
    <th
      ref={ref}
      className={classes}
      scope={props.scope ?? 'col'}
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
      {...props}
    >
      {children}
      {sorted && (
        <span className="ds-table__sort-icon" aria-hidden="true">
          {sorted === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>
  );
});

TableHead.displayName = 'Table.Head';

// ─── Table.Cell ─────────────────────────────────────────────

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, ...props },
  ref,
) {
  const classes = ['ds-table__cell', className].filter(Boolean).join(' ');
  return <td ref={ref} className={classes} {...props} />;
});

TableCell.displayName = 'Table.Cell';

// ─── Table.Empty ────────────────────────────────────────────

export interface TableEmptyProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Number of columns to span */
  colSpan: number;
  /** Message to display */
  message?: string;
}

const TableEmpty = forwardRef<HTMLTableRowElement, TableEmptyProps>(function TableEmpty(
  { colSpan, message = 'No data available', className, ...props },
  ref,
) {
  const classes = ['ds-table__row', 'ds-table__row--empty', className].filter(Boolean).join(' ');
  return (
    <tr ref={ref} className={classes} {...props}>
      <td className="ds-table__cell ds-table__cell--empty" colSpan={colSpan}>
        <Text as="span" size="sm" muted>
          {message}
        </Text>
      </td>
    </tr>
  );
});

TableEmpty.displayName = 'Table.Empty';

// ─── Compound export ────────────────────────────────────────

interface TableComponent
  extends React.ForwardRefExoticComponent<TableProps & React.RefAttributes<HTMLTableElement>> {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Cell: typeof TableCell;
  Empty: typeof TableEmpty;
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Empty = TableEmpty;
