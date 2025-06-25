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

// Generate public pages for each locale
const publicPages = [
  ...basePublicPages,
  ...localeSlugs.flatMap((locale) =>
    basePublicPages.map((page) => `/${locale}${page}`)
  ),
];

const intlMiddleware = createMiddleware(routing);

export default auth((request) => {
  if (!request.auth && !publicPages.includes(request.nextUrl.pathname)) {
    const newUrl = new URL(
      `/login?next=${request.nextUrl.pathname}`,
      request.nextUrl.origin
    );
    return Response.redirect(newUrl);
  }

  const response = intlMiddleware(request);
  return response;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|assets|fonts|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    `/(en|ar)/:path*`,
  ],
};
