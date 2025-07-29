"use client";

import { PropsWithChildren } from "react";
import { RoutingProvider } from "../RoutingProvider";
import { SipProvider } from "./SipProvider";
import { useSession } from "next-auth/react";

type WebrtcProviderProps = PropsWithChildren<{}>;
export const WebrtcProvider = ({ children }: WebrtcProviderProps) => {
  const { data: session, status } = useSession();
  let initialRoute = "";

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const userType = session?.user?.userType;

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
