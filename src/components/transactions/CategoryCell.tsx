// src/components/transactions/CategoryCell.tsx
"use client";

import {
  Button,
  Combobox,
  Option,
  Popover,
  PopoverSurface,
  PopoverTrigger,
} from "@fluentui/react-components";
import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryCellProps {
  transactionId: string;
  currentCategory: { id: string; name: string } | null;
  allCategories: Category[]; // List of all user's categories
}

export const CategoryCell = ({
  transactionId,
  currentCategory,
  allCategories,
}: CategoryCellProps) => {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    currentCategory?.id || null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    if (!selectedCategoryId) return;

    // Call our PATCH API endpoint
    await fetch(`/api/transactions/${transactionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: selectedCategoryId }),
    });

    setIsOpen(false); // Close the popover
    router.refresh(); // Refresh the page to show the updated data
  };

  return (
    <Popover open={isOpen} onOpenChange={(_, data) => setIsOpen(data.open)}>
      <PopoverTrigger>
        <Button appearance="transparent" as="span">
          {currentCategory?.name || (
            <span className="text-gray-500 italic">Uncategorized</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverSurface>
        <div className="flex flex-col gap-4 p-4 w-64">
          <h3 className="font-bold">Change Category</h3>
          <Combobox
            placeholder="Select a category"
            value={
              allCategories.find((c) => c.id === selectedCategoryId)?.name || ""
            }
            onOptionSelect={(_, data) => {
              if (data.optionValue) {
                setSelectedCategoryId(data.optionValue);
              }
            }}
          >
            {allCategories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Combobox>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button appearance="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </PopoverSurface>
    </Popover>
  );
};
