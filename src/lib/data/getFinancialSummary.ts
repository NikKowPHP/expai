// src/lib/data/getFinancialSummary.ts
import { Budget } from "@prisma/client";

import prisma from "@/lib/prisma";

export type SpendingByCategoryData = {
  name: string; // Category name
  value: number; // Total amount spent
};

/**
 * A server-only function to calculate total spending per category for a given user.
 * It first aggregates spending, then fetches category names to create a
 * user-friendly data structure for charting.
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of data ready for charting.
 */
export async function getSpendingByCategory(
  userId: string
): Promise<SpendingByCategoryData[]> {
  // 1. Group transactions by categoryId and sum the amounts
  const spendingData = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId: userId,
      amount: { lt: 0 }, // Only include expenses (less than 0)
      categoryId: { not: null }, // Ignore uncategorized transactions for the chart
    },
    _sum: {
      amount: true,
    },
  });

  // 2. The result from groupBy doesn't include category names, just IDs.
  // We need to fetch the names separately.
  const categoryIds = spendingData.map((item) => item.categoryId as string);
  const categories = await prisma.category.findMany({
    where: {
      id: { in: categoryIds },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Create a quick lookup map for category names
  const categoryNameMap = new Map(categories.map((c) => [c.id, c.name as string]));

  // 3. Format the data for the charting library
  const formattedChartData = spendingData.map((item) => ({
    name: categoryNameMap.get(item.categoryId as string) || "Unknown",
    // The sum will be negative, so we multiply by -1 to make it a positive value for the chart
    value: Math.abs(Number(item._sum.amount)),
  }));

  return formattedChartData;
}



// --- Type Definition for Budget Progress ---
export type BudgetSummaryData = Budget & {
  category: { name: string } | null;
  totalSpent: number;
};

/**
 * A server-only function that fetches active budgets and calculates the total
 * amount spent for each one within its date range.
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of budget objects, each enhanced with the total amount spent.
 */
export async function getBudgetSummary(
  userId: string
): Promise<BudgetSummaryData[]> {
  // 1. Fetch all of the user's budgets that are currently active or recent.
  const now = new Date();
  const budgets = await prisma.budget.findMany({
    where: {
      userId: userId,
      endDate: { gte: now }, // Only fetch budgets that haven't ended yet
    },
    include: {
      category: { select: { name: true } },
    },
    orderBy: {
        endDate: 'asc',
    }
  });

  // 2. For each budget, calculate the total spending in its category and date range.
  // We use Promise.all to run these queries concurrently for performance.
  const budgetSummaries = await Promise.all(
    budgets.map(async (budget) => {
      const spending = await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId: userId,
          categoryId: budget.categoryId,
          amount: { lt: 0 }, // Only sum expenses
          transactionDate: {
            gte: budget.startDate,
            lte: budget.endDate,
          },
        },
      });

      // The aggregated amount is negative, so we make it positive.
      const totalSpent = Math.abs(Number(spending._sum.amount) || 0);

      return {
        ...budget,
        totalSpent,
      };
    })
  );

  return budgetSummaries;
}

export type SpendingBreakdownData = {
  name: string; // "Need", "Want", or "Saving/Investment"
  value: number; // Total amount spent
};

/**
 * A server-only function that aggregates spending by category type (Need/Want/Saving)
 * for a given user.
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of spending data by category type.
 */
export async function getSpendingBreakdown(
  userId: string
): Promise<SpendingBreakdownData[]> {
  // 1. Fetch all transactions with their category data
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: userId,
      amount: { lt: 0 }, // Only include expenses (less than 0)
      category: { isNot: null }, // Only include categorized transactions
    },
    include: {
      category: {
        select: {
          type: true,
        },
      },
    },
  });

  // 2. Manually group by category type and sum amounts
  const spendingByType = new Map<string, number>();

  transactions.forEach((transaction) => {
    const type = transaction.category?.type || "Uncategorized";
    const currentSum = spendingByType.get(type) || 0;
    spendingByType.set(type, currentSum + Math.abs(Number(transaction.amount)));
  });

  // 3. Format the data for the charting library
  const formattedData = Array.from(spendingByType.entries()).map(([type, sum]) => ({
    name: type,
    value: sum,
  }));

  return formattedData;
}
