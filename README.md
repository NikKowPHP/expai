# Expai - Personal Finance AI Assistant

Expai is an AI-powered personal finance application that helps users optimize their financial health through automated transaction analysis, budgeting tools, and personalized recommendations.

## Key Features

- **Transaction Analysis**: Automatically categorizes and analyzes bank transactions
- **AI Insights**: Provides personalized financial recommendations
- **Budgeting Tools**: Helps track spending against budgets
- **B2B Dashboard**: Organization-level financial analytics
- **Gamification**: Rewards users for good financial habits

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Error Tracking**: Sentry
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase account for authentication

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables (see .env.example)
4. Run database migrations:
```bash
npx prisma migrate dev
```
5. Start the development server:
```bash
npm run dev
```

### Environment Variables
Create a `.env` file with the following variables:
```
DATABASE_URL=postgres://user:password@localhost:5432/expai
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
SENTRY_DSN=your-sentry-dsn
```

## Deployment

The easiest way to deploy is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo%2Fexpai)

## Architecture Decisions

Architectural decisions are documented in the [ADR directory](/documentation/adr).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
