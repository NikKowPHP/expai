// src/app/(app)/layout.tsx

import React from "react";

import { AppLayout } from "@/components/layout/AppLayout";

// This layout will be applied to all pages inside the (app) directory.
export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
