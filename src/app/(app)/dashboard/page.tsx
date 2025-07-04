// src/app/(app)/dashboard/page.tsx

// --- Component Imports ---
import { Title1 } from "@fluentui/react-components";

import { BudgetProgress } from "@/components/budgets/BudgetProgress"; // <-- Import new component
import { SpendingDonutChart } from "@/components/charts/SpendingDonutChart";
import { SpendingBreakdownPieChart } from "@/components/charts/SpendingBreakdownPieChart";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { StatementUploader } from "@/components/upload/StatementUploader";
// --- Data Fetching & Server-Side Imports ---
import { getBudgetSummary, getSpendingByCategory, getSpendingBreakdown } from "@/lib/data/getFinancialSummary";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/utils";


export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  // --- Parallel Data Fetching ---
  const transactionsPromise = prisma.transaction.findMany({
    where: { userId: user.id },
    include: { category: { select: { name: true } } },
    orderBy: { transactionDate: "desc" },
    take: 50,
  });
  const spendingDataPromise = getSpendingByCategory(user.id);
  const categoriesPromise = prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });
  const budgetSummaryPromise = getBudgetSummary(user.id); // <-- Add promise to fetch budget summary

  // Await all promises to resolve.
  const [transactions, spendingData, categories, budgetSummaries, spendingBreakdown] = await Promise.all([
    transactionsPromise,
    spendingDataPromise,
    categoriesPromise,
    budgetSummaryPromise,
    getSpendingBreakdown(user.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <Title1 as="h1">Dashboard</Title1>

      {/* --- Budgets Section --- */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Active Budgets</h2>
        {budgetSummaries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetSummaries.map((budget) => (
              <BudgetProgress key={budget.id} budget={budget} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no active budgets.</p>
        )}
      </div>

      {/* --- Uploader and Chart Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Upload Statement</h2>
          <StatementUploader />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Spending by Category</h2>
          <SpendingDonutChart data={spendingData} />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Needs vs Wants</h2>
          <SpendingBreakdownPieChart data={spendingBreakdown} />
        </div>
      </div>

      {/* --- Transactions Table Section --- */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Recent Transactions</h2>
        <TransactionTable
          transactions={transactions}
          categories={categories}
        />
      </div>
    </div>
  );
}
