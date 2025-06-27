// src/components/transactions/TransactionTable.tsx

"use client";

import {
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableCellLayout,
  TableColumnDefinition,
} from "@fluentui/react-components";
import type { Category, Transaction } from "@prisma/client";
import { format } from "date-fns";

import { CategoryCell } from "./CategoryCell"; // Import the new component

// --- Type Definitions ---
type TransactionWithCategory = Transaction & {
  category: { name: string } | null;
};

// This function needs the list of all categories now
const createColumns = (allCategories: Category[]): TableColumnDefinition<TransactionWithCategory>[] => [
  // ... (Date, Description columns remain the same)
  createTableColumn<TransactionWithCategory>({
    columnId: "transactionDate",
    compare: (a, b) => a.transactionDate.getTime() - b.transactionDate.getTime(),
    renderHeaderCell: () => "Date",
    renderCell: (item) => <TableCellLayout>{format(new Date(item.transactionDate), "MMM dd, yyyy")}</TableCellLayout>,
  }),
  createTableColumn<TransactionWithCategory>({
    columnId: "description",
    compare: (a, b) => a.description.localeCompare(b.description),
    renderHeaderCell: () => "Description",
    renderCell: (item) => <TableCellLayout>{item.description}</TableCellLayout>,
  }),

  // --- This is the updated Category column ---
  createTableColumn<TransactionWithCategory>({
    columnId: "category",
    renderHeaderCell: () => "Category",
    renderCell: (item) => (
      <CategoryCell
        transactionId={item.id}
        currentCategory={item.category ? { id: item.categoryId!, name: item.category.name } : null}
        allCategories={allCategories}
      />
    ),
  }),

  // ... (Amount column remains the same)
  createTableColumn<TransactionWithCategory>({
    columnId: "amount",
    compare: (a, b) => Number(a.amount) - Number(b.amount),
    renderHeaderCell: () => "Amount",
    renderCell: (item) => (
      <TableCellLayout>
        <span className={Number(item.amount) > 0 ? "text-green-600" : ""}>
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(item.amount))}
        </span>
      </TableCellLayout>
    ),
  }),
];

// --- The Main Component ---
export const TransactionTable = ({
  transactions,
  categories, // It now needs the list of all categories
}: {
  transactions: TransactionWithCategory[];
  categories: Category[];
}) => {
  if (!transactions || transactions.length === 0) {
    return <p>No transactions found. Upload a statement to see your data here.</p>;
  }

  const columns = createColumns(categories);

  return (
    <DataGrid
      items={transactions}
      columns={columns}
      aria-label="Transaction history table"
      getRowId={(item) => item.id}
      resizableColumns
      columnSizingOptions={{
        description: { minWidth: 200, defaultWidth: 350 },
      }}
    >
      <DataGridHeader>
        <DataGridRow>
          {(column) => <DataGridHeaderCell key={column.columnId}>{column.renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<TransactionWithCategory>>
        {({ item, rowId }) => (
          <DataGridRow key={rowId}>
            {(column) => <DataGridCell key={column.columnId}>{column.renderCell(item)}</DataGridCell>}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};
