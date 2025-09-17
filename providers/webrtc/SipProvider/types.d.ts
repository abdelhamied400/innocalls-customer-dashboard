import { ExtensionWithCredentials } from "@/types/api/extension";
import { AgentActivity } from "@/types/webrtc";
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
  login: (extension: ExtensionWithCredentials) => void;
  logout: () => void;
  reconnect: () => void;
  call: (number?: string) => RTCSession | undefined;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
  setDialCode: React.Dispatch<React.SetStateAction<string>>;
  spy: (extension: string) => void;
  spyingStatus: SpyingStatus;
  setSpyingStatus: React.Dispatch<React.SetStateAction<SpyingStatus>>;
  isSpying: boolean;
  extensionLoading: boolean;
  setExtension: React.Dispatch<
    React.SetStateAction<ExtensionWithCredentials | null>
  >;
  onActivityChange: (activity: AgentActivity) => Promise<void>;
};
