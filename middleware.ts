import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

import createMiddleware from "next-intl/middleware";
import { defaultLocale, localePrefix, locales, pathnames } from "./config";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: localePrefix,
  pathnames: pathnames,
});
export default clerkMiddleware((auth, req, event) => {
  if (isProtectedRoute(req)) auth().protect();
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/(vi|en)/:path*",
  ],
};
