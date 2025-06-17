// src/app/(app)/dashboard/page.tsx

// --- Component Imports ---
import { Title1 } from "@fluentui/react-components";

import { SpendingDonutChart } from "@/components/charts/SpendingDonutChart";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { StatementUploader } from "@/components/upload/StatementUploader";
// --- Data Fetching & Server-Side Imports ---
import { getSpendingByCategory } from "@/lib/data/getFinancialSummary";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/utils";

/**
 * The main dashboard page for the application.
 *
 * This is a React Server Component (RSC), which means it runs exclusively on the server.
 * It is responsible for:
 * 1. Authenticating the user.
 * 2. Fetching all necessary data for the dashboard in parallel (transactions, categories, financial summaries).
 * 3. Passing the fetched data down as props to the client components responsible for rendering and interactivity.
 */
export default async function DashboardPage() {
  // --- 1. Authentication ---
  // Securely get the user session on the server.
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user is found, render a message. Middleware should prevent this, but it's a good safeguard.
  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  // --- 2. Parallel Data Fetching ---
  // We define all our data requirements as promises and run them concurrently
  // with Promise.all() for maximum performance.

  // Promise to fetch the 50 most recent transactions, including their category names.
  const transactionsPromise = prisma.transaction.findMany({
    where: { userId: user.id },
    include: {
      category: { select: { name: true } },
    },
    orderBy: { transactionDate: "desc" },
    take: 50,
  });

  // Promise to fetch the aggregated spending data for the donut chart.
  const spendingDataPromise = getSpendingByCategory(user.id);

  // Promise to fetch the complete list of the user's categories for the interactive dropdown.
  const categoriesPromise = prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  // Await all promises to resolve.
  const [transactions, spendingData, categories] = await Promise.all([
    transactionsPromise,
    spendingDataPromise,
    categoriesPromise,
  ]);

  // --- 3. Rendering ---
  // The component renders the page layout and passes the server-fetched data
  // down to the client components.
  return (
    <div className="flex flex-col gap-8">
      <Title1 as="h1">Dashboard</Title1>

      {/* Top section with uploader and chart, arranged in a responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Upload Statement</h2>
          <StatementUploader />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Spending by Category</h2>
          <SpendingDonutChart data={spendingData} />
        </div>
      </div>

      {/* Bottom section for the detailed transaction table */}
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
