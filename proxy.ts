import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/session";

const publicPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPage = publicPages.some((page) => pathname.startsWith(page));
  const isAuthenticated = request.cookies.has(AUTH_COOKIE);

  if (!isAuthenticated && !isPublicPage) {
    const newUrl = new URL(`/login?next=${pathname}`, request.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|assets|fonts|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
