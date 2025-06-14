
### **Database Definition Document: Expai**

**Document Version:** 2.0 (Complete)
**Date:** October 26, 2023
**Project:** Expai - AI-Driven Financial Wellness & Engagement Platform

---

### **1. Overview**

This document provides the complete database schema for the Expai application. The architecture is designed for a **PostgreSQL** database, managed by **Supabase**, with all application-level data access facilitated through the **Prisma ORM**.

The schema is engineered to be scalable, maintainable, and secure, fully supporting all specified features including core data processing, user monetization, gamification, and financial wellness analytics.

### **2. Design Principles & Conventions**

The following best practices are foundational to this schema:

*   **Naming Conventions:**
    *   **Tables:** `snake_case`, plural (e.g., `user_profiles`).
    *   **Columns:** `snake_case` (e.g., `created_at`).
    *   **Prisma Models:** `PascalCase`, singular (e.g., `UserProfile`), linked via `@@map`.

*   **Primary Keys (PK):** All primary keys are `UUID`s to ensure global uniqueness and security.

*   **Foreign Keys (FK):** Explicit foreign key constraints are used to maintain relational integrity. Deletion behavior (`ON DELETE CASCADE` or `ON DELETE SET NULL`) is defined based on logical data dependency.

*   **Timestamps:** Standard `created_at` and `updated_at` columns use the `TIMESTAMPTZ` data type, storing all times in UTC.

*   **Data Types:** `NUMERIC(19, 4)` is used for all monetary values to ensure precision. `JSONB` is used for flexible metadata.

*   **Security:** **Row Level Security (RLS)** will be enabled on all tables containing user-specific data, restricting access based on the authenticated user's ID (`auth.uid()`).

*   **Indexing:** Indexes are specified for all foreign key columns and other frequently queried columns to ensure optimal performance.

### **3. Schema Definition**

#### **3.1. `users` (Managed by Supabase Auth)**
*   **Description:** Stores core authentication information. Managed by Supabase Auth and referenced by other tables.
*   **Key Columns:** `id` (uuid, PK).

#### **3.2. `user_profiles`**
*   **Description:** An extension of the `users` table, storing application-specific user data, subscription status, and usage metrics.
*   **Columns:**
| Column Name | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | **Primary Key**, `REFERENCES users(id) ON DELETE CASCADE` |
| `subscription_status` | `text` | `DEFAULT 'free'`. e.g., 'free', 'premium', 'trial' |
| `monthly_uploads_used`| `integer` | `NOT NULL`, `DEFAULT 0`. Tracks usage for freemium limits. |
| `usage_period_start`| `timestamptz` | `NOT NULL`, `DEFAULT now()`. Marks the start of the monthly limit cycle. |
| `stripe_customer_id`| `text` | **Unique**, nullable. For Stripe integration. |
| `financial_health_score`| `integer` | Nullable. Calculated by the gamification engine. |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |

#### **3.3. `accounts`**
*   **Description:** Represents a financial account a user owns (e.g., "Chase Checking").
*   **Columns:**
| Column Name | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | **Primary Key** |
| `user_id` | `uuid` | **Foreign Key** `REFERENCES users(id) ON DELETE CASCADE`, **Indexed** |
| `name` | `text` | `NOT NULL` |
| `account_type` | `text` | `NOT NULL`, e.g., 'checking', 'credit_card' |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |

#### **3.4. `categories`**
*   **Description:** Stores user-managed spending categories, enhanced with a type for "Needs vs. Wants" analysis.
*   **Columns:**
| Column Name | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | **Primary Key** |
| `user_id` | `uuid` | **Foreign Key** `REFERENCES users(id) ON DELETE CASCADE`, **Indexed** |
| `name` | `text` | `NOT NULL` |
| `type` | `text` | `NOT NULL`, `DEFAULT 'discretionary'`. e.g., 'need', 'want', 'saving'. |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |

#### **3.5. `transactions`**
*   **Description:** The core table, storing every individual financial transaction.
*   **Columns:**
| Column Name | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | **Primary Key** |
| `user_id` | `uuid` | **Foreign Key** `REFERENCES users(id) ON DELETE CASCADE`, **Indexed** |
| `account_id` | `uuid` | **Foreign Key** `REFERENCES accounts(id) ON DELETE CASCADE` |
| `category_id`| `uuid` | **Foreign Key** `REFERENCES categories(id) ON DELETE SET NULL`, Nullable |
| `description`| `text` | `NOT NULL` |
| `amount` | `numeric(19,4)`| `NOT NULL` |
| `transaction_date`| `timestamptz`| `NOT NULL`, **Indexed** |
| `ai_metadata`| `jsonb` | Nullable. Stores AI confidence scores, etc. |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |

#### **3.6. `budgets`**
*   **Description:** Stores user-defined budgets for specific categories.
*   **Columns:**
| Column Name | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | **Primary Key** |
| `user_id` | `uuid` | **Foreign Key** `REFERENCES users(id) ON DELETE CASCADE`, **Indexed** |
| `category_id`| `uuid` | **Foreign Key** `REFERENCES categories(id) ON DELETE CASCADE` |
| `amount` | `numeric(19,4)`| `NOT NULL` |
| `start_date` | `timestamptz`| `NOT NULL` |
| `end_date` | `timestamptz`| `NOT NULL` |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |

#### **3.7. `achievements`**
*   **Description:** A static table defining all possible achievements in the gamification system.
*   **Columns:**
| Column Name | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | **Primary Key** |
| `name` | `text` | `NOT NULL`, e.g., "Budget Champion" |
| `description`| `text` | `NOT NULL` |
| `icon_name` | `text` | Identifier for the UI icon |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |

#### **3.8. `user_achievements`**
*   **Description:** A join table linking users to the achievements they have earned.
*   **Columns:**
| Column Name | Data Type | Constraints / Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | **Primary Key** |
| `user_id` | `uuid` | **Foreign Key** `REFERENCES user_profiles(id) ON DELETE CASCADE`, **Indexed** |
| `achievement_id` | `uuid` | **Foreign Key** `REFERENCES achievements(id) ON DELETE CASCADE` |
| `unlocked_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` |

---

### **4. Prisma Schema Representation (`schema.prisma`)**

This is the complete Prisma schema that represents the database structure, enabling type-safe data access in the Next.js application.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// Core user and application data
model UserProfile {
  id                   String            @id @default(uuid()) @map("id")
  subscriptionStatus   String            @default("free") @map("subscription_status")
  monthlyUploadsUsed   Int               @default(0) @map("monthly_uploads_used")
  usagePeriodStart     DateTime          @default(now()) @map("usage_period_start")
  stripeCustomerId     String?           @unique @map("stripe_customer_id")
  financialHealthScore Int?              @map("financial_health_score")
  createdAt            DateTime          @default(now()) @map("created_at")
  updatedAt            DateTime          @updatedAt @map("updated_at")

  // Relations
  user              User                @relation(fields: [id], references: [id], onDelete: Cascade)
  accounts          Account[]
  categories        Category[]
  transactions      Transaction[]
  budgets           Budget[]
  userAchievements  UserAchievement[]

  @@map("user_profiles")
}

// Financial entities
model Account {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  name        String
  accountType String   @map("account_type")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@index([userId])
  @@map("accounts")
}

model Category {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  name      String
  // 'need', 'want', 'saving', or 'discretionary' for "Science of Money" analysis
  type      String   @default("discretionary")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  budgets      Budget[]

  @@index([userId])
  @@map("categories")
}

model Transaction {
  id               String    @id @default(uuid())
  userId           String    @map("user_id")
  accountId        String    @map("account_id")
  categoryId       String?   @map("category_id")
  description      String
  amount           Decimal   @db.Decimal(19, 4)
  transactionDate  DateTime  @map("transaction_date")
  aiMetadata       Json?     @map("ai_metadata")
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")

  // Relations
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  account          Account   @relation(fields: [accountId], references: [id], onDelete: Cascade)
  category         Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([transactionDate])
  @@map("transactions")
}

model Budget {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  categoryId String   @map("category_id")
  amount     Decimal  @db.Decimal(19, 4)
  startDate  DateTime @map("start_date")
  endDate    DateTime @map("end_date")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  
  // Relations
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("budgets")
}

// Gamification entities
model Achievement {
  id          String    @id @default(uuid())
  name        String
  description String
  iconName    String    @map("icon_name")
  createdAt   DateTime  @default(now()) @map("created_at")

  // Relations
  userAchievements UserAchievement[]

  @@map("achievements")
}

model UserAchievement {
  id            String      @id @default(uuid())
  userId        String      @map("user_id")
  achievementId String      @map("achievement_id")
  unlockedAt    DateTime    @default(now()) @map("unlocked_at")

  // Relations
  user        UserProfile @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementId])
  @@map("user_achievements")
}


// Supabase Auth models - defined for relation purposes
model User {
  id           String      @id @default(uuid())
  userProfiles UserProfile?
  accounts     Account[]
  categories   Category[]
  transactions Transaction[]
  budgets      Budget[]
  
  @@map("users")
}
```