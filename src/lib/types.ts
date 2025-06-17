// src/lib/types.ts
export type ParsedTransaction = {
  date: string; // "YYYY-MM-DD"
  description: string;
  amount: number; // Negative for debits, positive for credits
};
