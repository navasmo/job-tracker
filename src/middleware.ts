import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip authentication in demo mode
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return NextResponse.next();
  }

  // Dynamically import Stack Auth only when not in demo mode
  const { stackServerApp } = await import("@/lib/stack");

  // Public routes that don't require authentication
  const publicPaths = ["/login", "/signup", "/forgot-password", "/handler"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // API routes should be handled separately
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  const user = await stackServerApp.getUser();

  if (!user) {
    // Redirect to login if not authenticated
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
