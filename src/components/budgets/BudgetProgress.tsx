// src/components/budgets/BudgetProgress.tsx
"use client";

import {
  ProgressBar,
  Text,
  Tooltip,
} from "@fluentui/react-components";

import type { BudgetSummaryData } from "@/lib/data/getFinancialSummary";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const BudgetProgress = ({ budget }: { budget: BudgetSummaryData }) => {
  const budgetAmount = Number(budget.amount);
  const { totalSpent } = budget;

  // Calculate the progress. Ensure it doesn't go over 1.
  const progress = Math.min(totalSpent / budgetAmount, 1);

  // Determine the color of the progress bar based on how much is spent.
  const getProgressState = () => {
    if (progress > 0.9) return "error"; // Over 90% spent
    if (progress > 0.7) return "warning"; // Over 70% spent
    return "success";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <Text weight="semibold">{budget.category?.name || "Budget"}</Text>
        <Text size={200} className="text-gray-600">
          {formatCurrency(totalSpent)} / {formatCurrency(budgetAmount)}
        </Text>
      </div>
      <Tooltip content={`${(progress * 100).toFixed(0)}% spent`} relationship="label">
        <ProgressBar
          value={progress}
          color={getProgressState()}
          thickness="large"
        />
      </Tooltip>
    </div>
  );
};
