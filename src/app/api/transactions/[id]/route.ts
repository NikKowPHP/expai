// src/app/api/transactions/[id]/route.ts
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/utils";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Get user session
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Get transaction ID from URL and new categoryId from request body
  const transactionId = params.id;
  const { categoryId } = await request.json();

  if (!transactionId || !categoryId) {
    return NextResponse.json(
      { error: "Missing transactionId or categoryId" },
      { status: 400 }
    );
  }

  try {
    // 3. SECURITY CHECK: Update the transaction ONLY if the ID matches AND it belongs to the logged-in user.
    // This is the most important line. It prevents a user from updating someone else's transaction.
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transactionId,
        userId: user.id, // <-- Critical security check
      },
      data: {
        categoryId: categoryId,
      },
    });

    // 4. Return the updated transaction
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    // This will catch errors if the transaction is not found (or doesn't belong to the user)
    console.error("Failed to update transaction:", error);
    return NextResponse.json(
      { error: "Transaction not found or update failed" },
      { status: 404 }
    );
  }
}
