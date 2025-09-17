"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouting } from "@/providers/RoutingProvider";
import { ExtensionWithCredentials } from "@/types/api/extension";
import { createUserAgent } from "./SipProvider/userAgent";
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
import { useSession } from "next-auth/react";
import webrtcService from "@/services/webrtc.service";
import CryptoJS from "crypto-js";
import { webrtcStoppingActivities } from "@/constants/agent-activity";
import { AgentActivity } from "@/types/webrtc";
import useAuth from "@/hooks/useAuth";

const SipContext = createContext<SipContextType | null>(null);

// Module-level tracking for auto-login attempts per session
const autoLoginAttempts = new Map<string, boolean>();

// Global registry to track all active user agents for cleanup
const activeUserAgents = new Set<JsSIP.UA>();

// Cleanup function to stop all previous user agents
const cleanupAllUserAgents = () => {
  activeUserAgents.forEach((ua) => {
    try {
      ua.stop();
    } catch (error) {
      console.warn("Error stopping user agent:", error);
    }
  });
  activeUserAgents.clear();
};

// Clear attempts on page load/refresh
if (typeof window !== "undefined") {
  autoLoginAttempts.clear();
  cleanupAllUserAgents();
}

type SipProviderProps = PropsWithChildren<{}>;
export const SipProvider = ({ children }: SipProviderProps) => {
  const { navigate } = useRouting();
  const { data: session } = useSession();
  const { data: auth } = useAuth();

  const hasAttemptedAutoLogin = useRef(false);

  const [ua, setUa] = useState<JsSIP.UA | null>(null);
  const [extension, setExtension] = useState<ExtensionWithCredentials | null>(
    null
  );

  const [currentSession, setCurrentSession] = useState<RTCSession | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>();
  const breakType =
    auth?.user?.latestActivity?.type || AgentActivity.CONNECTED_NOT_READY;

  const uaRef = useRef<JsSIP.UA | null>(null);

  // Keep uaRef in sync with ua state
  useEffect(() => {
    uaRef.current = ua;
  }, [ua]);

  const { toast } = useToast();

  const [number, setNumber] = useState<string>("");
  const [dialCode, setDialCode] = useState<string>(defaultCountry.code);

  const [extensionState, setExtensionState] =
    useState<ExtensionState>("disconnected");
  const [extensionLoading, setExtensionLoading] = useState(false);

  const [spyingStatus, setSpyingStatus] = useState<SpyingStatus>("spy");
  const [isSpying, setIsSpying] = useState(false);

  const { bindEvents, unbindEvents } = useUaEvents({
    setExtensionState,
    setCurrentSession,
    setSessionState,
    setIsSpying,
    setSpyingStatus,
  });

  const login = useCallback(
    (extensionData: ExtensionWithCredentials) => {
      // Use ref to avoid dependency on ua state
      if (uaRef.current) {
        activeUserAgents.delete(uaRef.current);
        uaRef.current.stop();
      }

      // Clean up any other active user agents before creating new one
      cleanupAllUserAgents();

      // Create UA without starting it first so we can bind events
      const SIP_INTERFACE = process.env.NEXT_PUBLIC_SIP_INTERFACE!;
      const DECRYPT_SECRET = process.env.NEXT_PUBLIC_DECRYPT_SECRET!;

      const socket = new JsSIP.WebSocketInterface(SIP_INTERFACE);
      const passwordBytes = CryptoJS.AES.decrypt(
        extensionData.password,
        DECRYPT_SECRET
      );
      const decryptedPassword = passwordBytes.toString(CryptoJS.enc.Utf8);

      const userAgent = new JsSIP.UA({
        sockets: [socket],
        uri: extensionData.uri,
        password: decryptedPassword,
        user_agent: "platform-webrtc",
      });

      // Register the new user agent
      activeUserAgents.add(userAgent);

      bindEvents(userAgent, extensionData);
      setUa(userAgent);
      userAgent.start();
      navigate("/dialpad");
    },
    [bindEvents, navigate] // Removed ua dependency
  );

  const reconnect = () => {
    setExtensionState("connecting");

    if (!extension) return;
    if (!!ua) {
      ua.stop();
      unbindEvents(ua);
    }

    login(extension);
  };

  const cleanup = () => {
    if (ua) {
      activeUserAgents.delete(ua);
      ua.stop();
      unbindEvents(ua);
      setUa(null);
      setExtension(null);
    }
    // Reset auto-login flag when user manually logs out
    if (auth?.user?.id) {
      hasAttemptedAutoLogin.current = false;
    }
  };

  const logout = () => {
    cleanup();
    navigate("/extensions");
  };

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

  const spy = (extension: string) => {
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
  };

  const onActivityChange = async (activity: AgentActivity) => {
    try {
      const shouldLogout = webrtcStoppingActivities.includes(activity);
      if (shouldLogout) {
        cleanup();
      } else if (!!extension && !ua) {
        login(extension);
      }
    } catch (error) {
      console.error("Error changing agent state on activity change:", error);
    }
  };

  // Auto-login for agent users
  useEffect(() => {
    const attemptAutoLogin = async () => {
      const sessionId = auth?.user?.id;

      // Additional safeguards
      if (!sessionId) return; // No valid session
      if (session?.userType !== "agent") return; // Not an agent
      if (extensionState !== "disconnected") return; // Already connected/connecting
      if (hasAttemptedAutoLogin.current) return; // Already attempted for this provider instance

      hasAttemptedAutoLogin.current = true;

      // Add a small delay to ensure everything is initialized
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        setExtensionLoading(true);
        const agent = await webrtcService.getAgentExtension();
        setExtension(agent);

        if (!!breakType && webrtcStoppingActivities.includes(breakType)) return; // On break
        login(agent);
      } catch (error) {
        console.error("Auto-login failed:", error);
        // Reset flag to allow retry after a delay
        setTimeout(() => {
          hasAttemptedAutoLogin.current = false;
        }, 5000); // Wait 5 seconds before allowing retry
      } finally {
        setExtensionLoading(false);
      }
    };

    // Only run if we have a complete session
    if (auth?.user?.id) {
      attemptAutoLogin();
    }
  }, [
    session?.userType,
    auth?.user?.id,
    extensionState,
    login,
    bindEvents,
    navigate,
  ]); // login is now stable due to useCallback with stable dependencies

  // Cleanup on unmount and when new instances are created
  useEffect(() => {
    return () => {
      if (uaRef.current) {
        activeUserAgents.delete(uaRef.current);
        try {
          uaRef.current.stop();
          unbindEvents(uaRef.current);
        } catch (error) {
          console.warn("Error during unmount cleanup:", error);
        }
      }
    };
  }, [unbindEvents]);

  useEffect(() => {
    if (window) {
      window.onbeforeunload = (event) => {
        currentSession?.terminate();
        return null;
      };
    }
  }, [currentSession]);

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
        login,
        logout,
        reconnect,
        call,
        setNumber,
        setDialCode,
        spy,
        setExtension,
        spyingStatus,
        setSpyingStatus,
        isSpying,
        extensionLoading,
        onActivityChange,
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
