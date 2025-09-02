"use client";

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { sipManager } from "./SipProvider/sipManager";
import type { SipContextType } from "./SipProvider/types";

import JsSIP from "jssip";
import { useUaEvents } from "./SipProvider/useUaEvents";
import { useToast } from "@/hooks/use-toast";
import useWebrtcStore from "@/store/webrtc.slice";
import { ExtensionWithCredentials } from "@/types/api/extension";

const SipContext = createContext<SipContextType | null>(null);

type SipProviderProps = PropsWithChildren<{}>;
export const SipProvider = ({ children }: SipProviderProps) => {
  const { navigate } = useRouting();
  const { toast } = useToast();

  // Use global WebRTC store instead of local state
  const {
    ua,
    setUa,
    extension,
    setExtension,
    extensionState,
    setExtensionState,
    currentSession,
    setCurrentSession,
    sessionState,
    setSessionState,
    callStartTime,
    setCallStartTime,
    number,
    setNumber,
    dialCode,
    setDialCode,
    spyingStatus,
    setSpyingStatus,
    isSpying,
    setIsSpying,
    isConnecting,
    setIsConnecting,
    registrationAttempts,
    setRegistrationAttempts,
    lastLoginAttempt,
    setLastLoginAttempt,
  } = useWebrtcStore();

  // Track when call starts (answered) to record start time
  useEffect(() => {
    if (sessionState === "answered" && !callStartTime) {
      setCallStartTime(Date.now());
    } else if (sessionState === "ended" || sessionState === "failed") {
      setCallStartTime(null);
    }
  }, [sessionState, callStartTime, setCallStartTime]);

  const { bindEvents, unbindEvents } = useUaEvents({
    setExtensionState,
    setCurrentSession,
    setSessionState,
    setIsSpying,
    setSpyingStatus,
  });

  // Helper function to properly disconnect existing session
  const disconnectExistingSession = async (): Promise<void> => {
    try {
      if (currentSession) {
        currentSession.terminate();
        setCurrentSession(null);
      }

      if (ua) {
        unbindEvents(ua);
      }

      await sipManager.destroyCurrentUA();
      setUa(null);
    } catch (error) {
      console.error("Error during disconnection:", error);
    }
  };

  const loginRef = React.useRef(false);

  const login = useCallback(
    async (extension: ExtensionWithCredentials) => {
      const now = Date.now();

      // Prevent multiple concurrent login attempts using ref
      if (loginRef.current) {
        return;
      }

      // Prevent multiple concurrent login attempts
      if (isConnecting) {
        return;
      }

      // Debounce login attempts (minimum 3 seconds between attempts)
      if (now - lastLoginAttempt < 3000) {
        return;
      }

      // Check if already connected to same URI
      const currentUA = sipManager.getCurrentUA();
      if (currentUA && sipManager.isConnected()) {
        setUa(currentUA); // Ensure UA is set in global state
        navigate("/dialpad");
        return;
      }

      loginRef.current = true;
      setIsConnecting(true);
      setLastLoginAttempt(now);
      setRegistrationAttempts(0);
      setExtensionState("connecting");

      try {
        // Ensure single session - cleanup any existing first
        const userAgent = await sipManager.ensureSingleSession(
          extension.uri,
          extension.password
        );

        setExtension(extension);
        bindEvents(userAgent, extension);
        setUa(userAgent); // Set UA immediately for extension bar and calls to work

        // Only start if not already started
        if (!userAgent.isConnected()) {
          userAgent.start();
        } else {
          // If already registered, navigate immediately
          if (userAgent.isRegistered()) {
            navigate("/dialpad");
          }
        }
      } catch (error) {
        console.error("❌ Login failed:", error);
        setExtensionState("disconnected");
        toast({
          title: "Connection Failed",
          description: `Unable to connect to SIP server: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          variant: "destructive",
        });
      } finally {
        loginRef.current = false;
        setIsConnecting(false);
      }
    },
    [navigate, toast, bindEvents, isConnecting, lastLoginAttempt]
  );

  const reconnect = useCallback(async () => {
    if (!extension) {
      return;
    }

    if (isConnecting) {
      return;
    }

    setIsConnecting(true);
    setExtensionState("connecting");

    try {
      // Ensure single session
      const userAgent = await sipManager.ensureSingleSession(
        extension.uri,
        extension.password
      );
      bindEvents(userAgent, extension);
      setUa(userAgent);

      // Start connection
      userAgent.start();
    } catch (error) {
      console.error("Reconnection failed:", error);
      setExtensionState("disconnected");
      toast({
        title: "Reconnection Failed",
        description: "Unable to reconnect to SIP server.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [extension, bindEvents, toast]);

  const logout = useCallback(async () => {
    setIsConnecting(true);

    try {
      await disconnectExistingSession();
      setExtension(null);
      navigate("/extensions");
    } finally {
      setIsConnecting(false);
    }
  }, [navigate]);

  const call = useCallback(
    (phoneNumber?: string) => {
      const calleeNumber = phoneNumber || number;
      if (!ua) {
        console.error("User agent is not initialized");
        return;
      }
      if (!phoneNumber && !number) {
        console.error("Phone number is not provided");
        return;
      }

      return ua.call(calleeNumber, {
        mediaConstraints: {
          audio: true,
          video: false,
        },
      });
    },
    [ua, number]
  );

  const spy = useCallback(
    (extension: string) => {
      if (!ua) {
        toast({
          title: "Error",
          description: "WebRTC is not initialized",
          variant: "destructive",
        });
        return;
      }

      // check if already on call
      if (!!currentSession) {
        toast({
          title: "Error",
          description: "You are already on a call.",
          variant: "destructive",
        });
        return;
      }

      setIsSpying(true);

      return call(`*199${extension}`);
    },
    [ua, currentSession, toast, call]
  );

  // Cleanup on page unload and component unmount
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const currentUA = sipManager.getCurrentUA();
      if (currentUA) {
        // Attempt graceful shutdown
        const currentSess = currentSession;
        currentSess?.terminate();
        currentUA.stop();
      }
      return null;
    };

    const handleUnload = () => {
      const currentUA = sipManager.getCurrentUA();
      if (currentUA) {
        currentUA.stop();
      }
    };

    const handleVisibilityChange = () => {
      const currentUA = sipManager.getCurrentUA();
      if (document.hidden && currentUA && extensionState === "connected") {
        // Page is hidden, but don't disconnect - just maintain connection
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function - ONLY runs on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Clean shutdown on component unmount ONLY
      sipManager.shutdown();
    };
  }, []); // Empty dependencies - only run on mount/unmount

  return (
    <SipContext.Provider
      value={{
        ua,
        extension,
        extensionState,
        number,
        dialCode,
        currentSession,
        sessionState,
        callStartTime,
        login,
        logout,
        reconnect,
        call,
        setNumber,
        setDialCode,
        spy,
        spyingStatus,
        setSpyingStatus,
        isSpying,
      }}
    >
      {children}
    </SipContext.Provider>
  );
};

export const useSip = () => {
  const ctx = useContext(SipContext);
  if (!ctx) throw new Error("useSip must be used within a SipProvider");
  return ctx;
};
