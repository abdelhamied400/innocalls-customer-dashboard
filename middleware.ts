import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { localeSlugs } from "./i18n/config";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/((?!api|_next/static|assets|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    `/(en|ar)/:path*`,
  ],
};
