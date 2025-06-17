// src/lib/data/getFinancialSummary.ts
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
  const categoryIds = spendingData.map((item: { categoryId: unknown; }) => item.categoryId!);
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
  const categoryNameMap = new Map(categories.map((c: { id: unknown; name: unknown; }) => [c.id, c.name]));

  // 3. Format the data for the charting library
  const formattedChartData = spendingData.map((item: { categoryId: unknown; _sum: { amount: unknown; }; }) => ({
    name: categoryNameMap.get(item.categoryId!) || "Unknown",
    // The sum will be negative, so we multiply by -1 to make it a positive value for the chart
    value: Math.abs(Number(item._sum.amount)),
  }));

  return formattedChartData;
}
