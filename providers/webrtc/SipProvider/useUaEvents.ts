import { useCallback, useEffect, useRef } from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { ExtensionState, SessionState, SpyingStatus } from "./types";
import JsSIP, { C } from "jssip";
import { RTCSessionEvent } from "jssip/src/UA";
import { CallListener, OutgoingEvent, RTCSession } from "jssip/src/RTCSession";
import { ExtensionWithCredentials } from "@/types/api/extension";

import { addCallToLog } from "@/lib/call-log";
import { webrtcLogger } from "@/lib/logger";
import useWebrtcStore from "@/store/webrtc.slice";
import webrtcService from "@/services/webrtc.service";
import { differenceInSeconds, format, intervalToDuration } from "date-fns";
import { useSession } from "next-auth/react";
import { forcePCMA, parseAutoDialerCallee } from "@/lib/webrtc";
import { processPhoneNumber } from "@/lib/dialpad-utils";

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
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const ringingToneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    currentCallId.current = lastCall?.callId || "";
  }, [lastCall]);

  // Helper to update session state if setter is provided
  const updateSessionState = useCallback(
    (state: SessionState | undefined) => {
      setSessionState?.(state);
    },
    [setSessionState],
  );

  const stopRingtone = useCallback(() => {
    const ringtone = ringtoneRef.current;
    if (!ringtone) return;

    try {
      ringtone.pause();
      ringtone.currentTime = 0;
    } catch (error) {
      webrtcLogger.warn("Failed to stop ringtone", error);
    } finally {
      ringtoneRef.current = null;
    }
  }, []);

  const handleIncomingCall = useCallback(
    (e: RTCSessionEvent, extension: ExtensionWithCredentials) => {
      stopRingtone();
      webrtcLogger.info("Incoming call received", { session: e.session });
      const session = e.session;
      const ringtone = document.createElement("audio");
      ringtone.src = "/assets/sound/ringtone.mp3";
      ringtone.load();
      ringtoneRef.current = ringtone;

      const calleeNumber = session.remote_identity?.uri?.user || "Unknown";
      const displayName = session.remote_identity?.display_name || "Unknown";

      const { name: calleeName } = parseAutoDialerCallee(
        displayName || calleeNumber || "",
      );

      const { processedNumber } = processPhoneNumber(calleeNumber, true);

      session.on("progress", () => {
        webrtcLogger.info("Call is in progress");
        ringtoneRef.current
          ?.play()
          .catch((err) => webrtcLogger.error("Error playing ringtone", err));
        updateSessionState("ringing");
      });

      session.on("confirmed", () => {
        stopRingtone();
        webrtcLogger.info("Call confirmed");

        // Log incoming call as answered
        addCallToLog(
          {
            type: "incoming",
            number: processedNumber,
            name: calleeName,
          },
          extension.ext,
        );

        updateSessionState("answered");
        navigate("/call");
      });

      session.on("ended", (event) => {
        stopRingtone();
        webrtcLogger.info("Call ended", event);

        // Check if call was never answered (missed call)
        if (session.start_time === null) {
          addCallToLog(
            {
              type: "missed",
              number: processedNumber,
              name: calleeName,
            },
            extension.ext,
          );
        }
        updateSessionState("ended");
      });

      session.on("failed", (event) => {
        stopRingtone();

        // Log as rejected if call was actively rejected
        if (
          event.cause === JsSIP.C.causes.REJECTED ||
          event.cause === JsSIP.C.causes.BUSY
        ) {
          addCallToLog(
            {
              type: "rejected",
              number: processedNumber,
              name: calleeName,
            },
            extension.ext,
          );
          updateSessionState("rejected");
        } else {
          // Otherwise log as missed
          addCallToLog(
            {
              type: "missed",
              number: processedNumber,
              name: calleeName,
            },
            extension.ext,
          );
          updateSessionState("missed");
        }
        // updateSessionState("failed");
      });

      navigate("/incoming-call");
    },
    [navigate, stopRingtone, updateSessionState],
  );

  const handleOutgoingCall = useCallback(
    (e: RTCSessionEvent, extension: ExtensionWithCredentials) => {
      webrtcLogger.info("Outgoing call initiated", { session: e.session });
      const session = e.session;

      session.on("sdp", (e) => {
        // e.sdp = forcePCMA(e.sdp);
      });

      const connection = session.connection;

      const calledNumber = session.remote_identity?.uri?.user || "Unknown";
      const { processedNumber } = processPhoneNumber(calledNumber, true);

      addCallToLog(
        {
          type: "outgoing",
          number: processedNumber,
        },
        extension.ext,
      );

      updateSessionState("trying");

      session.on("progress", (e: OutgoingEvent) => {
        webrtcLogger.info("Call is in progress");
        updateSessionState("ringing");

        if (e.response.status_code === 180) {
          playRingingTone();
        }
      });

      session.on("confirmed", () => {
        webrtcLogger.info("Outgoing call confirmed");
        // Log outgoing call when call is initiated
        updateSessionState("answered");
      });

      session.on("failed", (event) => {
        if (authSession?.userType === "agent" && !!currentCallId.current) {
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
    [navigate, updateSessionState],
  );

  const playRingingTone = useCallback(() => {
    if (ringingToneRef.current) {
      // Already playing
      return ringingToneRef.current;
    }
    ringingToneRef.current = document.createElement("audio");
    ringingToneRef.current.src = "/assets/sound/ringing.mp3";
    ringingToneRef.current.load();
    ringingToneRef.current.loop = true;
    ringingToneRef.current
      .play()
      .catch((err) => webrtcLogger.error("Error playing ringing tone", err));
    return ringingToneRef.current;
  }, []);

  const stopRingingTone = useCallback(() => {
    if (ringingToneRef.current) {
      ringingToneRef.current.pause();
      ringingToneRef.current.currentTime = 0;
    }
  }, []);

  const bindEvents = useCallback(
    (userAgent: JsSIP.UA, extension: ExtensionWithCredentials) => {
      const ringingTone = document.createElement("audio");
      ringingTone.src = "/assets/sound/ringing.mp3";
      ringingTone.load();
      ringingTone.loop = true;

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
          if (authSession?.userType === "agent") {
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
          stopRingingTone();
          setCallStartTime?.(Date.now());
          dateNow = new Date();
          updateLastCall({
            status: "Answered",
          });
        });

        session.on("ended", (event) => {
          stopRingtone();
          stopRingingTone();
          webrtcLogger.info("Call ended", event);
          setTimeout(() => {
            navigate("/dialpad");
            setCurrentSession?.(null);
          }, 2000);
          updateSessionState("ended");
          setSpyingStatus("spy");
          setIsSpying(false);

          if (authSession?.userType === "agent" && !!currentCallId.current) {
            setCallSummaryModalOpen(true);
          }
          updateLastCall({
            duration: differenceInSeconds(new Date(), dateNow || new Date()),
          });
        });
        session.on("failed", (event) => {
          stopRingtone();
          stopRingingTone();
          webrtcLogger.warn("Call failed", event);
          setTimeout(() => {
            navigate("/dialpad");
            setCurrentSession?.(null);
          }, 2000);
          // updateSessionState("failed");
          setSpyingStatus("spy");
          setIsSpying(false);

          const failStatus = event.cause;
          if (failStatus === C.causes.BUSY) {
            updateLastCall({ status: "Busy" });
            updateSessionState("busy");
          } else if (failStatus === C.causes.CANCELED) {
            updateLastCall({ status: "Unanswered" });
            updateSessionState("canceled");
          } else if (failStatus === C.causes.REJECTED) {
            updateLastCall({ status: "Busy" });
            updateSessionState("rejected");
          } else if (failStatus === C.causes.SIP_FAILURE_CODE) {
            updateLastCall({ status: "Unanswered" });
            updateSessionState("missed");
          } else if (failStatus === C.causes.USER_DENIED_MEDIA_ACCESS) {
            updateLastCall({ status: "Failed" });
            updateSessionState("user_denied_media");
          } else {
            updateLastCall({ status: "Failed" });
            updateSessionState("failed");
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
      stopRingtone,
      updateSessionState,
    ],
  );

  const unbindEvents = useCallback(
    (userAgent: JsSIP.UA) => {
      userAgent.removeAllListeners(); // or remove specific if needed
      setExtensionState("disconnected");
      updateSessionState(undefined);
      stopRingtone();
    },
    [setExtensionState, updateSessionState, stopRingtone],
  );

  return { bindEvents, unbindEvents, stopRingtone };
};
