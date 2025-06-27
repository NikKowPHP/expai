// src/app/layout.tsx

import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// 1. Import your new Providers component
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expai",
  description: "AI-Powered Financial Wellness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. Use the Providers component to wrap your app's children */}
        {/*    DO NOT import or use FluentProvider directly here anymore. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
