import { useCallback } from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { ExtensionState } from "./types";
import JsSIP from "jssip";
import { RTCSessionEvent } from "jssip/lib/UA";
import { RTCSession } from "jssip/lib/RTCSession";
import { ExtensionWithCredentials } from "@/types/api/extension";

import { addCallToLog } from "@/lib/call-log";

export type useUAEventsDeps = {
  setExtensionState: React.Dispatch<React.SetStateAction<ExtensionState>>;
  setCurrentSession?: React.Dispatch<React.SetStateAction<RTCSession | null>>;
};
export const useUaEvents = ({
  setExtensionState,
  setCurrentSession,
}: useUAEventsDeps) => {
  const { navigate } = useRouting();

  const handleIncomingCall = useCallback(
    (e: RTCSessionEvent, extension: ExtensionWithCredentials) => {
      console.log("Incoming call:", e.session);
      const session = e.session;
      const ringtone = document.createElement("audio");
      ringtone.src = "/assets/sound/ringtone.mp3";
      ringtone.load();

      const calleeNumber = session.remote_identity?.uri?.user || "Unknown";
      const calleeName = session.remote_identity?.display_name || "Unknown";

      session.on("progress", () => {
        console.log("Call is in progress");
        ringtone
          .play()
          .catch((err) => console.error("Error playing ringtone:", err));
      });

      session.on("confirmed", () => {
        ringtone.pause();
        ringtone.currentTime = 0;
        console.log("Call confirmed");

        // Log incoming call as answered
        addCallToLog(
          {
            type: "incoming",
            number: calleeNumber,
            name: calleeName,
          },
          extension.ext
        );

        navigate("/call");
        const connection = session.connection;

        connection.addEventListener("track", (event) => {
          const remoteAudio = document.createElement("audio");
          remoteAudio.srcObject = event.streams?.[0] || null;
          remoteAudio.play();
        });

        connection.addEventListener("addstream", (event: any) => {
          console.log("addstream", event);
        });
      });

      session.on("ended", (event) => {
        ringtone.pause();
        ringtone.currentTime = 0;
        console.log("Call ended:", event);

        // Check if call was never answered (missed call)
        if (session.start_time === null) {
          addCallToLog(
            {
              type: "missed",
              number: calleeNumber,
              name: calleeName,
            },
            extension.ext
          );
        }
      });

      session.on("failed", (event) => {
        ringtone.pause();
        ringtone.currentTime = 0;
      });

      navigate("/incoming-call");
    },
    []
  );

  const handleOutgoingCall = useCallback(
    (e: RTCSessionEvent, extension: ExtensionWithCredentials) => {
      console.log("Outgoing call:", e.session);
      const session = e.session;
      const connection = session.connection;

      const calledNumber = session.remote_identity?.uri?.user || "Unknown";

      session.on("confirmed", () => {
        console.log("Call confirmed");
        // Log outgoing call when call is initiated
        addCallToLog(
          {
            type: "outgoing",
            number: calledNumber,
          },
          extension.ext
        );
      });

      connection.addEventListener("track", (event) => {
        const remoteAudio = document.createElement("audio");
        remoteAudio.srcObject = event.streams?.[0] || null;
        remoteAudio.play();
      });

      connection.addEventListener("addstream", (event: any) => {
        console.log(event);
      });

      navigate("/call");
    },
    []
  );

  const bindEvents = useCallback(
    (userAgent: JsSIP.UA, extension: ExtensionWithCredentials) => {
      userAgent.on("connecting", () => setExtensionState("connecting"));
      userAgent.on("connected", () => setExtensionState("connected"));
      userAgent.on("disconnected", () => setExtensionState("disconnected"));
      userAgent.on("registrationFailed", (e) => {
        console.error("Registration failed:", e);
        setExtensionState("disconnected");
      });
      userAgent.on("newRTCSession", (e: RTCSessionEvent) => {
        const session = e.session;
        const calleeNumber = session.remote_identity?.uri?.user || "Unknown";
        const calleeName = session.remote_identity?.display_name || "Unknown";

        setCurrentSession?.(session);

        session.on("ended", (event) => {
          console.log("Call ended:", event);
          navigate("/dialpad");
        });
        session.on("failed", (event) => {
          console.log("Call failed:", event);
          navigate("/dialpad");

          // Log as rejected if call was actively rejected
          if (
            event.cause === JsSIP.C.causes.REJECTED ||
            event.cause === JsSIP.C.causes.BUSY
          ) {
            addCallToLog(
              {
                type: "rejected",
                number: calleeNumber,
                name: calleeName,
              },
              extension.ext
            );
          } else {
            // Otherwise log as missed
            addCallToLog(
              {
                type: "missed",
                number: calleeNumber,
                name: calleeName,
              },
              extension.ext
            );
          }
        });

        if (e.session.direction === "incoming") {
          handleIncomingCall(e, extension);
        } else {
          handleOutgoingCall(e, extension);
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
