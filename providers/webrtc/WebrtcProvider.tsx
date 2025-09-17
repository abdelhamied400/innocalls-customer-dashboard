"use client";

import { PropsWithChildren, useEffect } from "react";
import { RoutingProvider } from "../RoutingProvider";
import { SipProvider } from "./SipProvider";
import { useSession } from "next-auth/react";
import { useTranslations } from "../TranslationProvider";

type WebrtcProviderProps = PropsWithChildren<{}>;
export const WebrtcProvider = ({ children }: WebrtcProviderProps) => {
  const t = useTranslations("common.states");

  const { data: session, status } = useSession();
  let initialRoute = "";

  if (status === "loading") {
    return <div>{t("loading")}</div>;
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
