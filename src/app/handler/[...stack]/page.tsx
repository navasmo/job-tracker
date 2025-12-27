import { redirect } from "next/navigation";

export default async function Handler(props: { params: Promise<{ stack: string[] }> }) {
  // Redirect to home in demo mode
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    redirect("/");
  }

  // Dynamically import Stack Auth only when not in demo mode
  const { stackServerApp } = await import("@/lib/stack");
  const { StackHandler } = await import("@stackframe/stack");

  return <StackHandler fullPage app={stackServerApp} params={props.params} />;
}
