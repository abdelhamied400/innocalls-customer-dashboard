import { deleteCookie } from "cookies-next/client";
import useSessionStore from "@/store/session.slice";

export const clientSignout = async (callbackUrl?: string) => {
  deleteCookie("OrganizationId");
  useSessionStore.getState().clearSession();
  if (typeof window !== "undefined") {
    const previousUrl = window.location.pathname;
    window.location.href = callbackUrl || `/login?next=${previousUrl}`;
  }
};
