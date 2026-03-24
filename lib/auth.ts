import * as Sentry from "@sentry/nextjs";
import { deleteCookie } from "cookies-next/client";
import useSessionStore from "@/store/session.slice";

export const clientSignout = async (callbackUrl?: string) => {
  Sentry.addBreadcrumb({ category: "auth", message: "User signed out", level: "info" });
  Sentry.setUser(null);
  deleteCookie("OrganizationId");
  useSessionStore.getState().clearSession();
  if (typeof window !== "undefined") {
    const previousUrl = window.location.pathname;
    if (previousUrl !== "/login") {
      window.location.href = callbackUrl || `/login?next=${previousUrl}`;
    }
  }
};
