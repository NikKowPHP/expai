
### **Expai: Phase 4 Development Guide (Detailed Edition)**

**Objective:** To prepare the Expai application for a public launch by implementing the monetization strategy, polishing the user experience to a professional standard, and establishing robust testing and monitoring practices.

**Target Developer:** Junior Fullstack Developer
**Desired Outcome:** Senior-Level, Production-Ready, and Commercially Viable Code

**Prerequisites:**
*   Phase 3 is 100% complete. The application is feature-rich with budgeting, gamification, and educational tools.

---

### ✅ **Phase 4 To-Do List: Monetization, Polish & Launch Readiness**

#### **Section 1: The Monetization Engine (The Cash Register)**
*This is the most critical business component. It must be secure, reliable, and perfectly synchronized with our application's state.*

-   [ ] **1.1: Stripe Account and Product Setup**
    -   [ ] Create a Stripe account.
    -   [ ] In the Stripe Dashboard, go to the "Products" section.
    -   [ ] Create two products:
        1.  **Expai Free:** A product with a $0 price. This helps in tracking and potential future promotions.
        2.  **Expai Premium:** A product with two prices attached:
            -   A recurring monthly price (e.g., $12.99/month).
            -   A recurring yearly price (e.g., $99.99/year).
    -   [ ] Save the Price IDs for both the monthly and yearly plans. You will need these in your code.
    -   [ ] Get your Stripe API keys (Publishable Key and Secret Key) and add them to your `.env.local` file.

-   [ ] **1.2: Backend - The Billing API (The Secure Bridge to Stripe)**
    -   [ ] Install the Stripe Node.js library: `npm install stripe`.
    -   [ ] **Create the Checkout Session Endpoint:** `src/app/api/billing/create-checkout-session/route.ts`.
        -   **Implement `POST`:** This function will be called when a user clicks "Upgrade."
        -   **Security:** Get the `userId` from the authenticated session.
        -   **Logic:**
            1.  Initialize the Stripe client with your secret key.
            2.  Retrieve the `stripe_customer_id` from the user's `user_profiles` table. If it doesn't exist, create a new customer on Stripe: `stripe.customers.create(...)` and save the new ID back to your `user_profiles` table. This is a crucial step.
            3.  Create a Stripe Checkout Session using `stripe.checkout.sessions.create(...)`.
            4.  Pass the `customer` ID, the `priceId` from the request body, `mode: 'subscription'`, and the `success_url` / `cancel_url` (e.g., `https://yourapp.com/dashboard?success=true`).
            5.  Return the session URL to the frontend.
    -   [ ] **Create the Stripe Webhook Endpoint:** `src/app/api/billing/webhook/route.ts`.
        *Senior Tip: This is the most critical part of the integration. It is how Stripe tells our app about events that happen outside our system (like a successful payment or a cancellation).*
        -   **Implement `POST`:**
            1.  **Security:** Verify the webhook signature using `stripe.webhooks.constructEvent(...)` and your webhook signing secret. This is a **non-negotiable** security step to prevent forged requests.
            2.  Use a `switch` statement on `event.type` to handle different events.
            3.  **Handle `checkout.session.completed`:** When a user pays for the first time, retrieve the `stripe_customer_id` from the event, find the corresponding `userId` in your database, and update their `user_profiles` table to set `subscription_status = 'premium'`.
            4.  **Handle `customer.subscription.deleted`:** When a user cancels, find their profile and set `subscription_status = 'free'`.
            5.  Return a `200 OK` response to Stripe to acknowledge receipt of the event. If you don't, Stripe will keep retrying.
    -   [ ] **Create the Customer Portal Endpoint:** `src/app/api/billing/create-portal-session/route.ts`.
        -   **Implement `POST`:**
            1.  Get the user's `stripe_customer_id`.
            2.  Use `stripe.billingPortal.sessions.create(...)` to generate a one-time link to the Stripe-hosted billing portal.
            3.  Return this link to the frontend.

-   [ ] **1.3: Frontend - The Billing UI**
    -   [ ] **Create the Pricing Page:** `src/app/(marketing)/pricing/page.tsx`. Display the monthly and yearly plans with "Upgrade" buttons.
    -   [ ] The "Upgrade" button's `onClick` handler will call your `POST /api/billing/create-checkout-session` endpoint and then use `window.location.href` to redirect the user to the returned Stripe Checkout URL.
    -   [ ] **Create a "Manage Subscription" button** on the `/profile` page. This button will call your `POST /api/billing/create-portal-session` endpoint and redirect the user to their Stripe customer portal.

---

#### **Section 2: User Experience Polish (The First Impression)**
*This section focuses on the small details that make an application feel thoughtful and professional.*

-   [ ] **2.1: Implement a "First-Time User" Onboarding Flow**
    -   [ ] **Create the `Welcome` component:** `src/components/onboarding/Welcome.tsx`.
    -   [ ] This component should display a welcoming message and a clear, single Call-to-Action: "Upload Your First Statement to Get Started!".
    -   [ ] **Conditional Rendering Logic:** In your `/dashboard/page.tsx`, fetch a count of the user's transactions (`prisma.transaction.count(...)`). If the count is `0`, render the `<Welcome />` component instead of the normal dashboard content.

-   [ ] **2.2: Implement Premium Feature Gating**
    -   [ ] **Backend Enforcement (Security):**
        -   In your `POST /api/transactions/upload` route, before any processing, fetch the user's profile.
        -   Check if `subscription_status` is `'free'` AND `monthly_uploads_used >= YOUR_LIMIT`.
        -   If true, return a `403 Forbidden` error with a clear JSON message: `{ error: "Upgrade required", message: "You have reached your monthly upload limit." }`.
        -   If the upload is successful for a free user, be sure to increment the `monthly_uploads_used` count in the database.
    -   [ ] **Frontend Nudges (UX):**
        -   Create a React Context or a custom hook (`useSubscription()`) to easily access the user's `subscription_status` on the client side.
        -   In components that gate premium features (e.g., the `CompoundInterestSimulator`), use this hook. If the user is on the free plan, render a "Premium Feature" placeholder with a link to the `/pricing` page instead of the actual tool.
        -   On the upload component, if the user is free and has reached their limit, disable the upload button and show an informative message.

-   [ ] **2.3: Conduct a Full Accessibility (A11y) Audit**
    -   [ ] **Keyboard Navigation:** Go through every single interactive element of the application using only the `Tab` and `Enter` keys. Can you sign up, log in, upload a file, and manage budgets without a mouse? Fix any focus traps or unreachable elements.
    -   [ ] **Semantic HTML & ARIA Roles:** Ensure you are using `h1`, `h2`, `button`, `nav`, etc., correctly. Use ARIA attributes where Fluent 2 doesn't provide them automatically.
    -   [ ] **Color Contrast:** Use a browser extension (like "axe DevTools") to check for any text that has insufficient contrast against its background. Adjust your Tailwind theme colors if necessary.

---

#### **Section 3: Launch Readiness (The Final Checklist)**
*This section ensures the application is stable, performant, and observable before it goes live.*

-   [ ] **3.1: Implement End-to-End (E2E) Testing**
    -   [ ] Install a testing framework: `npm install -D playwright`.
    -   [ ] Configure Playwright for your project.
    -   [ ] **Write test scripts for critical user flows:**
        1.  `auth.spec.ts`: Test the full sign-up -> log out -> log in flow.
        2.  `upload.spec.ts`: Test that a logged-in user can successfully navigate to the upload page, upload a sample CSV file, and see a success message.
        3.  `budget.spec.ts`: Test that a user can create a new budget, see it in a list, and then delete it.
        *Senior Tip: E2E tests are your safety net. They are the only tests that verify the *entire system* is working together as a real user would experience it.*

-   [ ] **3.2: Performance Optimization & Analysis**
    -   [ ] **Bundle Analysis:** Install `@next/bundle-analyzer` and run it. Look for any unexpectedly large libraries being included in your client-side JavaScript bundle. Use dynamic imports (`next/dynamic`) to code-split large components that aren't needed on the initial page load (like complex charts or dialogs).
    -   [ ] **Lighthouse Audit:** Open Chrome DevTools, go to the Lighthouse tab, and run a report on your key pages (homepage, dashboard). Aim for scores of 90+ in Performance, Accessibility, Best Practices, and SEO. Address all the major issues it flags.

-   [ ] **3.3: Integrate Production Monitoring & Error Tracking**
    -   [ ] Create a Sentry account.
    -   [ ] Install the Sentry SDK for Next.js: `npm install @sentry/nextjs`.
    -   [ ] Run the Sentry wizard: `npx @sentry/wizard@latest -i nextjs`. This will automatically configure your project to report errors.
    -   [ ] **Test the integration:** Create a temporary button that, when clicked, throws a deliberate error. Deploy the app and click the button. Verify that the error shows up in your Sentry dashboard with a full stack trace. Remove the test button.
    *Senior Tip: This is your early warning system. You will know about production problems before your users do.*

---

### **Definition of Done for Phase 4**

You have successfully completed this phase when:
-   [ ] A new user can sign up, upgrade to a premium plan via Stripe Checkout, and have their account status correctly updated in the database via a webhook.
-   [ ] A premium user can access the Stripe Customer Portal to manage their subscription.
-   [ ] All freemium limits are enforced on the backend and gracefully handled on the frontend.
-   [ ] The application is fully navigable and usable with only a keyboard.
-   [ ] Your critical E2E tests are passing reliably in your CI/CD pipeline.
-   [ ] Your Lighthouse performance scores are excellent.
-   [ ] You have successfully triggered and received a test error in your Sentry dashboard.
-   [- ] **The application is ready for its first real users.**