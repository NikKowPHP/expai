### **Expai: Phase 0 Development Guide**

**Objective:** To build the foundational bedrock of the Expai application. Every task in this phase is critical for long-term maintainability, scalability, and developer efficiency. We are not building features yet; we are building a professional-grade workshop where we *can* build features.

**Target Developer:** Junior Fullstack Developer
**Desired Outcome:** Senior-Level Code & Infrastructure

**Prerequisites:**
*   Node.js (LTS version) and npm/pnpm/yarn installed.
*   A code editor (VS Code is recommended).
*   A GitHub account.
*   Basic understanding of Git, React, and TypeScript.

---

### ✅ **Phase 0 To-Do List: Foundation & Core Infrastructure**

#### **Section 1: Project Initialization & Tooling**
*The goal here is to create a project that enforces quality and consistency from the very first line of code. Automation is key.*

-   [x] **1.1: Initialize a Strict, Modern Next.js Project**
    -   [x] In your terminal, run `npx create-next-app@latest` to initialize the project.
    -   [x] **Select the following options during setup:**
        -   Use TypeScript: **Yes**
        -   Use ESLint: **Yes**
        -   Use Tailwind CSS: **Yes**
        -   Use `src/` directory: **Yes**
        -   Use App Router: **Yes**
        -   Import alias: Leave as `@/*`
    -   [x] Once created, `cd` into the project directory and run `npm install` to ensure all dependencies are present.
    -   [x] Create a `.nvmrc` file in the root and add the current LTS version of Node.js (e.g., `v20.10.0`) to ensure consistent environments.

-   [ ] **1.2: Configure Professional-Grade Linting and Formatting**
    -   [ ] **Install additional ESLint plugins:**
        ```bash
        npm install -D eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react-hooks @typescript-eslint/eslint-plugin
        ```
    -   [ ] **Configure `.eslintrc.json`:** Update the configuration to include stricter rules for import sorting, accessibility, and React hooks. This prevents common errors and keeps the code clean.
        *Senior Tip: A well-configured linter is like a constant code review partner.*
    -   [ ] **Configure Prettier:** Create a `.prettierrc` file in the root. Define your team's formatting rules (e.g., `semi: true`, `singleQuote: true`, `trailingComma: "es5"`). This eliminates all formatting debates.
    -   [ ] **Update `package.json` scripts:** Add scripts for easy access.
        ```json
        "scripts": {
          "dev": "next dev",
          "build": "next build",
          "start": "next start",
          "lint": "next lint",
          "format": "prettier --write \"**/*.{js,jsx,ts,tsx,md,json}\"",
          "typecheck": "tsc --noEmit"
        }
        ```

-   [ ] **1.3: Set Up a Git Repository and CI/CD Pipeline**
    -   [ ] Run `git init` in the project root.
    -   [ ] Create a `.gitignore` file (Next.js should provide a good default). Add `.env.local` to it.
    -   [ ] Create a new repository on GitHub and push your initial commit.
    -   [ ] **Create a CI (Continuous Integration) workflow:**
        -   [ ] Create the directory structure: `.github/workflows/`.
        -   [ ] Inside, create a new file named `ci.yml`.
        -   [ ] Configure the YAML file to run on every push to the `main` branch. It must perform the following jobs:
            1.  Check out the code.
            2.  Install dependencies using `npm ci` (which is faster and safer than `npm install` for CI environments).
            3.  Run the linter (`npm run lint`).
            4.  Run the type-checker (`npm run typecheck`).
            5.  Run the build command (`npm run build`).
        *Senior Tip: If the pipeline fails, the code is not ready to be merged. This is our quality gate.*

---

#### **Section 2: Backend & Database Setup**
*The goal is to connect our app to a secure and reliable data source. We will use Prisma for type-safe database access, which eliminates a whole class of runtime errors.*

-   [ ] **2.1: Initialize Supabase Project**
    -   [ ] Go to [supabase.com](https://supabase.com), create an account, and start a new project.
    -   [ ] Save your **Project URL** and **`anon` key**.
    -   [ ] Create a `.env.local` file in your project root (this file is git-ignored). Add your Supabase credentials there:
        ```
        NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
        DATABASE_URL=YOUR_SUPABASE_CONNECTION_STRING_FOR_PRISMA
        ```
        *(Find the `DATABASE_URL` in Supabase -> Project Settings -> Database -> Connection string).*

-   [ ] **2.2: Implement the Database Schema with Prisma**
    -   [ ] Install Prisma: `npm install -D prisma`.
    -   [ ] Initialize Prisma: `npx prisma init`. This creates a `prisma/schema.prisma` file.
    -   [ ] **Copy the complete, final Prisma schema** (from our previous documentation) into your `prisma/schema.prisma` file.
    -   [ ] Push the schema to your Supabase database: `npx prisma db push`. This will create all the tables, columns, and relations defined in your schema.
    -   [ ] Generate the Prisma Client: `npx prisma generate`. You must run this command every time you change the schema.

-   [ ] **2.3: Implement Row Level Security (RLS)**
    *This is a non-negotiable security step. It ensures that even if a user bypasses the application logic, they can NEVER access another user's data from the database.*
    -   [ ] In the Supabase Dashboard, go to "SQL Editor".
    -   [ ] For **every table** that contains user data (`user_profiles`, `accounts`, `categories`, `transactions`, etc.), run a query to enable RLS. Example for `accounts`:
        ```sql
        -- 1. Enable RLS on the table
        ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

        -- 2. Create a policy that allows users to access only their own accounts
        CREATE POLICY "Users can view their own accounts"
        ON accounts FOR SELECT
        USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own accounts"
        ON accounts FOR INSERT
        WITH CHECK (auth.uid() = user_id);

        -- (Repeat for UPDATE and DELETE)
        ```
    -   [ ] Repeat this process for all user-specific tables.

---

#### **Section 3: UI Foundation**
*The goal is to set up our design system and core layout components. This ensures a consistent look and feel across the entire application.*

-   [ ] **3.1: Integrate Microsoft Fluent 2 and Configure Tailwind CSS**
    -   [ ] Install the Fluent 2 React library: `npm install @fluentui/react-components`.
    -   [ ] Configure the `tailwind.config.ts` file to ensure it co-exists with Fluent 2 without conflicts.
    -   [ ] Set up the `FluentProvider` at the root of your application (in `src/app/layout.tsx`) to provide the theme to all child components.

-   [ ] **3.2: Develop the Core `AppLayout` Component**
    -   [ ] Create a new component at `src/components/layout/AppLayout.tsx`.
    -   [ ] This component will be responsible for the main application structure: a persistent sidebar for navigation and a main content area.
    -   [ ] Use Fluent 2 components (`Splitter`, `Nav`, `Card`, etc.) to build this structure.
    -   [ ] This component will wrap the `children` prop, so it can be used in your `layout.tsx` files to provide a consistent frame for all pages.

---

#### **Section 4: Authentication**
*The goal is to create a secure and seamless authentication experience. We will abstract the logic away from the UI components.*

-   [ ] **4.1: Create an Abstracted Supabase Client**
    -   [ ] Create a helper file at `src/lib/supabase/client.ts`.
    -   [ ] In this file, initialize and export a singleton instance of the Supabase client using the environment variables. This ensures we don't create multiple connections.

-   [ ] **4.2: Implement Authentication Pages**
    -   [ ] Create the file structure for auth pages: `src/app/(auth)/login/page.tsx` and `src/app/(auth)/signup/page.tsx`.
    -   [ ] Build the UI for the login and sign-up forms using Fluent 2 components (`Input`, `Button`, etc.).

-   [ ] **4.3: Implement Authentication Logic**
    -   [ ] Write the "handler" functions for sign-up and login. These functions will take email/password, call the Supabase client's `signUp` or `signInWithPassword` methods, and handle success or error states.
        *Senior Tip: Keep this logic separate from the UI components. The component should only call the handler and react to the result.*

-   [ ] **4.4: Implement Protected Routes using Middleware**
    -   [ ] Create a `middleware.ts` file in your `src/` directory.
    -   [ ] In this middleware, check for the user's session cookie.
    -   [ ] If the user is trying to access a protected page (e.g., `/dashboard`) and is not logged in, redirect them to the `/login` page.
    -   [ ] If the user is logged in and tries to access `/login`, redirect them to the `/dashboard`.

---

### **Definition of Done for Phase 0**

You have successfully completed this phase when:
-   [ ] The CI pipeline on GitHub passes successfully for `lint`, `typecheck`, and `build`.
-   [ ] You can successfully sign up for a new account.
-   [ ] You can log in and log out.
-   [ ] Attempting to access the (not yet created) `/dashboard` page while logged out redirects you to `/login`.
-   [ ] All tables exist in the Supabase database and have RLS enabled.
-   [ ] You feel confident that the project is clean, secure, and ready for feature development.
