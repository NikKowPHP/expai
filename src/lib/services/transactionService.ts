// src/lib/services/transactionService.ts
import { createHash } from "crypto";

import { Transaction } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { ParsedTransaction } from "@/lib/types";

/**
 * Creates a unique signature for a transaction to prevent duplicates.
 * @param tx The transaction object.
 * @returns A SHA-256 hash string.
 */
function createTransactionSignature(tx: ParsedTransaction): string {
  const signatureString = `${tx.date}-${tx.amount}-${tx.description.trim().toLowerCase()}`;
  return createHash("sha256").update(signatureString).digest("hex");
}



/**
 * Finds the user's default account or creates one if it doesn't exist.
 * This is a temporary measure until full account management is implemented.
 * @param userId The ID of the user.
 * @returns A promise that resolves to the account object.
 */
export async function findOrCreateDefaultAccount(userId: string) {
  const defaultAccountName = "Default Account";

  let account = await prisma.account.findFirst({
    where: {
      userId: userId,
      name: defaultAccountName,
    },
  });

  if (!account) {
    account = await prisma.account.create({
      data: {
        userId: userId,
        name: defaultAccountName,
        accountType: "checking", // A sensible default
      },
    });
  }

  return account;
}



/**
 * Saves new, non-duplicate transactions to the database for a specific user.
 * Handles all database logic and deduplication.
 * @param transactions An array of parsed transactions from the AI service.
 * @param userId The ID of the user who owns these transactions.
 * @param accountId The ID of the financial account these transactions belong to.
 * @returns A promise that resolves to an object with the count of newly inserted transactions.
 */
export async function saveNewTransactions(
  transactions: ParsedTransaction[],
  userId: string,
  accountId: string // We will need to handle account creation/selection later
): Promise<{ count: number }> {
  if (transactions.length === 0) {
    return { count: 0 };
  }

  // 1. For each incoming transaction, add a unique signature.
  // We also add the required userId and accountId here.
  const transactionsWithSignature = transactions.map((tx) => ({
    ...tx,
    userId,
    accountId,
    transactionDate: new Date(tx.date), // Convert string date to Date object for Prisma
    signature: createTransactionSignature(tx),
  }));

  // 2. Query the database for all existing transaction signatures for that user.
  const existingSignatures = await prisma.transaction.findMany({
    where: {
      userId: userId,
      signature: {
        in: transactionsWithSignature.map((tx) => tx.signature),
      },
    },
    select: {
      signature: true,
    },
  });

  const existingSignatureSet = new Set(
    existingSignatures.map((tx: Transaction) => tx.signature)
  );

  // 3. Filter the incoming transactions, keeping only the new ones.
  const newTransactionsToSave = transactionsWithSignature.filter(
    (tx) => !existingSignatureSet.has(tx.signature)
  );

  // 4. If there are no new transactions, we're done.
  if (newTransactionsToSave.length === 0) {
    return { count: 0 };
  }

  // 5. Use `createMany` to insert all new transactions in a single database call.
  // We need to map the data to match the Prisma model exactly.
  const result = await prisma.transaction.createMany({
    data: newTransactionsToSave.map(tx => ({
        userId: tx.userId,
        accountId: tx.accountId,
        description: tx.description,
        amount: tx.amount,
        transactionDate: tx.transactionDate,
        signature: tx.signature,
        // categoryId will be null for now
    })),
    skipDuplicates: true, // As a fallback, skip any duplicates if a race condition occurs
  });

  // 6. Return the count of newly inserted transactions.
  return { count: result.count };
}
