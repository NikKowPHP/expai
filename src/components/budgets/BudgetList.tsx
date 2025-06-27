// src/components/budgets/BudgetList.tsx
"use client";

import { Button, Card } from "@fluentui/react-components";
import type { Budget} from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type BudgetWithCategory = Budget & {
  category: { name: string } | null;
};

export const BudgetList = ({
  budgets,
}: {
  budgets: BudgetWithCategory[];
}) => {
  const router = useRouter();

  if (budgets.length === 0) {
    return <p>You have no budgets. Create one to get started!</p>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleDelete = async (budgetId: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
        await fetch(`/api/budgets/${budgetId}`, { method: 'DELETE' });
        router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {budgets.map((budget) => (
        <Card key={budget.id}>
          <div className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">
                {budget.category?.name || "Unknown Category"}
              </h3>
              <p className="text-gray-600">
                {formatCurrency(Number(budget.amount))}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(budget.startDate), "MMM dd, yyyy")} -{" "}
                {format(new Date(budget.endDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="flex gap-2">
                {/* TODO: Implement Edit functionality with a Dialog */}
                <Button disabled>Edit</Button>
                <Button appearance="secondary" onClick={() => handleDelete(budget.id)}>Delete</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
