// src/components/layout/AppLayout.tsx

"use client";

import {
  Body1,
  Button,
  Card,
  Title3,
} from "@fluentui/react-components";
import React from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // 1. Main container: full screen height, flexbox layout
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">

      {/* --- SIDEBAR --- */}
      {/* 2. Sidebar: fixed width, flex column, background color */}
      <aside className="w-64 flex-shrink-0 p-4 flex flex-col bg-slate-50 dark:bg-slate-800">
        <Title3 className="mb-6">Expai</Title3>

        {/* Navigation Links using Fluent UI Buttons */}
        <nav className="flex flex-col gap-2">
          <Button appearance="transparent">Dashboard</Button>
          <Button appearance="transparent">Transactions</Button>
          <Button appearance="transparent">Budgets</Button>
          <Button appearance="transparent">Categories</Button>
        </nav>

        {/* Spacer to push profile to the bottom */}
        <div className="flex-grow" />

        {/* Profile/Logout section */}
        <div className="flex flex-col gap-2">
          <Button appearance="transparent">Profile</Button>
          <Button>Logout</Button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      {/* 3. Main content: flex-grow makes it take up the remaining space */}
      <main className="flex-grow p-4">
        {/* We use a Card to give the content area a nice frame */}
        <Card className="h-full w-full">
          {/* The key part is rendering the `{children}` prop here. */}
          <Body1>{children}</Body1>
        </Card>
      </main>

    </div>
  );
}
