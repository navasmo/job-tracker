"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const StackSignUp = dynamic(() => import("./StackSignUp"), { ssr: false });

const isDemo =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  !process.env.NEXT_PUBLIC_STACK_PROJECT_ID;

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    if (isDemo) {
      router.replace("/");
    }
  }, [router]);

  if (isDemo) {
    return null;
  }

  return <StackSignUp />;
}
