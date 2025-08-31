"use client";

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { ExtensionWithCredentials } from "@/types/api/extension";
import { sipManager } from "./SipProvider/sipManager";
import type {
  SipContextType,
  ExtensionState,
  SessionState,
  SpyingStatus,
} from "./SipProvider/types";

import JsSIP from "jssip";
import { useUaEvents } from "./SipProvider/useUaEvents";
import { RTCSession } from "jssip/lib/RTCSession";
import { defaultCountry } from "@/constants/countries";
import { useToast } from "@/hooks/use-toast";

const SipContext = createContext<SipContextType | null>(null);

// Global singleton state to survive provider re-creation
let globalState: {
  ua: JsSIP.UA | null;
  extension: ExtensionWithCredentials | null;
  extensionState: ExtensionState;
  subscribers: Set<() => void>;
} = {
  ua: null,
  extension: null,
  extensionState: "disconnected",
  subscribers: new Set(),
};

const notifySubscribers = () => {
  globalState.subscribers.forEach((callback) => callback());
};

const setGlobalExtensionState = (state: ExtensionState) => {
  globalState.extensionState = state;
  notifySubscribers();
};

const setGlobalExtension = (extension: ExtensionWithCredentials | null) => {
  globalState.extension = extension;
  notifySubscribers();
};

const setGlobalUA = (ua: JsSIP.UA | null) => {
  globalState.ua = ua;
  notifySubscribers();
};

type SipProviderProps = PropsWithChildren<{}>;
export const SipProvider = ({ children }: SipProviderProps) => {
  const { navigate } = useRouting();

  // Use global state that survives provider re-creation
  const [ua, setUa] = useState<JsSIP.UA | null>(globalState.ua);
  const [extension, setExtension] = useState<ExtensionWithCredentials | null>(
    globalState.extension
  );
  const [extensionState, setExtensionState] = useState<ExtensionState>(
    globalState.extensionState
  );
  const [forceRender, setForceRender] = useState(0);

  const [currentSession, setCurrentSession] = useState<RTCSession | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>();
  const [callStartTime, setCallStartTime] = useState<number | null>(null);

  // Track when call starts (answered) to record start time
  useEffect(() => {
    if (sessionState === "answered" && !callStartTime) {
      setCallStartTime(Date.now());
    } else if (sessionState === "ended" || sessionState === "failed") {
      setCallStartTime(null);
    }
  }, [sessionState, callStartTime]);

  const { toast } = useToast();

  const [number, setNumber] = useState<string>("");
  const [dialCode, setDialCode] = useState<string>(defaultCountry.code);

  // Subscribe to global state changes
  useEffect(() => {
    const handleGlobalStateChange = () => {
      setUa(globalState.ua);
      setExtension(globalState.extension);
      setExtensionState(globalState.extensionState);
      setForceRender((prev) => prev + 1);
    };

    globalState.subscribers.add(handleGlobalStateChange);
    return () => {
      globalState.subscribers.delete(handleGlobalStateChange);
    };
  }, []);

  const [spyingStatus, setSpyingStatus] = useState<SpyingStatus>("spy");
  const [isSpying, setIsSpying] = useState(false);

  // Single session management state
  const [isConnecting, setIsConnecting] = useState(false);
  const [registrationAttempts, setRegistrationAttempts] = useState(0);
  const [lastLoginAttempt, setLastLoginAttempt] = useState(0);

  const { bindEvents, unbindEvents } = useUaEvents({
    setExtensionState: setGlobalExtensionState,
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
        setGlobalUA(currentUA); // Ensure UA is set in global state
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

        setGlobalExtension(extension);
        bindEvents(userAgent, extension);
        setGlobalUA(userAgent); // Set UA immediately for extension bar and calls to work

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
      setGlobalUA(userAgent);

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
      setGlobalExtension(null);
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
