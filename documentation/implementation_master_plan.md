
### **Expai: High-Level Development Plan**

This document outlines the phased development plan for the Expai application. Our guiding principle is to write highly maintainable, scalable, and testable code, adhering to a strict separation of concerns and leveraging the strengths of our chosen tech stack.

### **Phase 0: Foundation & Core Infrastructure (The Bedrock)**

*This phase is about setting up a robust, scalable, and developer-friendly environment. We build the house before moving in the furniture. Success in this phase prevents technical debt.*

-   [ ] **Project Initialization & Tooling**
    -   [ ] Initialize **Next.js 15+** project (`app` router) with strict TypeScript configuration.
    -   [ ] Configure ESLint and Prettier with strict rules for code consistency and quality.
    -   [ ] Set up CI/CD pipeline (e.g., GitHub Actions) to automate linting, type-checking, and build validation on every push.

-   [ ] **Backend & Database Setup**
    -   [ ] Initialize **Supabase** project.
    -   [ ] Design the initial database schema (Users, Transactions, Categories, Accounts, Budgets).
    -   [ ] Set up **Prisma** and generate initial schema types from the database structure.
    -   [ ] Configure **Supabase Storage** buckets for raw file uploads.
    -   [ ] Implement initial Row Level Security (RLS) policies in Supabase to ensure users can only access their own data.

-   [ ] **UI Foundation & Component Library**
    -   [ ] Integrate **Microsoft Fluent 2 for Web** and **Tailwind CSS**. Configure Tailwind to work harmoniously with Fluent's design tokens.
    -   [ ] Develop a core `Layout` component (including header, sidebar, main content area) using Fluent 2 controls.
    -   [ ] Set up **Storybook** (or similar) for isolated component development and a living design system.

-   [ ] **Authentication**
    -   [ ] Implement the full user authentication flow using **Supabase Auth**.
        -   [ ] Sign-up, Login, and Logout functionality.
        -   [ ] Password Reset flow.
        -   [ ] Create protected routes and middleware in Next.js to handle authenticated sessions.

### **Phase 1: Core MVP - The AI Data Pipeline**

*This phase delivers the "magic" of Expai. The primary goal is a flawless end-to-end flow from file upload to categorized data in the database.*

-   [ ] **File Upload & Processing**
    -   [ ] Create a robust file upload component in the frontend using Fluent 2, with clear state management for loading, success, and error states.
    -   [ ] Develop the Next.js API route for file ingestion.
        -   [ ] Authenticate request.
        -   [ ] Securely upload the raw file to the Supabase Storage bucket.
        -   [ ] Implement server-side file parsing logic (`pdf-parse`, `papaparse`, etc.) to extract raw text/data.

-   [ ] **AI Service Integration**
    -   [ ] Create an abstracted `AIService` module (`/services/aiService.ts`) to handle all communication with **Gemini/OpenRouter**. This decouples our app from the specific AI provider API.
    -   [ ] Implement the "Categorization" function within the `AIService` that sends transaction data and receives structured, categorized results.
    -   [ ] Implement the "Deduplication" logic within the backend, cross-referencing incoming transactions with existing data in the DB before insertion.

-   [ ] **Data Persistence**
    -   [ ] Create an abstracted `DatabaseService` module (`/services/dbService.ts`) to handle all Prisma queries.
    -   [ ] Develop the logic in the API route to take the AI's output and persist it to the Supabase database via the `DatabaseService`.

-   [ ] **Testing**
    -   [ ] Write unit tests for individual services (AI, DB).
    -   [ ] Write a comprehensive integration test for the entire file upload API route.

### **Phase 2: Data Presentation & User Interaction**

*With data in the system, this phase focuses on making it visible, useful, and interactive for the user.*

-   [ ] **Dashboard Development**
    -   [ ] Build the main dashboard page to display key financial summaries.
    -   [ ] Create an interactive, sortable, and filterable `TransactionTable` component using Fluent 2.

-   [ ] **Visualizations**
    -   [ ] Integrate a charting library (e.g., Recharts, Chart.js) compatible with React.
    -   [ ] Develop reusable chart components:
        -   [ ] `SpendingByCategoryDonutChart`
        -   [ ] `IncomeVsExpenseBarChart`
        -   [ ] `NetWorthTrendLineChart`

-   [ ] **User Control & Management**
    -   [ ] Implement functionality for users to manually edit a transaction's category.
    -   [ ] Build a "Categories" management page where users can rename, merge, or delete categories suggested by the AI.

### **Phase 3: Engagement & Financial Strategy Engine**

*This phase transforms Expai from a passive tracker into an active financial coach.*

-   [ ] **Budgeting Module**
    -   [ ] Develop the UI for creating and managing budgets (e.g., based on the 50/30/20 rule).
    -   [ ] Implement interactive progress bars for budget categories on the dashboard.
    -   [ ] Create API endpoints for all budget-related CRUD operations.

-   [ ] **Gamification Engine**
    -   [ ] Design and implement the backend logic for awarding achievements and tracking quests.
    -   [ ] Develop the algorithm for calculating the `FinancialHealthScore`.
    -   [ ] Create UI components to display badges, quests, and the score.

-   [ ] **"Science of Money" Features**
    -   [ ] Build the `CompoundEffectSimulator` as an interactive component.
    -   [ ] Implement AI-driven insights and tips that appear contextually within the UI.

### **Phase 4: Monetization, Polish & Launch Readiness**

*This phase prepares the application for public launch by integrating the business model and refining the user experience.*

-   [ ] **Subscription & Monetization**
    -   [ ] Integrate a payment provider (e.g., Stripe) for subscription management.
    -   [ ] Implement webhooks to sync subscription status with our Supabase database.
    -   [ ] Build the "Premium Feature Gating" logic to lock/unlock features based on user subscription status.
    -   [ ] Develop the UI for the pricing page and upgrade/downgrade flows.

-   [ ] **User Experience Refinement**
    -   [ ] Create a smooth and intuitive user onboarding flow.
    -   [ ] Conduct a full accessibility audit (A11y).
    -   [ ] Performance optimization: analyze bundle sizes, optimize images, and ensure fast load times (Lighthouse scores).

-   [ ] **Final Testing**
    -   [ ] Implement End-to-End (E2E) tests for critical user flows using Cypress or Playwright (e.g., Sign-up -> Upload -> View Dashboard -> Upgrade to Premium).

### **Post-Launch & Continuous Improvement**

-   [ ] **Monitoring & Maintenance**
    -   [ ] Integrate application monitoring and error tracking (e.g., Sentry, Vercel Analytics).
    -   [ ] Establish a process for regular maintenance and dependency updates.
-   [ ] **Feature Backlog**
    -   [ ] Begin planning for the **Ethical Marketplace** feature.
    -   [ ] Scope out the architecture for the **Expai for Work (B2B)** portal.