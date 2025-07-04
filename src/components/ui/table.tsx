import React from 'react';

type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  className?: string;
};

type TableSectionProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  className?: string;
};

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  className?: string;
};

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  className?: string;
};

type TableHeaderCellProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  className?: string;
};

export function Table({ className = '', ...props }: TableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className={`w-full ${className}`} {...props} />
    </div>
  );
}

export function TableHeader({ className = '', ...props }: TableSectionProps) {
  return <thead className={`bg-gray-50 ${className}`} {...props} />;
}

export function TableBody({ className = '', ...props }: TableSectionProps) {
  return <tbody className={`divide-y divide-gray-200 ${className}`} {...props} />;
}

export function TableRow({ className = '', ...props }: TableRowProps) {
  return <tr className={`${className}`} {...props} />;
}

export function TableHead({ className = '', ...props }: TableHeaderCellProps) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = '', ...props }: TableCellProps) {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`} {...props} />;
}
