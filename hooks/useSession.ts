import { useEffect } from "react";
import useSessionStore from "@/store/session.slice";

export function useSession() {
  const { session, status, initSession } = useSessionStore();

  useEffect(() => {
    if (status === "loading") {
      initSession();
    }
  }, [status, initSession]);

  return { data: session, status };
}
