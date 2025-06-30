import { useCallback } from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { ExtensionState } from "./types";
import JsSIP from "jssip";
import { RTCSessionEvent } from "jssip/lib/UA";

export type useUAEventsDeps = {
  setExtensionState: React.Dispatch<React.SetStateAction<ExtensionState>>;
};

export const useUaEvents = ({ setExtensionState }: useUAEventsDeps) => {
  const { navigate } = useRouting();

  const handleIncomingCall = useCallback(
    (e: RTCSessionEvent) => {
      console.log("Incoming call:", e.session);
      navigate("call");
    },
    [navigate]
  );

  const handleOutgoingCall = useCallback(
    (e: RTCSessionEvent) => {
      console.log("Outgoing call:", e.session);
      navigate("call");
    },
    [navigate]
  );

  const bindEvents = useCallback(
    (userAgent: JsSIP.UA) => {
      userAgent.on("connecting", () => setExtensionState("connecting"));
      userAgent.on("connected", () => setExtensionState("connected"));
      userAgent.on("disconnected", () => setExtensionState("disconnected"));
      userAgent.on("registrationFailed", (e) => {
        console.error("Registration failed:", e);
        setExtensionState("disconnected");
      });
      userAgent.on("newRTCSession", (e: RTCSessionEvent) => {
        if (e.session.direction === "incoming") {
          handleIncomingCall(e);
        } else {
          handleOutgoingCall(e);
        }
      });
    },
    [setExtensionState, handleIncomingCall, handleOutgoingCall]
  );

  const unbindEvents = useCallback((userAgent: JsSIP.UA) => {
    userAgent.removeAllListeners(); // or remove specific if needed
  }, []);

  return { bindEvents, unbindEvents };
};
