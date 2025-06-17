### **Expai: Phase 1 Development Guide**

**Objective:** To build the complete, end-to-end data pipeline. A user must be able to upload a financial statement, have our AI process it, and see the categorized data stored securely in their account. This phase is the heart of the MVP.

**Target Developer:** Junior Fullstack Developer
**Desired Outcome:** Senior-Level, Maintainable, and Testable Code

**Prerequisites:**
*   Phase 0 is 100% complete. The project is set up, the database schema is in place, and user authentication is fully functional.

---

### ✅ **Phase 1 To-Do List: Core MVP - The AI Data Pipeline**

#### **Section 1: Frontend - The Upload Interface**
*The goal here is to create a seamless and informative user experience for the file upload process. The user should always know what's happening.*

-   [x] **1.1: Build the File Upload Component**
    -   [x] Create a new component at `src/components/upload/StatementUploader.tsx`.
    -   [x] Use Fluent 2 components to build the UI:
        -   A "drag and drop" area or a simple `<input type="file" />` styled with a Fluent `Button`.
        -   A `Spinner` to show when processing is in progress.
        -   A `MessageBar` to display success (`intent="success"`) or error (`intent="error"`) messages to the user.
    -   [x] **State Management:** Use the `useState` hook to manage the component's state. You will need states for:
        -   `const [file, setFile] = useState<File | null>(null);`
        -   `const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');`
        -   `const [errorMessage, setErrorMessage] = useState<string | null>(null);`

-   [x] **1.2: Implement the Frontend Upload Logic**
    -   [x] Create a `handleSubmit` function that will be triggered when the user clicks the "Upload" button.
    -   [x] **Inside `handleSubmit`:**
        1.  Check if a file has been selected. If not, show an error.
        2.  Set status to `'uploading'`.
        3.  Create a `FormData` object: `const formData = new FormData();`.
        4.  Append the selected file: `formData.append('statement', file);`.
        5.  Use `fetch` to send a `POST` request to our yet-to-be-created API endpoint (`/api/transactions/upload`).
        6.  The `body` of the fetch request will be your `formData` object.
        7.  **Handle the response:**
            -   If the response is successful (`response.ok`), set status to `'success'`.
            -   If the response fails, parse the error message from the JSON body, set status to `'error'`, and update `setErrorMessage`.
        8.  Use a `try...catch` block around your fetch call to handle network errors.
    -   [x] **UI Rendering:** Your component's return statement should conditionally render UI based on the `status` state (e.g., show the form when `idle`, the `Spinner` when `uploading`, etc.).

---

#### **Section 2: Backend - The API Endpoint**
*The goal is to create a secure API endpoint that acts as an orchestrator. It will receive the file and delegate the complex work to specialized services.*

-   [x] **2.1: Create the API Route File**
    -   [ ] Create the file: `src/app/api/transactions/upload/route.ts`.
    -   [ ] Define an asynchronous function `export async function POST(request: Request) { ... }`.

-   [x] **2.2: Implement Security and Input Validation**
    -   [x] **Inside the `POST` function:**
        1.  **Authentication:** The very first step is to get the current user's session from Supabase. If there is no user, immediately return a `401 Unauthorized` error.
            ```typescript
            // You will need to create a server-side Supabase client helper
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            ```
        2.  **Get File Data:** Parse the `FormData` from the request body: `const formData = await request.formData();`.
        3.  Get the file: `const file = formData.get('statement') as File;`.
        4.  **Validation:** Check if a file exists and if its `type` is one of our supported formats (e.g., `application/pdf`, `text/csv`). If not, return a `400 Bad Request` error with a clear message.

---

#### **Section 3: Core Services - The Engine Room (Senior-Level Abstraction)**
*This is the most important part of Phase 1. We will NOT put all the logic into the API route. We will create separate, single-responsibility services. This makes the code testable, reusable, and easy to understand.*

-   [x] **3.1: Create the `FileParsingService`**
    -   [ ] Create a new file: `src/lib/services/fileParser.ts`.
    -   [ ] Install necessary parsing libraries: `npm install pdf-parse papaparse`.
    -   [ ] **Create a function:** `export async function parseStatement(file: File): Promise<string> { ... }`.
    -   [ ] **Inside the function:**
        1.  Check the `file.type`.
        2.  If it's a PDF, convert the file to a Buffer, and use `pdf-parse` to extract the text content.
        3.  If it's a CSV, use `papaparse` to get the text.
        4.  Return the raw extracted text as a single string.
        5.  Throw a specific error if the file type is unsupported.
    *Senior Tip: This service knows NOTHING about users, AI, or databases. Its only job is to turn a file into text.*

-   [x] **3.2: Create the `AIService`**
    -   [ ] Create a new file: `src/lib/services/aiService.ts`.
    -   [ ] **Create a function:** `export async function categorizeTransactions(rawText: string): Promise<ParsedTransaction[]> { ... }`. (`ParsedTransaction` will be a TypeScript `type` you define).
    -   [ ] **Inside the function:**
        1.  **Construct a detailed prompt.** This is critical. The prompt should instruct the AI (e.g., Gemini) to act as an expert financial analyst, parse the text, ignore irrelevant lines, and return a JSON array of transactions. Specify the exact JSON format you expect.
            ```typescript
            // Example Prompt Snippet
            const prompt = `
              You are an expert financial data processor. Analyze the following text from a bank statement.
              Extract all transactions and return them as a JSON array of objects with this exact structure: { "date": "YYYY-MM-DD", "description": "Transaction Description", "amount": 123.45 }.
              The amount should be negative for debits/expenses and positive for credits/income.
              Ignore all summary text, marketing messages, and balances. Only return the JSON array.

              Text to analyze:
              ${rawText}
            `;
            ```
        2.  Use `fetch` to call the Gemini/OpenRouter API, sending the prompt. Remember to include your API key from environment variables (`process.env.GEMINI_API_KEY`).
        3.  Parse the JSON response from the AI.
        4.  Validate the response to ensure it matches your `ParsedTransaction[]` type. You can use a library like Zod for robust validation.
        5.  Return the validated array of transactions.
    *Senior Tip: This service knows NOTHING about files or databases. It only knows how to talk to the AI.*

-   [x] **3.3: Create the `TransactionService`**
    -   [ ] Create a new file: `src/lib/services/transactionService.ts`.
    -   [ ] Import your Prisma client instance.
    -   [ ] **Create a function:** `export async function saveNewTransactions(transactions: ParsedTransaction[], userId: string, accountId: string): Promise<{ count: number }> { ... }`.
    -   [ ] **Inside the function (Deduplication Logic):**
        1.  For each incoming transaction, create a unique signature (e.g., a hash of `date + amount + description`).
        2.  Query the database for all existing transaction signatures for that `userId`.
        3.  Filter your incoming `transactions` array, keeping only those whose signature does not exist in the database.
        4.  If there are no new transactions to add, return `{ count: 0 }`.
        5.  Use `prisma.transaction.createMany({ data: ... })` to insert all the new, unique transactions in a single, efficient database call.
        6.  Return the count of newly inserted transactions.
    *Senior Tip: This service handles all database logic for transactions. The API route shouldn't directly use Prisma for this.*

---

#### **Section 4: Orchestration & Testing**

-   [ ] **4.1: Connect the Services in the API Route**
    -   [ ] Go back to `src/app/api/transactions/upload/route.ts`.
    -   [ ] Inside your `POST` function's `try` block, call your services in order:
        ```typescript
        // After security and validation...
        const rawText = await parseStatement(file);
        const categorizedData = await categorizeTransactions(rawText);

        // Note: For now, you might hardcode an accountId or create a default one.
        // We'll build account management later.
        const result = await saveNewTransactions(categorizedData, session.user.id, someAccountId);

        return NextResponse.json({ success: true, newTransactionsCount: result.count });
        ```
    -   Enhance your `catch` block to log the error on the server and return a generic, user-friendly error message.

-   [ ] **4.2: Write Tests**
    *This step is what elevates the code to a senior level. It guarantees your logic works and protects against future regressions.*
    -   [ ] **Unit Tests (using Jest):**
        -   Test the `FileParsingService`: Give it mock PDF and CSV data and assert that it returns the expected text.
        -   Test the `AIService`: Mock the `fetch` call. Send a sample response from the AI and assert that your service parses it correctly. Test its error handling if the AI returns a malformed response.
        -   Test the `TransactionService`: Mock the Prisma client. Test the deduplication logic specifically.
    -   [ ] **Integration Test (using Jest):**
        -   Test the `/api/transactions/upload` endpoint itself. Mock the services you just created (`parseStatement`, `categorizeTransactions`, etc.) to isolate the endpoint's orchestration logic.

---

### **Definition of Done for Phase 1**

You have successfully completed this phase when:
-   [ ] A logged-in user can upload a CSV or PDF file via the UI.
-   [ ] The frontend provides clear loading, success, and error feedback.
-   [- ] The API endpoint successfully orchestrates the parsing, AI categorization, and database insertion.
-   [ ] New, non-duplicate transactions appear in the `transactions` table in your Supabase database, correctly linked to the `user_id`.
-   [ ] All new services and the API endpoint have corresponding unit and/or integration tests.
-   [ ] The code is clean, well-commented where necessary, and abstracted into single-responsibility modules.
