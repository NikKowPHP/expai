// src/lib/services/aiService.ts
import { ParsedTransaction } from "@/lib/types";

const AI_API_URL = "https://openrouter.ai/api/v1/chat/completions";
// We'll use a fast and capable model. Google's Gemini Flash is a good choice.
const AI_MODEL = "google/gemini-flash-1.5";

/**
 * Takes raw text from a financial statement and uses an AI model to extract transactions.
 * This service knows nothing about files or databases. It only knows how to talk to the AI.
 * @param rawText The raw text content from a parsed file.
 * @returns A promise that resolves to an array of structured transaction objects.
 */
export async function categorizeTransactions(
  rawText: string
): Promise<ParsedTransaction[]> {
  const prompt = `
    You are an expert financial data processor. Analyze the following text from a bank or credit card statement.
    Extract all financial transactions and return them as a valid JSON array of objects.

    Each object in the array must have this exact structure:
    { "date": "YYYY-MM-DD", "description": "Transaction Description", "amount": 123.45 }

    Rules:
    - The 'date' must be a valid date in YYYY-MM-DD format.
    - The 'description' should be a concise summary of the transaction.
    - The 'amount' must be a number. It should be NEGATIVE for debits, withdrawals, or expenses, and POSITIVE for credits, deposits, or income.
    - Ignore all summary text, marketing messages, account balances, and any other non-transactional lines.
    - Only return the JSON array itself, with no other text, explanations, or markdown formatting.

    Text to analyze:
    ---
    ${rawText}
    ---
  `;

  try {
    const response = await fetch(AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }, // Ask the AI for a guaranteed JSON response
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`AI API request failed: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
        throw new Error("AI returned an empty response.");
    }

    // The AI's response might be a stringified JSON object that itself contains the array.
    // We need to parse it to get the actual array.
    const result = JSON.parse(content);

    // A simple validation. In a real app, you'd use Zod here.
    if (!Array.isArray(result)) {
        // Sometimes the AI wraps the array in a key, like {"transactions": [...]}. Let's try to find it.
        const key = Object.keys(result).find(k => Array.isArray(result[k]));
        if (key) {
            return result[key] as ParsedTransaction[];
        }
        throw new Error("AI response is not a JSON array.");
    }

    return result as ParsedTransaction[];
  } catch (error) {
    console.error("Error categorizing transactions with AI:", error);
    // Re-throw the error so the calling API route can handle it
    throw new Error("Failed to process statement with AI.");
  }
}
