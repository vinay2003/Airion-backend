import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, className = '', containerClassName = '', ...props }, ref) => (
    <div className={`w-full overflow-x-auto rounded-2xl border border-[var(--airion-border-subtle)] bg-[var(--airion-bg-surface)] shadow-sm ${containerClassName}`}>
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
  <thead className={`bg-[var(--airion-bg-elevated)] border-b border-[var(--airion-border-subtle)] ${className}`} {...props}>
    {children}
  </thead>
);

export const TBody = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`divide-y divide-[var(--airion-border-subtle)] ${className}`} {...props}>
    {children}
  </tbody>
);

export const TR = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`hover:bg-[var(--airion-bg-elevated)]/50 transition-colors group ${className}`} {...props}>
    {children}
  </tr>
);

export const TH = ({ children, className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={`px-6 py-4 text-[10px] font-black text-[var(--airion-text-muted)] uppercase tracking-widest leading-none ${className}`} {...props}>
    {children}
  </th>
);

export const TD = ({ children, className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-6 py-4 text-sm text-[var(--airion-text-secondary)] group-hover:text-[var(--airion-text-primary)] transition-colors ${className}`} {...props}>
    {children}
  </td>
);

Table.displayName = 'AirionTable';
THead.displayName = 'AirionTHead';
TBody.displayName = 'AirionTBody';
TR.displayName = 'AirionTR';
TH.displayName = 'AirionTH';
TD.displayName = 'AirionTD';
