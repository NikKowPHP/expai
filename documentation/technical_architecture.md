### **Technical Architecture: Expai**

**Document Version:** 1.0
**Date:** October 26, 2023
**Project:** Expai - AI-Driven Financial Wellness & Engagement Platform

---

### **1. Executive Technical Summary**

Expai will be developed as a modern, full-stack Progressive Web Application (PWA), leveraging a robust and cohesive technology stack designed for performance, scalability, and superior developer experience. The core framework will be **Next.js 15+**, serving both the frontend and the Backend-for-Frontend (BFF) API layer. Data persistence, authentication, and file storage will be managed by **Supabase**, with **Prisma** acting as the type-safe bridge between the application logic and the database.

The user interface will strictly adhere to **Microsoft's Fluent 2** design system, ensuring a sleek, professional, and accessible experience, styled efficiently using **Tailwind CSS**. The application's intelligence will be powered by external AI models, specifically **Google Gemini** and others accessible via **OpenRouter**.

### **2. Core Technology Stack**

This stack has been selected to maximize development speed, ensure type safety, and provide a scalable foundation for future growth.

#### **2.1. Frontend & User Interface**

*   **Application Framework:** **Next.js 15+**
    *   **Purpose:** The primary React framework for building the user interface. It provides essential features like server-side rendering (SSR) for better performance and SEO, static site generation (SSG), optimized image handling, and file-based routing.
    *   **PWA Capabilities:** Next.js will be configured to support PWA features, enabling an installable, app-like experience across devices.
*   **UI Library:** **Microsoft Fluent 2 for Web**
    *   **Purpose:** A collection of React components implementing Microsoft's official design language. This ensures the application achieves the desired sleek, professional, and enterprise-grade aesthetic. Fluent 2 components provide built-in accessibility and responsiveness.
*   **Styling:** **Tailwind CSS**
    *   **Purpose:** A utility-first CSS framework used for layout, spacing, and customization. It allows for rapid UI development and works alongside Fluent 2 components to fine-tune the design.
*   **Build Tool:** **Turbopack**
    *   **Purpose:** The Rust-based successor to Webpack, integrated into recent Next.js versions. It provides extremely fast build times and Hot Module Replacement (HMR), significantly improving the development workflow.

#### **2.2. Backend & API Layer**

*   **API Framework:** **Next.js API Routes**
    *   **Purpose:** Serverless functions integrated directly into the Next.js application. This will serve as the Backend-for-Frontend (BFF), handling all communication between the frontend, the database, and external AI services. This approach maintains project cohesion and simplifies deployment.
*   **File Processing Libraries:** (To be determined, e.g., `pdf-parse`, `papaparse`)
    *   **Purpose:** Server-side libraries used within the Next.js API routes to read and extract raw data from uploaded user files (PDF, CSV, XML) before sending them for AI analysis.

#### **2.3. Database & Data Management**

*   **Database:** **Supabase Database (PostgreSQL)**
    *   **Purpose:** A robust, scalable, hosted PostgreSQL database. It will store all structured user data, transaction information, categories, budgets, and gamification progress.
*   **Object-Relational Mapping (ORM):** **Prisma**
    *   **Purpose:** A modern, type-safe ORM that acts as the bridge between the Next.js API routes and the PostgreSQL database. Prisma provides an intuitive query builder, automated migration management, and excellent TypeScript support, improving data handling reliability.

#### **2.4. Authentication & Storage**

*   **Authentication:** **Supabase Auth**
    *   **Purpose:** Provides a complete authentication solution, handling user sign-up, login, session management (using JWT), password resets, and potentially social logins. It integrates directly with the Supabase database to enable Row Level Security (RLS).
*   **File Storage:** **Supabase Storage (Bucket)**
    *   **Purpose:** Secure, scalable object storage used to temporarily or permanently store the raw financial statements (PDFs, CSVs, XMLs) uploaded by users before they are processed by the backend.

#### **2.5. AI & Intelligence**

*   **AI Providers:** **Google Gemini** and models via **OpenRouter**
    *   **Purpose:** The core intelligence engine. These external APIs will be called by the Next.js API routes to perform complex tasks such as natural language processing (NLP) for data extraction, semantic transaction categorization, generating budgeting insights, and powering the "Science of Money" features.

### **3. System Architecture & Data Flow**

The architecture follows a modern, serverless-oriented approach, managed primarily through the Next.js framework and Supabase services.

#### **3.1. Data Ingestion Flow**

1.  **User Upload:** The user interacts with the Next.js frontend (built with Fluent 2) to upload a financial statement file (PDF, CSV, XML).
2.  **API Call:** The frontend securely transmits the file to a dedicated **Next.js API Route**.
3.  **Secure Storage:** The API route authenticates the user (via Supabase Auth) and uploads the raw file to **Supabase Storage**.
4.  **File Parsing:** The API route retrieves the file and uses appropriate libraries to extract raw text data (e.g., transaction lists).
5.  **AI Processing:** The extracted data is sent to the **Gemini/OpenRouter API** for intelligent parsing, categorization, and analysis.
6.  **Data Persistence:** The structured results from the AI are received by the API route. Using **Prisma**, the system checks for duplicates and inserts the new, categorized transaction data into the **Supabase PostgreSQL** database.

#### **3.2. Data Retrieval & Visualization Flow**

1.  **User Request:** The user navigates to a dashboard or statistics page in the Next.js frontend.
2.  **API Call:** The frontend makes a request to a Next.js API route to fetch the required financial data.
3.  **Query Execution:** The API route uses **Prisma** to query the Supabase database. **Row Level Security (RLS)** within Supabase ensures the user can only access their own data.
4.  **Data Return:** The structured data is returned to the frontend.
5.  **Visualization:** The frontend uses **Fluent 2 components** and charting libraries to render the interactive charts, progress bars, and statistics.

### **4. Design & User Experience (UX) Principles**

*   **Aesthetics:** The application will strictly adhere to the **Microsoft Fluent 2** design guidelines, delivering a clean, familiar, and professional look and feel, characterized by clarity, depth, and motion.
*   **Accessibility:** Leveraging Fluent 2 components ensures high standards of accessibility (WCAG) compliance out of the box.
*   **Responsiveness:** Tailwind CSS and Fluent 2 will be used to ensure the application is fully responsive and performs optimally as a PWA on desktop, tablet, and mobile devices.

### **5. Rationale for Technology Choices**

*   **Cohesion & Simplicity:** Using Next.js for both frontend and API keeps the codebase unified and simplifies deployment and maintenance.
*   **Developer Experience (DX):** Turbopack offers extremely fast builds, Prisma provides type-safe database access, and Tailwind speeds up styling, leading to faster development cycles.
*   **Scalability & Reliability:** Supabase provides a robust, managed backend (database, auth, storage), reducing operational overhead and allowing the team to focus on core features.
*   **Proven Aesthetics:** Fluent 2 directly addresses the requirement for a sleek, Microsoft-like interface without needing to build a complex design system from scratch.