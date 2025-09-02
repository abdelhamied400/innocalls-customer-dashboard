import { ExtensionWithCredentials } from "@/types/api/extension";
import JsSIP from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";
import React from "react";

export type ExtensionState = "connecting" | "connected" | "disconnected";
export type SpyingStatus = "spy" | "whisper" | "barrage";

export type SessionState =
  | "trying"
  | "ringing"
  | "answered"
  | "ended"
  | "failed"
  | undefined;

export type SipContextType = {
  extension: ExtensionWithCredentials | null;
  ua: JsSIP.UA | null;
  extensionState: ExtensionState;
  number: string;
  dialCode: string;
  currentSession: RTCSession | null;
  sessionState?: SessionState;
  callStartTime: number | null;
  login: (extension: ExtensionWithCredentials) => void;
  logout: () => void;
  reconnect: () => void;
  call: (number?: string) => RTCSession | undefined;
  setNumber: (number: string) => void;
  setDialCode: (code: string) => void;
  spy: (extension: string) => void;
  spyingStatus: SpyingStatus;
  setSpyingStatus: (status: SpyingStatus) => void;
  isSpying: boolean;
};
