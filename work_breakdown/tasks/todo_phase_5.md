### **Expai: Phase 5 Development Guide (AI-Ready)**

**Legend:**
- `[x]` = Task is complete.
- `[ ]` = Task is pending for Developer AI.
- `[HUMAN]` = Task must be performed by a human operator.

---

### ✅ **Phase 5 Tasks & Processes: Operation, Iteration & Growth**

#### **Section 1: Observation & Learning (The Listening Post)**
-   [HUMAN] **1.1: Establish Formal User Feedback Channels**
    -   (Reason: Requires setting up external services, email addresses, and human processes.)
    -   [HUMAN] Integrate a feedback tool like Canny.io or a simple `mailto:` link.
    -   [HUMAN] Set up and monitor a support email address.

-   [HUMAN] **1.2: Implement Privacy-Focused Product Analytics**
    -   (Reason: Requires choosing and configuring an external analytics tool and defining business-specific funnels.)
    -   [HUMAN] Choose and integrate a tool like PostHog or Vercel Analytics.
    -   [HUMAN] Define and track key events to build a user funnel dashboard.

#### **Section 2: Iteration & Refinement (The Workshop)**
-   [HUMAN] **2.1: Establish a Formal Triage & Development Process**
    -   (Reason: A purely human process involving project management and team meetings.)
    -   [HUMAN] Adopt a tool like Linear or GitHub Issues.
    -   [HUMAN] Hold weekly meetings to triage and prioritize tasks.

-   [HUMAN] **2.2: Implement A/B Testing for Key Funnels**
    -   (Reason: Involves forming business hypotheses and analyzing statistical results.)
    -   [HUMAN] Choose and configure an A/B testing framework.
    -   [HUMAN] Form a hypothesis and run your first experiment.

-   [HUMAN] **2.3: Continuous Performance Monitoring**
    -   (Reason: Requires interpreting reports from external dashboards.)
    -   [HUMAN] Regularly check Vercel Real Experience Score.
    -   [HUMAN] Review the Supabase "Query Performance" report and add database indexes as needed.

#### **Section 3: Strategic Growth (The Engine of Expansion)**
-   [ ] **3.1: Build the Ethical Marketplace (Secondary Revenue Stream)**
    -   [HUMAN] Research and form affiliate partnerships.
    -   [x] Create an "Opportunity Finder" service in `src/lib/services/opportunityService.ts`. This AI-driven service will scan a user's latest transaction data for optimization opportunities (e.g., high credit card interest).
    -   [x] Create frontend components to present the insight first (e.g., "You could save $X...") with a button to reveal the curated affiliate offer.

-   [ ] **3.2: Develop "Expai for Work" (B2B Expansion)**
    -   [ ] **Phase 5a: Foundational B2B Schema & Admin Portal**
        -   [x] Extend the `prisma/schema.prisma` to include `Organization` and `OrganizationMember` models.
        -   [HUMAN] Run `npx prisma db push` to apply the schema changes.
        -   [x] Build a new set of pages under `src/app/(b2b)/admin` for an organization admin dashboard.
        -   [x] Implement a user invitation flow (e.g., an admin enters an email, and a new user can sign up and be automatically linked to the organization).
    -   [ ] **Phase 5b: Anonymized Reporting**
        -   [x] Create secure API endpoints that provide *aggregated and anonymized* data for an organization (e.g., average savings rate). Ensure it's impossible to trace back to an individual.
        -   [ ] Build data visualizations for the B2B admin dashboard that display these anonymous insights.

#### **Section 4: Technical Excellence & Maintenance (Foundation Care)**
-   [HUMAN] **4.1: Schedule Regular Maintenance Sprints/Days**
    -   (Reason: A team process.)
    -   [HUMAN] Use `npm-check-updates` to review and update dependencies.
    -   [HUMAN] Dedicate time to refactoring and paying down technical debt.

-   [x] **4.2: Enhance Documentation**
    -   [x] Update the project's `README.md` to reflect the current state of the project setup.
    -   [x] Create an `ADR` (Architectural Decision Record) directory in `/documentation/adr`.
    -   [x] Add a new file, `001-choice-of-sentry.md`, explaining the decision to use Sentry for error tracking.
