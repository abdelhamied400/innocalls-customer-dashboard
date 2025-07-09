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

  if (status === "unauthenticated" || !session) {
    return <div>Please log in to access this feature.</div>;
  }

  const role = session.user?.role;

  if (role === "agent") {
    initialRoute = "/dialpad";
  } else if (role === "user") {
    initialRoute = "/extensions";
  }

  return (
    <RoutingProvider initialRoute={initialRoute}>
      <SipProvider>{children}</SipProvider>
    </RoutingProvider>
  );
};
