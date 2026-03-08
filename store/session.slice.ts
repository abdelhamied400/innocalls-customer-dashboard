import { create } from "zustand";
import {
  AuthSession,
  getStoredSession,
  setStoredSession,
  clearStoredSession,
} from "@/lib/session";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionState = {
  session: AuthSession | null;
  status: SessionStatus;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  initSession: () => void;
};

const useSessionStore = create<SessionState>()((set) => ({
  session: null,
  status: "loading",
  setSession: (session) => {
    setStoredSession(session);
    set({ session, status: "authenticated" });
  },
  clearSession: () => {
    clearStoredSession();
    set({ session: null, status: "unauthenticated" });
  },
  initSession: () => {
    const stored = getStoredSession();
    if (stored) {
      set({ session: stored, status: "authenticated" });
    } else {
      set({ session: null, status: "unauthenticated" });
    }
  },
}));

export default useSessionStore;
