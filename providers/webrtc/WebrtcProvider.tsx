"use client";

import { PropsWithChildren, useEffect } from "react";
import { RoutingProvider } from "../RoutingProvider";
import { SipProvider } from "./SipProvider";
import { useSession } from "next-auth/react";
import { useTranslationContext, useTranslations } from "../TranslationProvider";

type WebrtcProviderProps = PropsWithChildren<{}>;
export const WebrtcProvider = ({ children }: WebrtcProviderProps) => {
  const t = useTranslations("common.states");
  const { data: session, status } = useSession();
  const { isLoading: translationsLoading } = useTranslationContext();
  let initialRoute = "";

  if (status === "loading" || translationsLoading) {
    return <div>{!translationsLoading ? t("loading") : "Loading..."}</div>;
  }

  const userType = session?.userType;

  if (userType === "agent") {
    initialRoute = "/dialpad";
  } else if (userType === "user") {
    initialRoute = "/extensions";
  }

  return (
    <RoutingProvider initialRoute={initialRoute}>
      <SipProvider>{children}</SipProvider>
    </RoutingProvider>
  );
};
