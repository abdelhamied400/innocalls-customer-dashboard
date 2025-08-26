import { Button } from "@/components/ui/button";
import Call from "@/components/Webrtc/Call";
import Dialpad from "@/components/Webrtc/Dialpad";
import Extensions from "@/components/Webrtc/Extensions";
import IncomingCall from "@/components/Webrtc/IncomingCall";
import ExtensionStateBar from "@/components/Webrtc/Shared/ExtensionStateBar";
import { cn } from "@/lib/utils";
import { useRouting } from "@/providers/RoutingProvider";
import { useSip } from "@/providers/webrtc/SipProvider";
import webrtcService from "@/services/webrtc.service";
import useAppStore from "@/store/app.slice";
import { ArrowForward, Dialpad as DialpadIcon } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const Innortc = () => {
  const { isRoute } = useRouting();
  const { isWebrtcOpen, setWebrtcOpen } = useAppStore();
  const { data: session } = useSession();

  const { login, ua, extensionState } = useSip();

  useEffect(() => {
    // if agent and ua is not initialized, login automatically
    const tryLogin = async () => {
      if (
        session?.user?.userType === "agent" &&
        !ua &&
        extensionState === "disconnected"
      ) {
        const agent = await webrtcService.getAgentExtension();
        login(agent);
      }
    };
    tryLogin();
  }, [ua, extensionState, login]);

  if (isWebrtcOpen) {
    return (
      <>
        <div className="mb-4">
          <ExtensionStateBar />
        </div>

        <div className="body flex-1 px-4 ">
          {isRoute("/dialpad") && <Dialpad />}
          {isRoute("/extensions") && <Extensions />}
          {isRoute("/call") && <Call />}
          {isRoute("/incoming-call") && <IncomingCall />}
        </div>
      </>
    );
  }

  return null;
};

export default Innortc;
