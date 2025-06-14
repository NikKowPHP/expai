
### **Expai: Phase 5 Development Guide (Ongoing)**

**Objective:** To transition from a "build and launch" mindset to a sustainable "operate, iterate, and grow" cycle. This phase focuses on leveraging user feedback and data to drive product improvements, expand the business, and ensure long-term technical health.

**Target:** The Core Development Team
**Desired Outcome:** A Data-Informed, User-Centric, and Commercially Growing Product

**Prerequisites:**
*   Phase 4 is complete. The application is live, processing payments, and has its first real users. Monitoring and error tracking are active.

---

### ✅ **Phase 5 Tasks & Processes: Operation, Iteration & Growth**

#### **Section 1: Observation & Learning (The Listening Post)**
*The goal is to establish robust channels for both qualitative (user feedback) and quantitative (analytics) data. We must understand *what* users are doing and *why* they are doing it.*

-   [ ] **1.1: Establish Formal User Feedback Channels**
    -   [ ] **In-App Feedback Widget:** Integrate a simple, non-intrusive feedback tool (e.g., Canny.io, a simple "Feedback" button that opens a `mailto:` link, or a custom form). This provides a direct line from users experiencing issues or having ideas.
    -   [ ] **Set Up a Support Process:** Create a dedicated support email (e.g., `support@expai.app`) and a process for triaging and responding to user inquiries.

-   [ ] **1.2: Implement Privacy-Focused Product Analytics**
    *Senior Tip: We must measure user behavior to make informed decisions, but we must do so while respecting our core promise of user privacy.*
    -   [ ] **Choose a Tool:** Select and integrate a privacy-first analytics platform. Good options include:
        -   **PostHog:** Can be self-hosted, giving you full data ownership.
        -   **Vercel Analytics:** Built-in, privacy-friendly, and simple to enable.
    -   [ ] **Define and Track Key Events (The User Funnel):**
        -   `User Signed Up`
        -   `First Statement Uploaded`: The "Aha!" moment.
        -   `Budget Created`: A key engagement metric.
        -   `Premium Upgrade CTA Viewed`: How many see the pricing page?
        -   `Checkout Session Started`: How many click "Upgrade"?
        -   `Subscription Started`: The final conversion.
    -   [ ] **Create a Core Metrics Dashboard:** Build a dashboard (within your analytics tool) to monitor your funnel conversion rates, user retention (Day 1, Week 1, Month 1), and feature adoption (e.g., "What percentage of users have created a budget?").

---

#### **Section 2: Iteration & Refinement (The Workshop)**
*The goal is to act on the data from Section 1. This involves a continuous loop of fixing bugs, polishing UX, and optimizing performance based on real-world usage.*

-   [ ] **2.1: Establish a Formal Triage & Development Process**
    -   [ ] **Use a Project Management Tool:** Adopt a tool like Linear, Jira, or GitHub Issues to manage all incoming work.
    -   [ ] **Triage Regularly:** Hold a weekly meeting to review all new bug reports, feature requests, and analytics insights.
    -   [ ] **Prioritize:** Label and prioritize tasks. Is this a critical `P0-bug` that breaks a core flow? Is it a `P2-ux-improvement` that would reduce friction? Is it a `P3-feature-request` to consider for the future?

-   [ ] **2.2: Implement A/B Testing for Key Funnels**
    -   [ ] **Choose a Framework:** Use a tool for A/B testing, such as Vercel Edge Config with Middleware or a dedicated service like Statsig.
    -   [ ] **Run Your First Experiment:** Start with a simple, high-impact test. For example:
        -   **Hypothesis:** "Changing the headline on the pricing page from 'Upgrade to Premium' to 'Unlock Your Financial Potential' will increase clicks on the upgrade button."
        -   **Implementation:** Use your A/B testing framework to show 50% of users the original headline and 50% the new one. Track the `Checkout Session Started` event for each variant.
        -   **Analysis:** After a statistically significant number of views, analyze the results and permanently adopt the winner.

-   [ ] **2.3: Continuous Performance Monitoring**
    -   [ ] **Leverage Vercel Real Experience Score:** Regularly check the analytics provided by Vercel for your app's real-world performance (Core Web Vitals).
    -   [ ] **Frontend Performance:** If a specific component is identified as slow, use the React DevTools Profiler to diagnose and fix re-rendering issues.
    -   [ ] **Backend Performance:** In the Supabase Dashboard, review the "Query Performance" report to identify slow-running database queries. Add or adjust indexes as needed to optimize them.

---

#### **Section 3: Strategic Growth (The Engine of Expansion)**
*The goal is to build the next set of major features that will drive new revenue and expand our market reach.*

-   [ ] **3.1: Build the Ethical Marketplace (Secondary Revenue Stream)**
    -   [ ] **Research & Partnership:** Identify and vet initial affiliate partners for high-yield savings accounts or low-interest personal loans.
    -   [ ] **Backend Logic:** Develop the AI-driven "Opportunity Finder" service. This service will periodically scan a user's data (e.g., after an upload) to find clear opportunities (e.g., "high credit card interest detected").
    -   [ ] **Frontend UI:** Design and build the UI components that present the insight *first*, before the offer.
        -   Example: "You could save an estimated $800/year in interest. [See my options]"
        -   The "[See my options]" button would then reveal the curated, clearly-labeled affiliate links.
    -   [ ] **Launch & Measure:** Roll out this feature to a subset of users first and track the click-through rate and conversion rate.

-   [ ] **3.2: Develop "Expai for Work" (B2B Expansion)**
    -   [ ] **Phase 5a: Foundational B2B Schema & Admin Portal**
        -   **Database:** Extend the Prisma schema to include `organizations`, `organization_members` (seats), and roles (`admin`, `member`).
        -   **Admin Dashboard:** Build a new section of the app for organization admins.
        -   **User Invitation Flow:** An admin must be able to invite employees to join their organization's Expai plan via email.
        -   **Billing:** Integrate Stripe to handle per-seat, B2B subscription billing.
    -   [ ] **Phase 5b: Anonymized Reporting**
        -   **Backend:** Create secure, heavily-tested API endpoints that provide *aggregated and anonymized* data for an organization (e.g., average savings rate, most common spending categories). **Crucially, this must be impossible to trace back to an individual user.**
        -   **Frontend:** Build the data visualizations for the B2B admin dashboard that display these anonymous insights.

---

#### **Section 4: Technical Excellence & Maintenance (Foundation Care)**
*The goal is to prevent the codebase from degrading over time. This is non-feature work that pays massive dividends in development speed and stability.*

-   [ ] **4.1: Schedule Regular Maintenance Sprints/Days**
    -   [ ] **Dependency Management:** Once a month, use a tool like `npm-check-updates` or GitHub's Dependabot to review and update all project dependencies. Test thoroughly after updating.
    -   [ ] **Technical Debt Pay-down:** Dedicate ~10% of your development time each cycle to refactoring. Go back to parts of the code that were written quickly during early phases and improve them with the knowledge you have now.

-   [ ] **4.2: Enhance Documentation**
    -   [ ] **Update the Project README:** Ensure the README accurately reflects the current state of the project, including how to set up the full environment (with new services like the B2B portal).
    -   [ ] **Create an Architectural Decision Record (ADR):** For any major new architectural choice (e.g., "Why we chose PostHog for analytics"), create a simple markdown file in a `/docs/adr` folder explaining the decision and its trade-offs. This is invaluable for future team members.

---

### **Definition of Done for Phase 5**

Phase 5 never truly ends. Its success is defined by the **establishment of a sustainable, healthy, and data-informed development cycle.** You have successfully entered this phase when:
-   [ ] The team has a clear, prioritized backlog of bugs and features.
-   [ ] Product decisions are regularly being informed by both user feedback and quantitative analytics.
-   [ ] The first A/B test has been run and its results analyzed.
-   [ ] The team has a dedicated, scheduled time for maintenance and refactoring.
-   [ ] Development has begun on the first major strategic growth initiative (e.g., the Ethical Marketplace).