import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./auth";
import { localeSlugs } from "./i18n/config";

const basePublicPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const roles = ["user", "agent"];

// Generate public pages with locale prefixes
const publicPages = [
  ...basePublicPages,
  ...localeSlugs.flatMap((locale) =>
    basePublicPages.map((page) => `/${locale}${page}`)
  ),
];

const intlMiddleware = createMiddleware(routing);

export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Extract locale and role
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = localeSlugs.includes(segments[0]) ? segments[0] : null;
  const maybeRole = maybeLocale ? segments[1] : segments[0];

  const userRole = request.auth?.user?.role;

  const isPublicPage = publicPages.includes(pathname);

  if (!request.auth && !isPublicPage) {
    const newUrl = new URL(`/login?next=${pathname}`, request.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // If logged in but URL doesn't include the role correctly
  if (request.auth && userRole && (!maybeRole || maybeRole !== userRole)) {
    // Build new pathname with locale (if any) and role
    const remainingPath = segments.slice(maybeLocale ? 1 : 0).join("/");
    const correctedPath = `/${maybeLocale ?? ""}/${userRole}/${remainingPath}`
      .replace(/\/+/g, "/") // Remove duplicate slashes
      .replace(/\/$/, ""); // Remove trailing slash

    const newUrl = new URL(correctedPath, request.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: [
    "/((?!api|_next/static|assets|fonts|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    `/(en|ar)/:path*`,
  ],
};
