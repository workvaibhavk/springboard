import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/verify(.*)",
  "/api/verify-certificate(.*)",
  "/api/get-user-courses-data(.*)", // Add this
  "/api/get-featured-courses(.*)",
  "/privacy(.*)",
  "/terms(.*)",
  "/cookies(.*)",
  "/sitemap.xml",
  "/robots.txt",
]);

export default clerkMiddleware(async (auth, request) => {
  // const { userId } = await auth();

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // if (userId && request.nextUrl.pathname === '/') {
  //   const dashboardUrl = new URL('/dashboard', request.url);
  //   return NextResponse.redirect(dashboardUrl)
  // }

  // if (!userId && request.nextUrl.pathname === '/dashboard') {
  //   const homeUrl = new URL('/', request.url);
  //   return NextResponse.redirect(homeUrl)
  // }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
