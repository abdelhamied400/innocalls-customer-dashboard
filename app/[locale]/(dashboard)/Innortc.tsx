import { Button } from "@/components/ui/button";
import Call from "@/components/Webrtc/Call";
import Dialpad from "@/components/Webrtc/Dialpad";
import Extensions from "@/components/Webrtc/Extensions";
import IncomingCall from "@/components/Webrtc/IncomingCall";
import ExtensionStateBar from "@/components/Webrtc/Shared/ExtensionStateBar";
import { cn } from "@/lib/utils";
import { useRouting } from "@/providers/RoutingProvider";
import useAppStore from "@/store/app.slice";
import { ArrowForward, Dialpad as DialpadIcon } from "@mui/icons-material";
import React from "react";

const Innortc = () => {
  const { route } = useRouting();
  const { isWebrtcOpen, setWebrtcOpen } = useAppStore();

  return (
    <div className="innortc flex flex-col h-full">
      <div className="head border-b p-6 flex justify-center items-center">
        <Button
          variant="unstyled"
          className="[&_svg]:size-6"
          onClick={() => setWebrtcOpen(!isWebrtcOpen)}
        >
          <ArrowForward />
        </Button>
      </div>

      <div
        className={cn(
          "flex flex-col gap-4 flex-1 overflow-auto",
          !isWebrtcOpen && "opacity-0 invisible"
        )}
      >
        <div className="mb-4">
          <ExtensionStateBar />
        </div>

        <div className="body flex-1 px-4 ">
          {route === "dialpad" && <Dialpad />}
          {route === "extensions" && <Extensions />}
          {route === "call" && <Call />}
          {route === "incoming-call" && <IncomingCall />}
        </div>
      </div>

      <div className="foot border-t p-6 flex justify-center items-center">
        <Button
          variant="unstyled"
          className="[&_svg]:size-6 text-primary-500"
          onClick={() => setWebrtcOpen(!isWebrtcOpen)}
        >
          <DialpadIcon />
        </Button>
      </div>
    </div>
  );
};

export default Innortc;
