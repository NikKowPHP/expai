// src/app/api/budgets/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/utils";

// Define the validation schema for creating a budget
const createBudgetSchema = z.object({
  categoryId: z.string().uuid(),
  amount: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    // Validate the request body against our schema
    const { categoryId, amount, startDate, endDate } = createBudgetSchema.parse(json);

    const newBudget = await prisma.budget.create({
      data: {
        userId: user.id,
        categoryId,
        amount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(newBudget, { status: 201 }); // 201 Created
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
