"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const StackLogin = dynamic(() => import("./StackLogin"), { ssr: false });

const isDemo =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_STACK_PROJECT_ID;

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isDemo) {
      router.replace("/");
    }
  }, [router]);

  if (isDemo) {
    return null;
  }

  return <StackLogin />;
}
