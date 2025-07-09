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
  const { isRoute } = useRouting();
  const { isWebrtcOpen, setWebrtcOpen } = useAppStore();

  return (
    <div className="innortc flex flex-col h-full">
      <div className="head border-b flex justify-center items-center">
        <Button
          variant="unstyled"
          className={cn(
            "[&_svg]:size-6 w-full p-6 h-auto transition-transform duration-400 ease-in-out",
            isWebrtcOpen ? "rotate-180" : "rotate-0"
          )}
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
          {isRoute("/dialpad") && <Dialpad />}
          {isRoute("/extensions") && <Extensions />}
          {isRoute("/call") && <Call />}
          {isRoute("/incoming-call") && <IncomingCall />}
        </div>
      </div>

      <div className="foot border-t flex justify-center items-center">
        <Button
          variant="unstyled"
          className="[&_svg]:size-6 text-primary-500 w-full p-6 h-auto"
          onClick={() => setWebrtcOpen(!isWebrtcOpen)}
        >
          <DialpadIcon />
        </Button>
      </div>
    </div>
  );
};

export default Innortc;
