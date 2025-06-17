// src/app/(auth)/login/page.tsx

// 1. This must be a Client Component now
"use client";

import { Button, Card, Field, Input, Title3 } from "@fluentui/react-components";
import { useRouter } from "next/navigation"; // 2. Import useRouter for navigation
import { useState } from "react"; // 3. Import useState for form state

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // 4. Create a client-side submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // On success, redirect to the dashboard
      router.push("/dashboard");
      router.refresh(); // Important to re-fetch server component data
    } else {
      // Handle login error (e.g., show a message)
      const { error } = await response.json();
      alert(`Login failed: ${error}`);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm p-8">
        {/* 5. Attach the handler to the form's onSubmit event */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Title3 align="center">Log in to Expai</Title3>

          <Field label="Email">
            {/* 6. Control the input components with state */}
            <Input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password">
            <Input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {/* 7. The button is now a simple submit button */}
          <Button type="submit" appearance="primary">
            Log in
          </Button>
        </form>
      </Card>
    </div>
  );
}
