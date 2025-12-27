import "server-only";
import type { StackServerApp as StackServerAppType } from "@stackframe/stack";

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;

let stackServerAppInstance: StackServerAppType | null = null;

if (projectId) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { StackServerApp } = require("@stackframe/stack");
  stackServerAppInstance = new StackServerApp({
    tokenStore: "nextjs-cookie",
    urls: {
      home: "/",
      signIn: "/login",
      signUp: "/signup",
      afterSignIn: "/",
      afterSignUp: "/",
    },
  });
}

export const stackServerApp = stackServerAppInstance as StackServerAppType;
