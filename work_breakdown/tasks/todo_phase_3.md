### **Expai: Phase 3 Development Guide (AI-Ready)**

**Legend:**

- `[x]` = Task is complete.
- `[ ]` = Task is pending for Developer AI.
- `[HUMAN]` = Task must be performed by a human operator.

---

### ✅ **Phase 3 To-Do List: Engagement & Financial Strategy Engine**

#### **Section 1: The Budgeting Module (The Control Center)**

- [x] **1.1: Backend - The Budgeting API**
- [x] **1.2: Frontend - The Budget Management Page**
- [x] **1.3: The `BudgetProgress` Component (The Gauge)**

#### **Section 2: The Gamification Engine (The Motivator)**

- [x] **2.1: Seed the Static Achievement Data**
- [x] **2.2: Implement the `GamificationService`**
- [x] **2.3: Build the UI for Achievements (The Trophy Case)**
  - [x] Create the page file `src/app/(app)/profile/page.tsx`. This should be a server component.
  - [x] In `profile/page.tsx`, fetch all possible achievements from the `achievements` table and the user's earned achievements from `user_achievements`.
  - [x] Create the client component `src/components/gamification/Badge.tsx`. It should accept props for `name`, `description`, and `isUnlocked`.
  - [x] In `Badge.tsx`, render a full-color, vibrant component if `isUnlocked` is true, and a grayscale, semi-transparent version if false.
  - [x] In `profile/page.tsx`, map over the full list of achievements and render a `Badge` component for each, passing the correct `isUnlocked` status.

#### **Section 3: The "Science of Money" Features (The Mentor)**

- [x] **3.1: Implement the Compound Interest Simulator (The Crystal Ball)**

  - [x] Create the client component file `src/components/tools/CompoundInterestSimulator.tsx`.
  - [x] In the component, use `useState` to manage `initialAmount`, `monthlyContribution`, `interestRate`, and `years`.
  - [x] Use Fluent 2 `Slider` components for each of the state variables.
  - [x] Add a `useEffect` hook that recalculates the investment growth whenever a slider's value changes.
  - [x] Install `recharts` if not present: `npm install recharts`.
  - [x] Use `Recharts` to render a `LineChart` based on the calculated data.

- [ ] **3.2: Implement "Needs vs. Wants" (The Reality Check)**
  - [x] Update the `Category` model in `prisma/schema.prisma` to add `type String @default("want")`.
  - [x] Run `npx prisma generate` to update the client.
  - [HUMAN] Run `npx prisma db push` to apply the schema change to the database.
  - [x] Update the API route `src/app/api/categories/[id]/route.ts`. Modify the `PATCH` function to also accept and update the `type` field.
  - [x] Update the `CategoryTable.tsx` component. In each row, add a Fluent 2 `Dropdown` to allow users to set the category's `type` to "Need", "Want", or "Saving/Investment".
  - [ ] Create a new data aggregation function `getSpendingBreakdown` in `src/lib/data/getFinancialSummary.ts`. It should use Prisma's `groupBy` on `category.type` to sum spending for each type.
  - [ ] Create a new client component `src/components/charts/SpendingBreakdownPieChart.tsx` that uses `Recharts` to display the Needs vs. Wants data.
  - [ ] In `dashboard/page.tsx`, call `getSpendingBreakdown` and render the new pie chart.
