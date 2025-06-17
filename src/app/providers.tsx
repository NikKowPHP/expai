// src/app/providers.tsx

// 1. Mark this component as a Client Component
"use client";

// 2. Import the Fluent UI Provider and a theme
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

// 3. Create a new component that wraps the FluentProvider
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FluentProvider theme={webLightTheme}>
      {children}
    </FluentProvider>
  );
}
