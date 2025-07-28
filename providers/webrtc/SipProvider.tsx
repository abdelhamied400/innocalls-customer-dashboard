"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { ExtensionWithCredentials } from "@/types/api/extension";
import { createUserAgent } from "./SipProvider/userAgent";
import type { SipContextType, ExtensionState } from "./SipProvider/types";

import JsSIP from "jssip";
import { useUaEvents } from "./SipProvider/useUaEvents";
import { RTCSession } from "jssip/lib/RTCSession";
import { defaultCountry } from "@/constants/countries";
import { replaceCountryCode } from "@/lib/webrtc";
import { useToast } from "@/hooks/use-toast";

const SipContext = createContext<SipContextType | null>(null);

type SipProviderProps = PropsWithChildren<{}>;
export const SipProvider = ({ children }: SipProviderProps) => {
  const { navigate } = useRouting();
  const [ua, setUa] = useState<JsSIP.UA | null>(null);
  const [extension, setExtension] = useState<ExtensionWithCredentials | null>(
    null
  );
  const [currentSession, setCurrentSession] = useState<RTCSession | null>(null);
  const { toast } = useToast();

  const [number, setNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>(defaultCountry.code);

  const [extensionState, setExtensionState] =
    useState<ExtensionState>("disconnected");

  const { bindEvents, unbindEvents } = useUaEvents({
    setExtensionState,
    setCurrentSession,
  });

  const login = (extension: ExtensionWithCredentials) => {
    setExtensionState("connecting");

    if (ua) ua.stop();

    const userAgent = createUserAgent(extension.uri, extension.password);
    setExtension(extension);
    bindEvents(userAgent, extension);
    setUa(userAgent);

    navigate("/dialpad");
  };

  const reconnect = () => {
    setExtensionState("connecting");

    if (!ua || !extension) return;
    ua.stop();
    unbindEvents(ua);

    const userAgent = createUserAgent(extension.uri, extension.password);
    bindEvents(userAgent, extension);
    setUa(userAgent);
  };

  const logout = () => {
    if (ua) {
      ua.stop();
      unbindEvents(ua);
      setUa(null);
      setExtension(null);
    }
    navigate("/extensions");
  };

  const call = (phoneNumber?: string) => {
    const calleeNumber = replaceCountryCode(
      phoneNumber || `${countryCode}${number}`
    );
    if (!ua) {
      console.error("User agent is not initialized");
      return;
    }
    if (!phoneNumber && !number) {
      console.error("Phone number is not provided");
      return;
    }

    return ua.call(calleeNumber, {
      mediaConstraints: {
        audio: true,
        video: false,
      },
    });
  };

  const spy = (extension: string) => {
    if (!ua) {
      toast({
        title: "Error",
        description: "WebRTC is not initialized",
        variant: "destructive",
      });
      return;
    }

    // check if already on call
    if (!!currentSession) {
      toast({
        title: "Error",
        description: "You are already on a call.",
        variant: "destructive",
      });
      return;
    }

    return call(`*199${extension}`);
  };

  return (
    <SipContext.Provider
      value={{
        ua,
        extension,
        extensionState,
        number,
        countryCode,
        currentSession,
        login,
        logout,
        reconnect,
        call,
        setNumber,
        setCountryCode,
        spy,
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
