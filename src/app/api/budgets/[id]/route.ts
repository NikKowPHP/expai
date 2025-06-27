// src/app/api/budgets/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/utils";

// Schema for updating a budget (all fields are optional)
const updateBudgetSchema = z.object({
  categoryId: z.string().uuid().optional(),
  amount: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const budgetId = params.id;

  try {
    const json = await request.json();
    const dataToUpdate = updateBudgetSchema.parse(json);

    const updatedBudget = await prisma.budget.update({
      where: {
        id: budgetId,
        userId: user.id, // <-- Critical security check
      },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedBudget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Budget not found or update failed" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const budgetId = params.id;

  try {
    await prisma.budget.delete({
      where: {
        id: budgetId,
        userId: user.id, // <-- Critical security check
      },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Budget not found or delete failed" },
      { status: 404 }
    );
  }
}
