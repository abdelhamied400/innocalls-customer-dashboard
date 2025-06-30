"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { ExtensionWithCredentials } from "@/types/api/extension";
import { createUserAgent } from "./SipProvider/userAgent";
import type { SipContextType, ExtensionState } from "./SipProvider/types";

import JsSIP from "jssip";
import { useUaEvents } from "./SipProvider/useUaEvents";

const SipContext = createContext<SipContextType | null>(null);

type SipProviderProps = PropsWithChildren<{}>;
export const SipProvider = ({ children }: SipProviderProps) => {
  const { navigate } = useRouting();
  const [ua, setUa] = useState<JsSIP.UA | null>(null);
  const [extension, setExtension] = useState<ExtensionWithCredentials | null>(
    null
  );
  const [number, setNumber] = useState<string>("");
  const [extensionState, setExtensionState] =
    useState<ExtensionState>("disconnected");

  const { bindEvents, unbindEvents } = useUaEvents({ setExtensionState });

  const login = (extension: ExtensionWithCredentials) => {
    setExtensionState("connecting");

    if (ua) ua.stop();

    const userAgent = createUserAgent(extension.uri, extension.password);
    setExtension(extension);
    bindEvents(userAgent);
    setUa(userAgent);

    navigate("dialpad");
  };

  const reconnect = () => {
    setExtensionState("connecting");

    if (!ua || !extension) return;
    ua.stop();
    unbindEvents(ua);

    const userAgent = createUserAgent(extension.uri, extension.password);
    bindEvents(userAgent);
    setUa(userAgent);
  };

  const logout = () => {
    if (ua) {
      ua.stop();
      unbindEvents(ua);
      setUa(null);
      setExtension(null);
    }
    navigate("extensions");
  };

  const call = (phoneNumber: string = number) => {
    if (!ua) {
      console.error("User agent is not initialized");
      return;
    }
    if (!phoneNumber) {
      console.error("Phone number is not provided");
      return;
    }

    return ua.call(phoneNumber, {
      mediaConstraints: {
        audio: true,
        video: false,
      },
    });
  };

  return (
    <SipContext.Provider
      value={{
        ua,
        extension,
        extensionState,
        number,
        login,
        logout,
        reconnect,
        call,
        setNumber,
      }}
    >
      {children}
    </SipContext.Provider>
  );
};

export const useSip = () => {
  const ctx = useContext(SipContext);
  if (!ctx) throw new Error("useSip must be used within a SipProvider");
  return ctx;
};
