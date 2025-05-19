import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./auth";

const intlMiddleware = createMiddleware(routing);

const publicPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

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
  // Match only internationalized pathnames
  matcher: [
    "/((?!api|_next/static|assets|fonts|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    `/(en|ar)/:path*`,
  ],
};
