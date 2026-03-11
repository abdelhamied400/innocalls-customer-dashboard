import { auth } from "./auth";

const basePublicPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify",
];

export default auth((request) => {
  const { pathname } = request.nextUrl;

  const isPublicPage = basePublicPages.includes(pathname);

  if (!request.auth && !isPublicPage) {
    const newUrl = new URL(`/login?next=${pathname}`, request.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (request.auth && isPublicPage) {
    const newUrl = new URL("/", request.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // No intl middleware needed, just continue
  return;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|assets|fonts|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
