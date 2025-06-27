// src/components/categories/CategoryTable.tsx
"use client";

import {
  Button,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  TableCellLayout,
  TableColumnDefinition,
} from "@fluentui/react-components";
import { Delete24Regular,Edit24Regular } from "@fluentui/react-icons";
import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// --- Type Definition ---
// Augment the Prisma Category type with the transaction count
type CategoryWithCount = Category & {
  _count: {
    transactions: number;
  };
};

// --- The Main Component ---
export const CategoryTable = ({
  categories,
}: {
  categories: CategoryWithCount[];
}) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleRename = async () => {
    if (!selectedCategory || !renameValue) return;

    await fetch(`/api/categories/${selectedCategory.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: renameValue }),
    });

    setSelectedCategory(null); // Close dialog
    router.refresh();
  };

  const handleDelete = async (categoryId: string) => {
    await fetch(`/api/categories/${categoryId}`, {
      method: "DELETE",
    });
    router.refresh();
  };

  const columns: TableColumnDefinition<CategoryWithCount>[] = [
    createTableColumn<CategoryWithCount>({
      columnId: "name",
      renderHeaderCell: () => "Category Name",
      renderCell: (item) => <TableCellLayout>{item.name}</TableCellLayout>,
    }),
    createTableColumn<CategoryWithCount>({
      columnId: "transactionCount",
      renderHeaderCell: () => "Transactions",
      renderCell: (item) => <TableCellLayout>{item._count.transactions}</TableCellLayout>,
    }),
    createTableColumn<CategoryWithCount>({
      columnId: "actions",
      renderHeaderCell: () => "Actions",
      renderCell: (item) => (
        <div className="flex gap-2">
          {/* RENAME BUTTON & DIALOG */}
          <Dialog
            open={selectedCategory?.id === item.id}
            onOpenChange={(_, data) => {
              if (!data.open) setSelectedCategory(null);
            }}
          >
            <DialogTrigger>
              <Button
                icon={<Edit24Regular />}
                aria-label="Rename"
                onClick={() => {
                  setSelectedCategory(item);
                  setRenameValue(item.name);
                }}
              />
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Rename Category</DialogTitle>
                <DialogContent>
                  <Field label="New category name">
                    <Input
                      value={renameValue}
                      onChange={(_, data) => setRenameValue(data.value)}
                    />
                  </Field>
                </DialogContent>
                <DialogActions>
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="secondary">Cancel</Button>
                  </DialogTrigger>
                  <Button appearance="primary" onClick={handleRename}>Save</Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>

          {/* DELETE BUTTON & DIALOG */}
          <Dialog>
            <DialogTrigger>
              <Button icon={<Delete24Regular />} aria-label="Delete" />
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                  Are you sure you want to delete the &quot;<strong>{item.name}</strong>&quot; category?
                  This will uncategorize <strong>{item._count.transactions}</strong> transaction(s). This action cannot be undone.
                </DialogContent>
                <DialogActions>
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="secondary">Cancel</Button>
                  </DialogTrigger>
                  <Button appearance="primary" onClick={() => handleDelete(item.id)}>Delete</Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        </div>
      ),
    }),
  ];

  return (
    <DataGrid items={categories} columns={columns} getRowId={(item) => item.id}>
      <DataGridHeader>
        <DataGridRow>
          {(column) => (
            <DataGridHeaderCell key={column.columnId}>
              {column.renderHeaderCell()}
            </DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<CategoryWithCount>>
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
