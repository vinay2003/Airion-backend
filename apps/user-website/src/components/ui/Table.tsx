import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, className = '', containerClassName = '', ...props }, ref) => (
    <div className={`w-full overflow-x-auto rounded-2xl border border-[var(--ease2event-border-subtle)] bg-[var(--ease2event-bg-surface)] shadow-sm ${containerClassName}`}>
      <table
        ref={ref}
        className={`w-full text-left border-collapse ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  )
);

export const THead = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`bg-[var(--ease2event-bg-elevated)] border-b border-[var(--ease2event-border-subtle)] ${className}`} {...props}>
    {children}
  </thead>
);

export const TBody = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`divide-y divide-[var(--ease2event-border-subtle)] ${className}`} {...props}>
    {children}
  </tbody>
);

export const TR = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`hover:bg-[var(--ease2event-bg-elevated)]/50 transition-colors group ${className}`} {...props}>
    {children}
  </tr>
);

export const TH = ({ children, className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={`px-6 py-4 text-[10px] font-black text-[var(--ease2event-text-muted)] uppercase tracking-widest leading-none ${className}`} {...props}>
    {children}
  </th>
);

export const TD = ({ children, className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-6 py-4 text-sm text-[var(--ease2event-text-secondary)] group-hover:text-[var(--ease2event-text-primary)] transition-colors ${className}`} {...props}>
    {children}
  </td>
);

Table.displayName = 'Ease2eventTable';
THead.displayName = 'Ease2eventTHead';
TBody.displayName = 'Ease2eventTBody';
TR.displayName = 'Ease2eventTR';
TH.displayName = 'Ease2eventTH';
TD.displayName = 'Ease2eventTD';
