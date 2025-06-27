// src/app/(app)/budgets/page.tsx
import { Title1 } from "@fluentui/react-components";

import { BudgetList } from "@/components/budgets/BudgetList";
import { CreateBudgetForm } from "@/components/budgets/CreateBudgetForm";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/utils";

export default async function BudgetsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await (await supabase).auth.getUser();

  if (!user) {
    return <p>Please log in to view budgets.</p>;
  }

  // Fetch data in parallel
  const categoriesPromise = prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  const budgetsPromise = prisma.budget.findMany({
    where: { userId: user.id },
    include: {
      category: { select: { name: true } }, // Include category name for display
    },
    orderBy: { endDate: "desc" },
  });

  const [categories, budgets] = await Promise.all([
    categoriesPromise,
    budgetsPromise,
  ]);

  return (
    <div className="flex flex-col gap-8">
      <Title1 as="h1">Budgets</Title1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Create New Budget</h2>
          <CreateBudgetForm categories={categories} />
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Your Budgets</h2>
          <BudgetList budgets={budgets} />
        </div>
      </div>
    </div>
  );
}
