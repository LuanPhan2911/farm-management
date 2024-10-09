import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { protectedRoute } from "./routes";

const isProtectedRoute = createRouteMatcher(protectedRoute);

import createMiddleware from "next-intl/middleware";
import {
  defaultLocale,
  localePrefix,
  locales,
  pathnames,
} from "@/configs/localeConfig";
import { removeLanguagePrefix } from "./lib/utils";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: localePrefix,
  pathnames: pathnames,
});
export default clerkMiddleware((auth, req, event) => {
  req.headers.set("x-current-path", removeLanguagePrefix(req.nextUrl.pathname));
  if (isProtectedRoute(req)) auth().protect();
  // check if connect to socket io then not return int middleware;
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/socket")) {
    return;
  }
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
