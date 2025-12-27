import type { StackClientApp as StackClientAppType } from "@stackframe/stack";

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;

let stackClientAppInstance: StackClientAppType | null = null;

if (projectId) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { StackClientApp } = require("@stackframe/stack");
  stackClientAppInstance = new StackClientApp({
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

export const stackClientApp = stackClientAppInstance as StackClientAppType;
