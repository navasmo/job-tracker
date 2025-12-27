"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

const isDemo =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_STACK_PROJECT_ID;

interface ProvidersProps {
  children: React.ReactNode;
}

// Toaster component with consistent styling
function ToasterComponent() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--gray-200)",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}

// Demo mode providers (no auth)
function DemoProviders({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
      <ToasterComponent />
    </ThemeProvider>
  );
}

// Full providers with Stack Auth
function AuthProviders({ children }: ProvidersProps) {
  // Dynamic import to avoid loading Stack Auth in demo mode during build
  const { StackProvider, StackTheme } = require("@stackframe/stack");
  const { stackClientApp } = require("@/lib/stack-client");

  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <ToasterComponent />
        </ThemeProvider>
      </StackTheme>
    </StackProvider>
  );
}

export default function Providers({ children }: ProvidersProps) {
  if (isDemo) {
    return <DemoProviders>{children}</DemoProviders>;
  }
  return <AuthProviders>{children}</AuthProviders>;
}
