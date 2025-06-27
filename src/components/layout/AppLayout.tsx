// src/components/layout/AppLayout.tsx

// 1. Mark this as a Client Component
"use client";

import { Body1, Button, Card, Title3 } from "@fluentui/react-components";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 2. Import useRouter
import React from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // 3. Initialize the router

  // 4. Create the logout handler function
  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      // On successful logout, redirect to the login page
      router.push("/login");
      router.refresh(); // Ensure all server-side data is cleared
    } else {
      // Handle logout error
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 flex-shrink-0 p-4 flex flex-col bg-slate-50 dark:bg-slate-800">
        <Title3 className="mb-6">Expai</Title3>

        <nav className="flex flex-col gap-2">
                {/* Wrap buttons in Link components for client-side navigation */}
                <Link href="/dashboard" passHref>
                    <Button appearance="transparent">Dashboard</Button>
                </Link>
                <Link href="/transactions" passHref>
                    <Button appearance="transparent">Transactions</Button>
                </Link>
                <Link href="/budgets" passHref>
                    <Button appearance="transparent">Budgets</Button>
                </Link>
                <Link href="/categories" passHref>
                    <Button appearance="transparent">Categories</Button>
                </Link>
            </nav>

        <div className="flex-grow" />

        <div className="flex flex-col gap-2">
          <Button appearance="transparent">Profile</Button>
          {/* 5. Attach the handler to the Logout button's onClick event */}
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </aside>

      <main className="flex-grow p-4">
        <Card className="h-full w-full">
          <Body1>{children}</Body1>
        </Card>
      </main>
    </div>
  );
}
