import { ExtensionWithCredentials } from "@/types/api/extension";
import JsSIP from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";
import React from "react";

export type ExtensionState = "connecting" | "connected" | "disconnected";

export type SipContextType = {
  extension: ExtensionWithCredentials | null;
  ua: JsSIP.UA | null;
  extensionState: ExtensionState;
  number: string;
  countryCode: string;
  currentSession: RTCSession | null;
  login: (extension: ExtensionWithCredentials) => void;
  logout: () => void;
  reconnect: () => void;
  call: (number?: string) => RTCSession | undefined;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
};
