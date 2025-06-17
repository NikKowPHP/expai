// src/app/(app)/dashboard/page.tsx

import { Title1 } from "@fluentui/react-components";

import { StatementUploader } from "@/components/upload/StatementUploader";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Title1 as="h1">Dashboard</Title1>

      <p>Welcome to Expai. Upload a financial statement to get started.</p>

      {/* Add the new uploader component here */}
      <StatementUploader />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Transactions</h2>
        <p>Your processed transactions will appear here...</p>
        {/* In Phase 2, the TransactionTable will go here */}
      </div>
    </div>
  );
}
