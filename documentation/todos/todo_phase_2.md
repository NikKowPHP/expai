### **Expai: Phase 2 Development Guide**

**Objective:** To transform the raw, categorized data from Phase 1 into a meaningful, interactive, and user-centric experience. The user must be able to see, understand, and manage their financial data through an intuitive interface.

**Target Developer:** Junior Fullstack Developer
**Desired Outcome:** Senior-Level, Performant, and Maintainable Code

**Prerequisites:**
*   Phase 1 is 100% complete. The data pipeline is functional, and transactions are being saved to the database correctly.

---

### ✅ **Phase 2 To-Do List: Data Presentation & User Interaction**

#### **Section 1: The Dashboard - The User's Home Base**
*The goal is to build the main dashboard page. We will use Next.js App Router's server components to fetch data efficiently and securely on the server, passing it down to client components for interactivity.*

-   [ ] **1.1: Create the Dashboard Page & Server-Side Data Fetching**
    -   [ ] Create the dashboard page file at `src/app/(app)/dashboard/page.tsx`.
        *Senior Tip: The `(app)` folder is a "Route Group". It allows us to apply a shared layout to all pages within it (like a sidebar) without affecting the URL path.*
    -   [ ] This page will be an `async` React Server Component (RSC). This is the default in the App Router.
    -   [ ] **Implement server-side data fetching:**
        1.  Create a server-side Supabase client helper (if you haven't already from Phase 1).
        2.  Inside the `DashboardPage` component function, fetch the user's transactions.
        3.  Use Prisma to perform a sophisticated query. We need not just the transaction, but also the related category name.
            ```typescript
            // In src/app/(app)/dashboard/page.tsx
            import { prisma } from '@/lib/prisma'; // Your Prisma client instance

            export default async function DashboardPage() {
              // Authentication logic to get userId...
            
              const transactions = await prisma.transaction.findMany({
                where: { userId: userId },
                include: {
                  category: { // This performs a JOIN
                    select: { name: true } 
                  }
                },
                orderBy: { transactionDate: 'desc' },
                take: 50, // Paginate for performance
              });

              // ... rest of the component
            }
            ```

-   [ ] **1.2: Build the Reusable `TransactionTable` Component**
    -   [ ] Create a new client component file: `src/components/transactions/TransactionTable.tsx`. Mark it with `"use client";` at the top.
    -   [ ] **Use the Fluent 2 `DataGrid` component.** This is much more powerful than a standard `<table>`.
    -   [ ] The component will accept the `transactions` data as a prop.
    -   [ ] **Define the columns for the `DataGrid`:**
        -   `Date`: Format the date nicely (e.g., using `date-fns` library).
        -   `Description`: The transaction description.
        -   `Amount`: Use a helper function `formatCurrency(amount)` to display the amount in a user-friendly format (e.g., `$1,234.56`). Also, apply conditional styling: green for positive amounts (income), default text color for negative (expenses).
        -   `Category`: Display `transaction.category.name`. If the category is null, display "Uncategorized".
    -   [ ] In your `DashboardPage`, import and render this component, passing the fetched `transactions` data to it. `<TransactionTable transactions={transactions} />`.

---

#### **Section 2: Visualizations - Telling the Story with Data**
*The goal is to provide at-a-glance insights using charts. We'll do the heavy data aggregation on the server for maximum performance.*

-   [ ] **2.1: Implement Server-Side Data Aggregation for Charts**
    -   [ ] In a new file, `src/lib/data/getFinancialSummary.ts`, create a server-only function.
    -   [ ] This function will use Prisma's powerful `groupBy` and `aggregate` features to calculate total spending per category.
        ```typescript
        // In src/lib/data/getFinancialSummary.ts
        import { prisma } from '@/lib/prisma';

        export async function getSpendingByCategory(userId: string) {
          const spendingData = await prisma.transaction.groupBy({
            by: ['categoryId'],
            where: { 
              userId: userId,
              amount: { lt: 0 } // Only sum expenses
            },
            _sum: {
              amount: true,
            },
          });
          // This returns raw data. You'll need to join it with category names.
          // ... logic to fetch category names and map the data ...
          return formattedChartData;
        }
        ```

-   [ ] **2.2: Build the Reusable `SpendingDonutChart` Component**
    -   [ ] Install a charting library: `npm install recharts`.
    -   [ ] Create a new client component: `src/components/charts/SpendingDonutChart.tsx` (remember `"use client";`).
    -   [ ] Use `Recharts` components (`PieChart`, `Pie`, `Cell`, `Tooltip`, `Legend`) to build the donut chart.
    -   [ ] The component will accept the aggregated data from step 2.1 as a prop.
    -   [ ] Define an array of `COLORS` and map them to the chart's data cells to make it visually appealing.

-   [ ] **2.3: Integrate the Chart into the Dashboard**
    -   [ ] In your `DashboardPage` (`src/app/(app)/dashboard/page.tsx`), call your new `getSpendingByCategory` function.
    -   [ ] Pass the resulting data as a prop to your `<SpendingDonutChart />` component.
    -   [ ] Use `flexbox` or `grid` to position the chart and the transaction table side-by-side on the dashboard.

---

#### **Section 3: User Control - Building Trust and Accuracy**
*The goal is to empower users to correct the AI's mistakes. This is critical for user trust and long-term engagement. This involves client-side state and server-side mutations.*

-   [ ] **3.1: Implement "Edit Transaction Category" Functionality**
    -   [ ] **Create the API Endpoint for Updates:**
        -   Create a dynamic API route: `src/app/api/transactions/[id]/route.ts`.
        -   Implement a `PATCH` function.
        -   Inside `PATCH`, get the user's session.
        -   Get the transaction `id` from the URL parameters.
        -   Get the new `categoryId` from the request body.
        -   **Security Check:** Before updating, verify that the transaction being updated actually belongs to the logged-in user.
        -   Use `prisma.transaction.update(...)` to change the `categoryId`.
        -   Return the updated transaction.
    -   [ ] **Update the Frontend (`TransactionTable.tsx`):**
        1.  Make the "Category" cell in your `DataGrid` clickable.
        2.  On click, open a Fluent 2 `Popover` or `Dialog`.
        3.  Inside the popover, display a Fluent 2 `ComboBox` (a searchable dropdown).
        4.  Populate this `ComboBox` with a list of the user's *own* categories (this requires another data fetch).
        5.  When the user selects a new category and clicks "Save", call your `PATCH /api/transactions/[id]` endpoint.
        6.  **Handle UI Updates:** Upon a successful API response, you need to refresh the data on the screen. The best way in Next.js is to use the `useRouter` hook:
            ```typescript
            // In TransactionTable.tsx
            import { useRouter } from 'next/navigation';

            const router = useRouter();
            // after successful fetch...
            router.refresh(); 
            // This tells Next.js to re-fetch the server component data and update the UI.
            ```

-   [ ] **3.2: Build the Category Management Page**
    -   [ ] Create a new page: `src/app/(app)/categories/page.tsx`.
    -   [ ] On this page, fetch and display a list of all the user's categories using a `DataGrid`.
    -   [ ] **Implement "Rename" functionality:**
        -   Add a "Rename" button to each row.
        -   On click, open a `Dialog` with an `Input` field pre-filled with the current category name.
        -   On save, call a new `PATCH /api/categories/[id]` endpoint to update the name in the database.
        -   Use `router.refresh()` to update the UI.
    -   [ ] **Implement "Delete" functionality:**
        -   Add a "Delete" button.
        -   On click, open a confirmation `Dialog` ("Are you sure? This will uncategorize X transactions.").
        -   On confirm, call a `DELETE /api/categories/[id]` endpoint.
        -   *Senior Tip: Remember our schema's `ON DELETE SET NULL` rule. This is where it becomes user-facing. Your API will delete the category, and Prisma/Postgres will automatically set the `categoryId` on all related transactions to `null`.*
        -   Use `router.refresh()` to update the UI.

---

### **Definition of Done for Phase 2**

You have successfully completed this phase when:
-   [ ] A logged-in user lands on a `/dashboard` page that displays their 50 most recent transactions in a clear table.
-   [ ] The dashboard also displays a donut chart showing a breakdown of their spending by category.
-   [ ] The user can click on a transaction's category in the table.
-   [ ] A popover appears, allowing them to select a different category from a dropdown of their own categories and save the change.
-   [ ] The UI updates to reflect the change without a full page reload.
-   [ ] The user can navigate to a `/categories` page.
-   [ ] On the categories page, the user can successfully rename and delete their custom categories.