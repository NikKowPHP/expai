// src/app/api/transactions/upload/route.ts

import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/utils";

// Define the supported file types
const SUPPORTED_FILE_TYPES = ["application/pdf", "text/csv"];

export async function POST(request: Request) {
  // --- 1. Authentication ---
  // The very first step is to get the current user.
  // We use our existing server-side Supabase client helper.
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // If there's no user, they are not authorized.
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // --- 2. Get File Data ---
    const formData = await request.formData();
    const file = formData.get("statement") as File | null;

    // --- 3. Validation ---
    // Check if a file exists
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Check if the file type is supported
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type. Please upload a PDF or CSV.` },
        { status: 400 }
      );
    }

    // --- Placeholder for a successful response ---
    // In the next section, we will replace this with calls to our services:
    // 1. const rawText = await parseStatement(file);
    // 2. const categorizedData = await categorizeTransactions(rawText);
    // 3. const result = await saveNewTransactions(categorizedData, user.id, someAccountId);

    // For now, we'll just return a success message.
    console.log(`User ${user.id} uploaded file: ${file.name} (${file.type})`);

    // This simulates a successful upload with 15 new transactions found.
    // The frontend will receive this and display it.
    return NextResponse.json({ success: true, newTransactionsCount: 15 });

  } catch (error) {
    // Generic error handler for any other issues (e.g., network, server crash)
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
