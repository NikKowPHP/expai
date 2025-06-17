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
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

// --- Type Definition ---
// We augment the Prisma Transaction type with the included Category data
type TransactionWithCategory = PrismaClient['Transaction'] & {
  category: {
    name: string;
  } | null;
};

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// --- Column Definitions for the DataGrid ---
const columns: TableColumnDefinition<TransactionWithCategory>[] = [
  createTableColumn<TransactionWithCategory>({
    columnId: "transactionDate",
    compare: (a, b) => a.transactionDate.getTime() - b.transactionDate.getTime(),
    renderHeaderCell: () => "Date",
    renderCell: (item) => (
      <TableCellLayout>
        {format(new Date(item.transactionDate), "MMM dd, yyyy")}
      </TableCellLayout>
    ),
  }),
  createTableColumn<TransactionWithCategory>({
    columnId: "description",
    compare: (a, b) => a.description.localeCompare(b.description),
    renderHeaderCell: () => "Description",
    renderCell: (item) => (
      <TableCellLayout>
        {item.description}
      </TableCellLayout>
    ),
  }),
  createTableColumn<TransactionWithCategory>({
    columnId: "category",
    compare: (a, b) => (a.category?.name || "").localeCompare(b.category?.name || ""),
    renderHeaderCell: () => "Category",
    renderCell: (item) => (
      <TableCellLayout>
        {item.category?.name || <span className="text-gray-500">Uncategorized</span>}
      </TableCellLayout>
    ),
  }),
  createTableColumn<TransactionWithCategory>({
    columnId: "amount",
    compare: (a, b) => Number(a.amount) - Number(b.amount),
    renderHeaderCell: () => "Amount",
    renderCell: (item) => (
      <TableCellLayout>
        <span className={Number(item.amount) > 0 ? "text-green-600" : ""}>
          {formatCurrency(Number(item.amount))}
        </span>
      </TableCellLayout>
    ),
  }),
];

// --- The Main Component ---
export const TransactionTable = ({
  transactions,
}: {
  transactions: TransactionWithCategory[];
}) => {
  if (!transactions || transactions.length === 0) {
    return <p>No transactions found. Upload a statement to see your data here.</p>;
  }

  return (
    <DataGrid
      items={transactions}
      columns={columns}
      aria-label="Transaction history table"
      getRowId={(item) => item.id}
      resizableColumns
      columnSizingOptions={{
        description: {
          minWidth: 200,
          defaultWidth: 350,
        },
      }}
    >
      <DataGridHeader>
        <DataGridRow>
          {(column) => (
            <DataGridHeaderCell key={column.columnId}>
              {column.renderHeaderCell()}
            </DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<TransactionWithCategory>>
        {({ item, rowId }) => (
          <DataGridRow key={rowId}>
            {(column) => (
              <DataGridCell key={column.columnId}>
                {column.renderCell(item)}
              </DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  );
};
