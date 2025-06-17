// src/app/(auth)/signup/page.tsx
"use client";

import { Button, Card, Field, Input, Title3 } from "@fluentui/react-components";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // On success, redirect to login page with a success message
      router.push("/login?message=Signup successful, please verify your email.");
    } else {
      const { error } = await response.json();
      alert(`Signup failed: ${error}`);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm p-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Title3 align="center">Create an Account</Title3>

          <Field label="Email">
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

          <Button type="submit" appearance="primary">
            Sign Up
          </Button>
        </form>
      </Card>
    </div>
  );
}
