// src/app/api/transactions/upload/route.ts

import { NextResponse } from "next/server";

import { categorizeTransactions } from "@/lib/services/aiService";
import { parseStatement } from "@/lib/services/fileParser";
import { findOrCreateDefaultAccount, saveNewTransactions } from "@/lib/services/transactionService";
import { createServerSupabaseClient } from "@/lib/supabase/utils";

const SUPPORTED_FILE_TYPES = ["application/pdf", "text/csv"];

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("statement") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type. Please upload a PDF or CSV.` },
        { status: 400 }
      );
    }

    // --- Orchestration Logic ---
    // 1. Parse the file to get raw text
    console.log("Step 1: Parsing file...");
    const rawText = await parseStatement(file);

    // 2. Use AI to categorize the transactions
    console.log("Step 2: Sending text to AI for categorization...");
    const categorizedData = await categorizeTransactions(rawText);

    // 3. Get or create a default account for the user
    console.log("Step 3: Finding or creating default account...");
    const account = await findOrCreateDefaultAccount(user.id);

    // 4. Save the new, non-duplicate transactions to the database
    console.log("Step 4: Saving new transactions to the database...");
    const result = await saveNewTransactions(categorizedData, user.id, account.id);
    console.log(`Step 5: Complete! ${result.count} new transactions saved.`);

    // Return a success response with the count of new transactions
    return NextResponse.json({ success: true, newTransactionsCount: result.count });

  } catch (error) {
    // Enhanced error logging
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in transaction upload pipeline:", {
        userId: user.id,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
    });

    // Return a user-friendly error message
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
