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
import { replaceDialCode } from "@/lib/webrtc";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import webrtcService from "@/services/webrtc.service";
import CryptoJS from "crypto-js";

const SipContext = createContext<SipContextType | null>(null);

// Module-level tracking for auto-login attempts per session
const autoLoginAttempts = new Map<string, boolean>();

// Global registry to track all active user agents for cleanup
const activeUserAgents = new Set<JsSIP.UA>();

// Cleanup function to stop all previous user agents
const cleanupAllUserAgents = () => {
  console.log("Cleaning up all active user agents:", activeUserAgents.size);
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
  const providerId = useRef(Math.random().toString(36).substr(2, 9));
  const hasAttemptedAutoLogin = useRef(false);

  console.log("SipProvider instance:", providerId.current);

  const [ua, setUa] = useState<JsSIP.UA | null>(null);
  const [extension, setExtension] = useState<ExtensionWithCredentials | null>(
    null
  );

  // Debug extension changes
  useEffect(() => {
    console.log(`[${providerId.current}] Extension changed to:`, extension);
  }, [extension]);
  const [currentSession, setCurrentSession] = useState<RTCSession | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>();

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

  // Debug extension state changes
  useEffect(() => {
    console.log(
      `[${providerId.current}] Extension state changed to:`,
      extensionState
    );
  }, [extensionState]);

  const [spyingStatus, setSpyingStatus] = useState<SpyingStatus>("spy");
  const [isSpying, setIsSpying] = useState(false);

  const { bindEvents, unbindEvents } = useUaEvents({
    setExtensionState,
    setCurrentSession,
    setSessionState,
    setIsSpying,
    setSpyingStatus,
  });

  // Cleanup on unmount and when new instances are created
  useEffect(() => {
    return () => {
      console.log(
        `[${providerId.current}] SipProvider unmounting, cleaning up UA`
      );
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

  const login = useCallback(
    (extensionData: ExtensionWithCredentials) => {
      console.log(
        `[${providerId.current}] login function called with:`,
        extensionData
      );
      console.log(`[${providerId.current}] Current states:`, {
        extensionState,
        ua: !!ua,
        hasBindEvents: !!bindEvents,
      });

      // Use ref to avoid dependency on ua state
      if (uaRef.current) {
        console.log(`[${providerId.current}] Stopping existing UA`);
        activeUserAgents.delete(uaRef.current);
        uaRef.current.stop();
      }

      // Clean up any other active user agents before creating new one
      console.log(
        `[${providerId.current}] Cleaning up other user agents before creating new one`
      );
      cleanupAllUserAgents();

      console.log(
        `[${providerId.current}] Creating new user agent (without starting)...`
      );
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

      console.log(
        `[${providerId.current}] User agent created (not started yet):`,
        !!userAgent
      );

      // Register the new user agent
      activeUserAgents.add(userAgent);

      console.log(`[${providerId.current}] Setting extension:`, extensionData);
      setExtension(extensionData);
      console.log(
        `[${providerId.current}] Extension set, current extension state will be logged by useEffect`
      );

      // Immediate check - this should show the extension is set
      setTimeout(() => {
        console.log(
          `[${providerId.current}] Checking extension after setState:`,
          extensionData
        );
      }, 0);

      console.log("Binding events before starting UA...");
      bindEvents(userAgent, extensionData);
      console.log(`[${providerId.current}] Events bound, setting UA...`);
      setUa(userAgent);

      console.log(`[${providerId.current}] Now starting the user agent...`);
      userAgent.start();

      console.log(`[${providerId.current}] Navigating to dialpad...`);
      navigate("/dialpad");
    },
    [bindEvents, navigate] // Removed ua dependency
  );

  const reconnect = () => {
    setExtensionState("connecting");

    if (!ua || !extension) return;
    ua.stop();
    unbindEvents(ua);

    const userAgent = createUserAgent(extension.uri, extension.password);
    bindEvents(userAgent, extension);
    setUa(userAgent);
  };

  const logout = () => {
    console.log(`[${providerId.current}] Logout called`);
    if (ua) {
      activeUserAgents.delete(ua);
      ua.stop();
      unbindEvents(ua);
      setUa(null);
      setExtension(null);
    }
    // Reset auto-login flag when user manually logs out
    if (session?.user?.id) {
      hasAttemptedAutoLogin.current = false;
    }
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

  // Auto-login for agent users
  useEffect(() => {
    const attemptAutoLogin = async () => {
      const sessionId = session?.user?.id;

      console.log(`[${providerId.current}] attemptAutoLogin called`, {
        userType: session?.user?.userType,
        extensionState,
        attempted: hasAttemptedAutoLogin.current,
        sessionId: session?.user?.id,
        hasSession: !!session?.user,
        hasBindEvents: !!bindEvents,
        hasNavigate: !!navigate,
      });

      // Additional safeguards
      if (!sessionId) return; // No valid session
      if (session.user.userType !== "agent") return; // Not an agent
      if (extensionState !== "disconnected") return; // Already connected/connecting
      if (hasAttemptedAutoLogin.current) return; // Already attempted for this provider instance

      console.log(`[${providerId.current}] Attempting auto-login for agent`);
      hasAttemptedAutoLogin.current = true;

      // Add a small delay to ensure everything is initialized
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        console.log("Fetching agent extension...");
        const agent = await webrtcService.getAgentExtension();
        console.log("Agent extension fetched:", agent);

        console.log("Calling login function...");
        login(agent);
        console.log("Login function called");
      } catch (error) {
        console.error("Auto-login failed:", error);
        // Reset flag to allow retry after a delay
        setTimeout(() => {
          hasAttemptedAutoLogin.current = false;
        }, 5000); // Wait 5 seconds before allowing retry
      }
    };

    // Only run if we have a complete session
    if (session?.user?.id) {
      attemptAutoLogin();
    }
  }, [
    session?.user?.userType,
    session?.user?.id,
    extensionState,
    login,
    bindEvents,
    navigate,
  ]); // login is now stable due to useCallback with stable dependencies

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
