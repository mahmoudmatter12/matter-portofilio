import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define which routes require authentication
const isAdminRoute = createRouteMatcher([
  "/admin(.*)", // Protect all admin routes and sub-routes
]);

// Define public routes (routes that don't require authentication)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/certifications",
  "/api/messages",
  "/api/poster",
  "/api/projects",
  "/api/skills",
  "/api/timelineposts",
  "/api/messages/send-message",
  "/api/development-status",
  "/api/development-status/cmbs1axgu00005jyw8fs13pq1",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  // Handle admin routes
  if (isAdminRoute(req)) {
    // First check if user is authenticated
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
  }

  // Handle all other non-public routes
  if (!isPublicRoute(req)) {
    if (!userId) {
      // For API routes, return JSON error
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      // For page routes, redirect to sign-in
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
  }

  // Public routes - allow access without authentication
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
