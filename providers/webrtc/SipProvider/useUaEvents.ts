import { useCallback, useEffect, useRef } from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { ExtensionState, SessionState, SpyingStatus } from "./types";
import JsSIP, { C } from "jssip";
import { RTCSessionEvent } from "jssip/lib/UA";
import { RTCSession } from "jssip/lib/RTCSession";
import { ExtensionWithCredentials } from "@/types/api/extension";

import { addCallToLog } from "@/lib/call-log";
import { webrtcLogger } from "@/lib/logger";
import useWebrtcStore from "@/store/webrtc.slice";
import webrtcService from "@/services/webrtc.service";
import { differenceInSeconds, format, intervalToDuration } from "date-fns";
import { useSession } from "next-auth/react";

export type useUAEventsDeps = {
  setExtensionState: React.Dispatch<React.SetStateAction<ExtensionState>>;
  setCurrentSession: React.Dispatch<React.SetStateAction<RTCSession | null>>;
  setSessionState: React.Dispatch<
    React.SetStateAction<SessionState | undefined>
  >;
  setIsSpying: React.Dispatch<React.SetStateAction<boolean>>;
  setSpyingStatus: React.Dispatch<React.SetStateAction<SpyingStatus>>;
};
export const useUaEvents = ({
  setExtensionState,
  setCurrentSession,
  setSessionState,
  setIsSpying,
  setSpyingStatus,
}: useUAEventsDeps) => {
  const { navigate } = useRouting();
  const { data: authSession } = useSession();
  const {
    setCallStartTime,
    setCallSummaryModalOpen,
    lastCall,
    updateLastCall,
  } = useWebrtcStore();
  const currentCallId = useRef("");

  useEffect(() => {
    currentCallId.current = lastCall?.callId || "";
  }, [lastCall]);

  // Helper to update session state if setter is provided
  const updateSessionState = useCallback(
    (state: SessionState | undefined) => {
      setSessionState?.(state);
    },
    [setSessionState]
  );

  const handleIncomingCall = useCallback(
    (e: RTCSessionEvent, extension: ExtensionWithCredentials) => {
      webrtcLogger.info("Incoming call received", { session: e.session });
      const session = e.session;
      const ringtone = document.createElement("audio");
      ringtone.src = "/assets/sound/ringtone.mp3";
      ringtone.load();

      const calleeNumber = session.remote_identity?.uri?.user || "Unknown";
      const calleeName = session.remote_identity?.display_name || "Unknown";

      session.on("progress", () => {
        webrtcLogger.info("Call is in progress");
        ringtone
          .play()
          .catch((err) => webrtcLogger.error("Error playing ringtone", err));
        updateSessionState("ringing");
      });

      session.on("confirmed", () => {
        ringtone.pause();
        ringtone.currentTime = 0;
        webrtcLogger.info("Call confirmed");

        // Log incoming call as answered
        addCallToLog(
          {
            type: "incoming",
            number: calleeNumber,
            name: calleeName,
          },
          extension.ext
        );

        updateSessionState("answered");
        navigate("/call");
      });

      session.on("ended", (event) => {
        ringtone.pause();
        ringtone.currentTime = 0;
        webrtcLogger.info("Call ended", event);

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
        updateSessionState("ended");
      });

      session.on("failed", (event) => {
        ringtone.pause();
        ringtone.currentTime = 0;

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
        updateSessionState("failed");
      });

      navigate("/incoming-call");
    },
    [navigate, updateSessionState]
  );

  const handleOutgoingCall = useCallback(
    (e: RTCSessionEvent, extension: ExtensionWithCredentials) => {
      webrtcLogger.info("Outgoing call initiated", { session: e.session });
      const session = e.session;
      const connection = session.connection;

      const calledNumber = session.remote_identity?.uri?.user || "Unknown";

      addCallToLog(
        {
          type: "outgoing",
          number: calledNumber,
        },
        extension.ext
      );

      updateSessionState("trying");

      session.on("progress", () => {
        webrtcLogger.info("Call is in progress");
        updateSessionState("ringing");
      });
      session.on("confirmed", () => {
        webrtcLogger.info("Outgoing call confirmed");
        // Log outgoing call when call is initiated
        updateSessionState("answered");
      });

      session.on("failed", (event) => {
        if (
          authSession?.user?.userType === "agent" &&
          !!currentCallId.current
        ) {
          setCallSummaryModalOpen(true);
        }
      });

      connection.addEventListener("addstream", (e: any) => {
        webrtcLogger.debug("Stream added", e);
        const remoteAudio = document.createElement("audio");
        remoteAudio.srcObject = e.stream;
        remoteAudio.play();
      });

      connection.addEventListener("track", (e) => {
        webrtcLogger.debug("Track event", e);
        const remoteAudio = document.createElement("audio");
        remoteAudio.srcObject = e.streams && e.streams[0] ? e.streams[0] : null;
        remoteAudio.play();
      });

      navigate("/call");
      updateSessionState("trying");
    },
    [navigate, updateSessionState]
  );

  const bindEvents = useCallback(
    (userAgent: JsSIP.UA, extension: ExtensionWithCredentials) => {
      userAgent.on("connecting", () => setExtensionState("connecting"));
      userAgent.on("connected", () => setExtensionState("connected"));
      userAgent.on("disconnected", () => setExtensionState("disconnected"));
      userAgent.on("registrationFailed", (e) => {
        webrtcLogger.error("Registration failed", e);
        setExtensionState("disconnected");
      });
      userAgent.on("newRTCSession", async (e: RTCSessionEvent) => {
        const session = e.session;

        setCurrentSession?.(session);

        const phoneNumber = session.remote_identity?.uri?.user;
        let dateNow: Date | null = null;

        session.on("progress", async () => {
          if (authSession?.user?.userType === "agent") {
            const liveCall = await webrtcService
              .searchAgentLiveCalls(phoneNumber)
              .catch((err) => {
                webrtcLogger.error("Error searching live calls", err);
                return null;
              });

            if (!!liveCall?.callId) {
              webrtcLogger.info("Found live call with ID", {
                callId: liveCall.callId,
              });
              updateLastCall({
                callId: liveCall.callId,
                from: extension.ext,
                to: phoneNumber,
                direction: session.direction as "incoming" | "outgoing",
              });
            } else {
              webrtcLogger.info("No live call found for this session");
            }
          }
          updateLastCall({
            callDateTime: new Date(),
          });
        });

        session.on("confirmed", () => {
          webrtcLogger.info("Call confirmed");
          setCallStartTime?.(Date.now());
          dateNow = new Date();
          updateLastCall({
            status: "Answered",
          });
        });

        session.on("ended", (event) => {
          webrtcLogger.info("Call ended", event);
          navigate("/dialpad");
          setCurrentSession?.(null);
          updateSessionState("ended");
          setSpyingStatus("spy");
          setIsSpying(false);

          if (
            authSession?.user?.userType === "agent" &&
            !!currentCallId.current
          ) {
            setCallSummaryModalOpen(true);
          }
          updateLastCall({
            duration: differenceInSeconds(new Date(), dateNow || new Date()),
          });
        });
        session.on("failed", (event) => {
          webrtcLogger.warn("Call failed", event);
          navigate("/dialpad");
          setCurrentSession?.(null);
          updateSessionState("failed");
          setSpyingStatus("spy");
          setIsSpying(false);

          const failStatus = event.cause;
          if (failStatus === C.causes.BUSY) {
            updateLastCall({ status: "Busy" });
          } else if (failStatus === C.causes.CANCELED) {
            updateLastCall({ status: "Unanswered" });
          } else if (failStatus === C.causes.REJECTED) {
            updateLastCall({ status: "Busy" });
          } else if (failStatus === C.causes.SIP_FAILURE_CODE) {
            updateLastCall({ status: "Unanswered" });
          } else {
            updateLastCall({ status: "Failed" });
          }
        });

        if (e.session.direction === "incoming") {
          handleIncomingCall(e, extension);
        } else {
          handleOutgoingCall(e, extension);
        }
      });
    },
    [
      setExtensionState,
      handleIncomingCall,
      handleOutgoingCall,
      setCurrentSession,
      navigate,
      updateSessionState,
    ]
  );

  const unbindEvents = useCallback(
    (userAgent: JsSIP.UA) => {
      userAgent.removeAllListeners(); // or remove specific if needed
      setExtensionState("disconnected");
      updateSessionState(undefined);
    },
    [setExtensionState, updateSessionState]
  );

  return { bindEvents, unbindEvents };
};
