"use client";

import { PropsWithChildren, useEffect, useMemo } from "react";
import { RoutingProvider } from "../RoutingProvider";
import { SipProvider } from "./SipProvider";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/providers/TranslationProvider";

type WebrtcProviderProps = PropsWithChildren<{}>;
export const WebrtcProvider = ({ children }: WebrtcProviderProps) => {
  const t = useTranslations("common.states");

  const { data: session, status } = useSession();
  
  // Memoize the initial route to prevent re-renders
  const initialRoute = useMemo(() => {
    const userType = session?.user?.userType;
    if (userType === "agent") {
      return "/dialpad";
    } else if (userType === "user") {
      return "/extensions";
    }
    return "";
  }, [session?.user?.userType]);

  if (status === "loading") {
    return <div>{t("loading")}</div>;
  }

  return (
    <RoutingProvider initialRoute={initialRoute}>
      <SipProvider>{children}</SipProvider>
    </RoutingProvider>
  );
};
