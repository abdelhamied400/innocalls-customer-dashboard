import { Organization } from "@/types/api/organization";
import { setCookie, deleteCookie } from "cookies-next/client";

export type AuthSession = {
  accessToken: string;
  userType: "user" | "agent";
  organizations: Organization[];
  user: {
    email?: string;
    id?: string;
  };
};

const SESSION_KEY = "app_session";
export const AUTH_COOKIE = "app_authenticated";

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  setCookie(AUTH_COOKIE, "1");
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY);
  deleteCookie(AUTH_COOKIE);
}
