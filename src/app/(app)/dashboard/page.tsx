// src/app/(app)/dashboard/page.tsx

import { Title1 } from "@fluentui/react-components";

import { SpendingDonutChart } from "@/components/charts/SpendingDonutChart";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { StatementUploader } from "@/components/upload/StatementUploader";
// 1. Import the new components and functions
import { getSpendingByCategory } from "@/lib/data/getFinancialSummary";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/utils";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // We can fetch data in parallel for better performance
  const transactionsPromise = user ? prisma.transaction.findMany({
    where: { userId: user.id },
    include: { category: { select: { name: true } } },
    orderBy: { transactionDate: "desc" },
    take: 50,
  }) : Promise.resolve([]);

  // 2. Call our new data aggregation function
  const spendingDataPromise = user ? getSpendingByCategory(user.id) : Promise.resolve([]);

  // Await both promises
  const [transactions, spendingData] = await Promise.all([
    transactionsPromise,
    spendingDataPromise,
  ]);

  return (
    <div className="flex flex-col gap-8">
      <Title1 as="h1">Dashboard</Title1>

      {/* 3. Use grid layout to place the uploader and chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Upload Statement</h2>
            <StatementUploader />
        </div>
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Spending by Category</h2>
            {/* 4. Pass the fetched data to the chart component */}
            <SpendingDonutChart data={spendingData} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Recent Transactions</h2>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}
