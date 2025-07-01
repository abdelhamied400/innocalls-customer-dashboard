import { useCallback } from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { ExtensionState } from "./types";
import JsSIP from "jssip";
import { RTCSessionEvent } from "jssip/lib/UA";
import { RTCSession } from "jssip/lib/RTCSession";

export type useUAEventsDeps = {
  setExtensionState: React.Dispatch<React.SetStateAction<ExtensionState>>;
  setCurrentSession?: React.Dispatch<React.SetStateAction<RTCSession | null>>;
};

export const useUaEvents = ({
  setExtensionState,
  setCurrentSession,
}: useUAEventsDeps) => {
  const { navigate } = useRouting();

  const handleIncomingCall = useCallback((e: RTCSessionEvent) => {
    console.log("Incoming call:", e.session);
    const session = e.session;

    session.on("confirmed", () => {
      navigate("call");
      const connection = session.connection;

      connection.addEventListener("track", (event) => {
        const remoteAudio = document.createElement("audio");
        remoteAudio.srcObject = event.streams?.[0] || null;
        remoteAudio.play();
      });

      connection.addEventListener("addstream", (event: any) => {
        console.log(event);
      });
    });

    navigate("incoming-call");
  }, []);

  const handleOutgoingCall = useCallback((e: RTCSessionEvent) => {
    console.log("Outgoing call:", e.session);
    const session = e.session;
    const connection = session.connection;

    connection.addEventListener("track", (event) => {
      const remoteAudio = document.createElement("audio");
      remoteAudio.srcObject = event.streams?.[0] || null;
      remoteAudio.play();
    });

    connection.addEventListener("addstream", (event: any) => {
      console.log(event);
    });
    navigate("call");
  }, []);

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
        const session = e.session;
        setCurrentSession?.(session);

        session.on("ended", (event) => {
          console.log("Call ended:", event);
          navigate("dialpad");
        });
        session.on("failed", (event) => {
          console.log("Call failed:", event);
          navigate("dialpad");
        });

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
    setExtensionState("disconnected");
  }, []);

  return { bindEvents, unbindEvents };
};
