// src/lib/services/fileParser.ts

// We need to import the 'pdf-parse' library. Note that it's a default export.
import { Buffer } from "buffer";
import pdf from "pdf-parse";

/**
 * Parses the content of a financial statement file (PDF or CSV) into a single string.
 * This service is intentionally kept simple and has no knowledge of users, AI, or databases.
 * Its sole responsibility is to convert a file into raw text for further processing.
 *
 * @param file The statement file (PDF or CSV) to parse.
 * @returns A promise that resolves to the raw text content of the file.
 * @throws An error if the file type is unsupported.
 */
export async function parseStatement(file: File): Promise<string> {
  // 1. Check the file's MIME type.
  switch (file.type) {

    // 2. Handle PDF files.
    case "application/pdf": {
      // The pdf-parse library requires the file data as a Buffer.
      // We can get this by converting the file to an ArrayBuffer first, then to a Buffer.
      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      const data = await pdf(fileBuffer);

      // The 'data.text' property contains all the extracted text from the PDF.
      return data.text;
    }

    // 3. Handle CSV files.
    case "text/csv": {
      // For CSV files, the goal is to provide the raw text to the AI.
      // The AI is very effective at understanding the structure of raw CSV text,
      // so we don't need to parse it into JSON here. We just extract the text content.
      const text = await file.text();
      return text;
    }

    // 5. Handle any other file type by throwing an error.
    default:
      console.error(`Attempted to parse unsupported file type: ${file.type}`);
      throw new Error("Unsupported file type. Please upload a PDF or CSV.");
  }
}
