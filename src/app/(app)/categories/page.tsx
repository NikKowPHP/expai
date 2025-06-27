// src/app/(app)/categories/page.tsx
import { Title1 } from "@fluentui/react-components";

import { CategoryTable } from "@/components/categories/CategoryTable";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/utils";

/**
 * The server-side page component for managing categories.
 * Its only job is to fetch the user's categories and pass them to the interactive client component.
 */
export default async function CategoriesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <p>Please log in to view categories.</p>;
  }

  // Fetch all categories for the user, along with a count of how many transactions are in each.
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <Title1 as="h1">Manage Categories</Title1>
      <p>
        Here you can rename or delete your custom spending categories. Deleting a
        category will mark its associated transactions as "Uncategorized".
      </p>
      <CategoryTable categories={categories} />
    </div>
  );
}
