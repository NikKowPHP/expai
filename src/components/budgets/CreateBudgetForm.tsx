// src/components/budgets/CreateBudgetForm.tsx
"use client";

import {
  Button,
  Card,
  Combobox,
  Field,
  Input,
  Option} from "@fluentui/react-components";
import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Note: Fluent UI v9 does not have a stable DatePicker yet.
// We will use native HTML5 date inputs for now.
// In a real project, you might use a third-party library or the unstable Fluent one.

export const CreateBudgetForm = ({
  categories,
}: {
  categories: Category[];
}) => {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount || !startDate || !endDate) {
        alert("Please fill out all fields.");
        return;
    }

    await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId,
        amount: parseFloat(amount),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      }),
    });

    // Reset form
    setCategoryId(undefined);
    setAmount("");
    setStartDate("");
    setEndDate("");

    router.refresh();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
        <Field label="Category" required>
          <Combobox
            placeholder="Select a category"
            onOptionSelect={(_, data) => setCategoryId(data.optionValue)}
          >
            {categories.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Combobox>
        </Field>
        <Field label="Amount ($)" required>
          <Input
            type="number"
            value={amount}
            onChange={(_, data) => setAmount(data.value)}
            min="0.01"
            step="0.01"
          />
        </Field>
        <Field label="Start Date" required>
            <Input
                type="date"
                value={startDate}
                onChange={(_, data) => setStartDate(data.value)}
            />
        </Field>
        <Field label="End Date" required>
            <Input
                type="date"
                value={endDate}
                onChange={(_, data) => setEndDate(data.value)}
            />
        </Field>
        <Button type="submit" appearance="primary">
          Create Budget
        </Button>
      </form>
    </Card>
  );
};
