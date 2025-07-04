### **Expai: Phase 4 Development Guide (AI-Ready)**

**Legend:**

- `[x]` = Task is complete.
- `[ ]` = Task is pending for Developer AI.
- `[HUMAN]` = Task must be performed by a human operator.

---

### ✅ **Phase 4 To-Do List: Monetization, Polish & Launch Readiness**

#### **Section 1: The Monetization Engine (The Cash Register)**

- [HUMAN] **1.1: Stripe Account and Product Setup**

  - (Reason: Requires creating an external account, handling sensitive API keys, and configuring products in a web UI.)
  - [HUMAN] Create a Stripe account.
  - [HUMAN] In the Stripe Dashboard, create "Expai Free" and "Expai Premium" products with monthly/yearly prices.
  - [HUMAN] Save the Price IDs and API keys to your `.env.local` file.

- [x] **1.2: Backend - The Billing API (The Secure Bridge to Stripe)**

  - [x] Install the Stripe Node.js library: `npm install stripe`.
  - [x] Create the checkout session endpoint at `src/app/api/billing/create-checkout-session/route.ts`.
    - In the `POST` function, get the `userId`.
    - Fetch the user's `stripe_customer_id` from `user_profiles`. If it's null, create a new customer on Stripe (`stripe.customers.create`) and save the ID back to the user's profile.
    - Create and return a Stripe Checkout Session URL.
  - [x] Create the Stripe Webhook endpoint at `src/app/api/billing/webhook/route.ts`.
    - In the `POST` function, verify the webhook signature using `stripe.webhooks.constructEvent`.
    - Implement a `switch` statement for `event.type`.
    - Handle `checkout.session.completed` to update the user's `subscription_status` to `'premium'`.
    - Handle `customer.subscription.deleted` to update the status to `'free'`.
    - Return a `200 OK` response.
  - [x] Create the customer portal endpoint at `src/app/api/billing/create-portal-session/route.ts`.
    - In the `POST` function, get the user's `stripe_customer_id`.
    - Create and return a `stripe.billingPortal.sessions` link.

- [x] **1.3: Frontend - The Billing UI**
  - [x] Create the pricing page at `src/app/(app)/pricing/page.tsx`. It should display monthly/yearly plans.
  - [x] The "Upgrade" button's `onClick` handler should call the `create-checkout-session` API and redirect the user to the Stripe URL.
  - [x] On the `/profile` page, add a "Manage Subscription" button that calls the `create-portal-session` API and redirects the user.

#### **Section 2: User Experience Polish (The First Impression)**

- [x] **2.1: Implement a "First-Time User" Onboarding Flow"

  - [x] Create a client component `src/components/onboarding/Welcome.tsx`.
  - [x] The `Welcome` component should display a message and a CTA to "Upload Your First Statement".
  - [x] Modify the `dashboard/page.tsx`. Fetch the user's transaction count. If the count is `0`, render the `<Welcome />` component instead of the main dashboard content.

- [ ] **2.2: Implement Premium Feature Gating**

  - [x] **Backend Enforcement:** In `api/transactions/upload/route.ts`, before processing, fetch the user's profile. Check if their `subscription_status` is `'free'` and `monthly_uploads_used >= 2`. If so, return a `403 Forbidden` error. If the upload succeeds for a free user, increment `monthly_uploads_used`.
  - [x] **Frontend Nudges:** Create a React Context hook `useSubscription()` that provides the user's status. In premium-only components (like `CompoundInterestSimulator`), use this hook to render a placeholder with an "Upgrade" link for free users.

- [HUMAN] **2.3: Conduct a Full Accessibility (A11y) Audit**
  - (Reason: Requires subjective user experience testing and manual interaction that the AI cannot perform.)
  - [HUMAN] Navigate the entire app using only the `Tab` and `Enter` keys.
  - [HUMAN] Use a browser extension like "axe DevTools" to find and fix color contrast issues.

#### **Section 3: Launch Readiness (The Final Checklist)**

- [ ] **3.1: Implement End-to-End (E2E) Testing**

  - [x] Install Playwright: `npm install -D playwright`.
  - [x] Create `playwright.config.ts`.
  - [x] Create E2E test file `e2e/auth.spec.ts`. Write a test for the full sign-up -> log in flow.
  - [x] Create E2E test file `e2e/upload.spec.ts`. Write a test for a logged-in user uploading a file.

- [HUMAN] **3.2: Performance Optimization & Analysis**

  - (Reason: Requires running external tools, interpreting results, and making subjective optimization choices.)
  - [HUMAN] Install and run `@next/bundle-analyzer` to look for large libraries.
  - [HUMAN] Run a Lighthouse audit in Chrome DevTools and address its recommendations.

- [ ] **3.3: Integrate Production Monitoring & Error Tracking**
  - [ ] Create a Sentry account and get the DSN key.
  - [ ] Install the Sentry SDK: `npm install @sentry/nextjs`.
  - [ ] Run the Sentry wizard `npx @sentry/wizard@latest -i nextjs` to automatically configure the project.
  - [HUMAN] Deploy the app and trigger a test error to verify that it appears in the Sentry dashboard.
