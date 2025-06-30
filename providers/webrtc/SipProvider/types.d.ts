import { ExtensionWithCredentials } from "@/types/api/extension";
import JsSIP from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";

export type ExtensionState = "connecting" | "connected" | "disconnected";

export type SipContextType = {
  login: (extension: ExtensionWithCredentials) => void;
  extension: ExtensionWithCredentials | null;
  ua: JsSIP.UA | null;
  reconnect: () => void;
  logout: () => void;
  extensionState: ExtensionState;
  call: (number?: string) => RTCSession | undefined;
};
