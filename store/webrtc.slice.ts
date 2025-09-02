import { ExtensionWithCredentials } from "@/types/api/extension";
import {
  ExtensionState,
  SessionState,
  SpyingStatus,
} from "@/providers/webrtc/SipProvider/types";
import { RTCSession } from "jssip/lib/RTCSession";
import JsSIP from "jssip";
import { defaultCountry } from "@/constants/countries";
import { create } from "zustand";

type WebrtcStore = {
  // UA and Extension
  ua: JsSIP.UA | null;
  setUa: (ua: JsSIP.UA | null) => void;
  extension: ExtensionWithCredentials | null;
  setExtension: (ext: ExtensionWithCredentials | null) => void;
  extensionState: ExtensionState;
  setExtensionState: (state: ExtensionState) => void;

  // Call Session
  currentSession: RTCSession | null;
  setCurrentSession: (session: RTCSession | null) => void;
  sessionState: SessionState | undefined;
  setSessionState: (state: SessionState | undefined) => void;
  callStartTime: number | null;
  setCallStartTime: (time: number | null) => void;

  // Dialing
  number: string;
  setNumber: (number: string) => void;
  dialCode: string;
  setDialCode: (code: string) => void;

  // Spying
  spyingStatus: SpyingStatus;
  setSpyingStatus: (status: SpyingStatus) => void;
  isSpying: boolean;
  setIsSpying: (spying: boolean) => void;

  // Connection Management
  isConnecting: boolean;
  setIsConnecting: (connecting: boolean) => void;
  registrationAttempts: number;
  setRegistrationAttempts: (attempts: number) => void;
  lastLoginAttempt: number;
  setLastLoginAttempt: (time: number) => void;
};

const useWebrtcStore = create<WebrtcStore>()((set) => ({
  // UA and Extension
  ua: null,
  setUa: (ua: JsSIP.UA | null) => set({ ua }),
  extension: null,
  setExtension: (ext: ExtensionWithCredentials | null) =>
    set({ extension: ext }),
  extensionState: "disconnected",
  setExtensionState: (state: ExtensionState) => set({ extensionState: state }),

  // Call Session
  currentSession: null,
  setCurrentSession: (session: RTCSession | null) =>
    set({ currentSession: session }),
  sessionState: undefined,
  setSessionState: (state: SessionState | undefined) =>
    set({ sessionState: state }),
  callStartTime: null,
  setCallStartTime: (time: number | null) => set({ callStartTime: time }),

  // Dialing
  number: "",
  setNumber: (number: string) => set({ number }),
  dialCode: defaultCountry.code,
  setDialCode: (code: string) => set({ dialCode: code }),

  // Spying
  spyingStatus: "spy",
  setSpyingStatus: (status: SpyingStatus) => set({ spyingStatus: status }),
  isSpying: false,
  setIsSpying: (spying: boolean) => set({ isSpying: spying }),

  // Connection Management
  isConnecting: false,
  setIsConnecting: (connecting: boolean) => set({ isConnecting: connecting }),
  registrationAttempts: 0,
  setRegistrationAttempts: (attempts: number) =>
    set({ registrationAttempts: attempts }),
  lastLoginAttempt: 0,
  setLastLoginAttempt: (time: number) => set({ lastLoginAttempt: time }),
}));

export default useWebrtcStore;
