import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    home: "/",
    signIn: "/login",
    signUp: "/signup",
    afterSignIn: "/",
    afterSignUp: "/",
  },
});
