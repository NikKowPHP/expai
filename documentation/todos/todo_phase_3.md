### **Expai: Phase 3 Development Guide (Detailed Edition)**

**Objective:** To evolve Expai from a passive data viewer into a proactive, engaging, and educational financial partner. This phase is about building the systems that create "stickiness" and provide tangible, long-term value to the user.

**Target Developer:** Junior Fullstack Developer
**Desired Outcome:** Senior-Level, Feature-Rich, and Engaging Code

**Prerequisites:**
*   Phase 2 is 100% complete. The user-facing data presentation layer is functional and robust.

---

### ✅ **Phase 3 To-Do List: Engagement & Financial Strategy Engine**

#### **Section 1: The Budgeting Module (The Control Center)**
*This feature provides users with direct control over their spending goals. It requires a full CRUD (Create, Read, Update, Delete) implementation.*

-   [ ] **1.1: Backend - The Budgeting API (The Rules Engine)**
    -   [ ] **Create the collection endpoint:** `src/app/api/budgets/route.ts`.
        -   **Implement `POST /api/budgets`:**
            -   This function will handle the creation of new budgets.
            -   **Security:** Get the `userId` from the authenticated session. If no user, return 401.
            -   **Validation (using Zod):** Parse and validate the request body. It must contain `categoryId: string`, `amount: number` (must be positive), `startDate: string` (ISO date), `endDate: string` (ISO date).
            -   **Logic:** Use `prisma.budget.create({ data: { ... } })`, passing in the validated data along with the `userId`.
            -   Return a `201 Created` status with the newly created budget object.
    -   [ ] **Create the individual item endpoint:** `src/app/api/budgets/[id]/route.ts`.
        -   **Implement `PATCH /api/budgets/[id]`:**
            -   **Security:** Get `userId`. Get `budgetId` from the URL params.
            -   **Logic:** Use `prisma.budget.update({ where: { id: budgetId, userId: userId }, data: { ... } })`. *Senior Tip: Including `userId` in the `where` clause is a critical security measure. It prevents a user from accidentally (or maliciously) updating another user's budget, even if they guess the ID.*
            -   Return the updated budget.
        -   **Implement `DELETE /api/budgets/[id]`:**
            -   **Security:** Same as PATCH.
            -   **Logic:** Use `prisma.budget.delete({ where: { id: budgetId, userId: userId } })`.
            -   Return a `204 No Content` status on success.

-   [ ] **1.2: Frontend - The Budget Management Page (The Cockpit)**
    -   [ ] **Create the page:** `src/app/(app)/budgets/page.tsx`.
    -   [ ] **Data Fetching (Server Component):**
        -   Fetch all of the user's categories (`prisma.category.findMany(...)`).
        -   Fetch all of the user's existing budgets (`prisma.budget.findMany(...)`).
    -   [ ] **Create the "Create Budget" Client Component:** `src/components/budgets/CreateBudgetForm.tsx`.
        -   **Props:** It will accept the `categories` list as a prop.
        -   **UI:** Use Fluent 2 components: `ComboBox` for categories, `Input` with `type="number"` for amount, `DatePicker` for dates.
        -   **State:** Manage form state with `useState`.
        -   **Logic:** The `onSubmit` handler will call the `POST /api/budgets` endpoint. On success, it should clear the form and call `router.refresh()` to show the new budget in the list below.
    -   [ ] **Create the "Budget List" Client Component:** `src/components/budgets/BudgetList.tsx`.
        -   **Props:** It will accept the `budgets` list.
        -   **UI:** Use a `DataGrid` or a custom list to display each budget.
        -   **Interactivity:** Include "Edit" and "Delete" buttons on each row. These will trigger dialogs that call the `PATCH` and `DELETE` API endpoints respectively, followed by `router.refresh()`.

-   [ ] **1.3: The `BudgetProgress` Component (The Gauge)**
    -   [ ] **Create the data aggregation function:** In a server-only file (`src/lib/data/getBudgetSummary.ts`), create a function that takes a `userId`. This function will:
        1.  Fetch all active budgets.
        2.  For each budget, run a separate `prisma.transaction.aggregate` query to sum the expenses for that category within that budget's date range.
        3.  Return an array of objects, where each object contains the budget details *and* the `totalSpent` amount.
    -   [ ] **Create the client component:** `src/components/budgets/BudgetProgress.tsx`.
        -   **Props:** It will accept the enhanced budget object (with `totalSpent`) from the step above.
        -   **Logic:** Perform the simple calculation: `const progress = (totalSpent / budget.amount) * 100;`.
        -   **UI:** Use a Fluent 2 `ProgressBar` with conditional styling (e.g., `intent="error"` if `progress > 90`). Display clear text labels like "`$850 / $1000 spent`".
    -   [ ] **Integrate into Dashboard:** In `/dashboard/page.tsx`, call your new `getBudgetSummary` function and pass the data down to a list of `BudgetProgress` components.

---

#### **Section 2: The Gamification Engine (The Motivator)**
*This section makes finance feel less like a chore and more like a game of personal improvement.*

-   [ ] **2.1: Seed the Static Achievement Data**
    -   [ ] Create a file: `prisma/seed.ts`.
    -   [ ] In this script, use `prisma.achievement.upsert` to define the master list of all possible achievements. This ensures that the `achievements` table is always populated with the correct, static data when you set up a new environment.
    -   [ ] Add the `db seed` command to your `package.json`.

-   [ ] **2.2: Implement the `GamificationService` (The Rulebook)**
    -   [ ] Create `src/lib/services/gamificationService.ts`.
    -   [ ] **Create `checkAndAwardAchievement(userId, achievementName)`:** This function will prevent duplicate awards. It first checks the `user_achievements` table. If the user doesn't have the achievement, it grants it.
    -   [ ] **Create `runAllChecks(userId)`:** This orchestrator function will contain the logic for when to award achievements.
        -   **Logic for "First Upload":** `const transactionCount = await prisma.transaction.count({ where: { userId } }); if (transactionCount > 0) await checkAndAwardAchievement(userId, 'First Upload');`
        -   **Logic for "Budget Creator":** `const budgetCount = await prisma.budget.count({ where: { userId } }); if (budgetCount > 0) await checkAndAwardAchievement(userId, 'Budget Creator');`
        -   **Logic for "Category Customizer":** Check if the user has renamed or created a category. This is more complex and might require adding a flag like `is_user_created` to the `categories` table.
    -   **Trigger the service:** In the `POST /api/transactions/upload` route, after a successful data save, add `await runAllChecks(userId);`. Do the same in the `POST /api/budgets` route.

-   [ ] **2.3: Build the UI for Achievements (The Trophy Case)**
    -   [ ] **Create the page:** `src/app/(app)/profile/page.tsx`.
    -   [ ] **Data Fetching:** Fetch two lists in parallel: `prisma.achievement.findMany()` (all possible) and `prisma.userAchievement.findMany({ where: { userId } })` (only the user's).
    -   [ ] **Data Transformation:** On the server, create a map or set of the user's earned achievement IDs for quick lookups (`const earnedIds = new Set(userAchievements.map(a => a.achievementId));`).
    -   [ ] **Create the `Badge` client component:** `src/components/gamification/Badge.tsx`.
    -   **Props:** `name`, `description`, `iconName`, `isUnlocked`.
    -   **UI:** Render a full-color, vibrant component if `isUnlocked` is true. Render a grayscale, semi-transparent version if false. Add a `Tooltip` to show the description on hover.
    -   **Render the list:** In the profile page, map over the *full* list of achievements and render a `Badge` for each one, passing `isUnlocked: earnedIds.has(achievement.id)`.

---

#### **Section 3: The "Science of Money" Features (The Mentor)**
*These are interactive tools that teach powerful financial concepts in a tangible way.*

-   [ ] **3.1: Implement the Compound Interest Simulator (The Crystal Ball)**
    -   [ ] **Create the client component:** `src/components/tools/CompoundInterestSimulator.tsx`.
    -   [ ] **State Management (`useState`):**
        -   `initialAmount`, `monthlyContribution`, `interestRate`, `years`.
        -   `chartData`: An array of `{ year: number, value: number }`.
    -   [ ] **UI:** Use Fluent 2 `Slider` components for each variable. Sliders provide a much more interactive "play" experience than simple inputs.
    -   **Calculation Logic:** Create a `useEffect` hook that watches for changes in any of the input state variables.
        -   Inside the `useEffect`, run the compound interest calculation loop year by year.
        -   Update the `chartData` state with the new results.
    -   **Visualization:** Use `Recharts` to render a `LineChart` that uses `chartData` as its data source. The chart will automatically and smoothly re-render whenever the `useEffect` updates the state.

-   [ ] **3.2: Implement "Needs vs. Wants" (The Reality Check)**
    -   [ ] **Update the Category Management UI:** On the `/categories` page, add a `Dropdown` or `ComboBox` to each category row.
        -   **Options:** "Need," "Want," "Saving/Investment."
        -   **Logic:** The `onChange` event for this dropdown should call your existing `PATCH /api/categories/[id]` endpoint, updating the `type` field for that category.
    -   [ ] **Create the Data Aggregation Function:** `src/lib/data/getSpendingBreakdown.ts`.
        -   This server-side function will take a `userId`.
        -   It will perform a query that joins `transactions` with `categories` and then uses `groupBy('category.type')` to `_sum` the `amount` for each type.
    -   [ ] **Build the `SpendingBreakdownPieChart` component:**
        -   A client component that takes the aggregated data as a prop.
        -   Uses `Recharts` to display a clear `PieChart` showing the percentage and total amount for Needs, Wants, and Savings.
    -   **Integrate into Dashboard:** Call `getSpendingBreakdown` in `/dashboard/page.tsx` and pass the data to your new pie chart component.

---

### **Definition of Done for Phase 3**

You have successfully completed this phase when:
-   [ ] The entire budgeting CRUD lifecycle is functional and intuitive.
-   [ ] The dashboard accurately reflects budget progress in near real-time.
-   [ ] The system automatically awards at least two different types of achievements based on user actions.
-   [ ] The user's profile page serves as a "trophy case," clearly distinguishing between locked and unlocked achievements.
-   [ ] The Compound Interest Simulator is a fully interactive, client-side tool.
-   [ ] Users can classify their spending, and the dashboard provides a clear visual breakdown of their "Needs vs. Wants."