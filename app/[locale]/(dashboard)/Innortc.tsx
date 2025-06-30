import { Button } from "@/components/ui/button";
import CallScreen from "@/components/Webrtc/Call";
import Dialpad from "@/components/Webrtc/Dialpad";
import Extensions from "@/components/Webrtc/Extensions";
import ExtensionStateBar from "@/components/Webrtc/Shared/ExtensionStateBar";
import { useRouting } from "@/providers/RoutingProvider";
import { ArrowForward, Dialpad as DialpadIcon } from "@mui/icons-material";
import React from "react";

const Innortc = () => {
  const { route } = useRouting();

  return (
    <div className="innortc flex flex-col h-full">
      <div className="head border-b p-6 flex justify-center items-center">
        <Button
          variant="unstyled"
          className="[&_svg]:size-6"
          // onClick={() => window.history.back()}
        >
          <ArrowForward />
        </Button>
      </div>

      <div className="mb-4">
        <ExtensionStateBar />
      </div>

      <div className="body flex-1 px-4 overflow-auto">
        {route === "dialpad" && <Dialpad />}
        {route === "extensions" && <Extensions />}
        {route === "call" && <CallScreen />}
        {route === "voicemail" && <h2>Voicemail</h2>}
        {route === "settings" && <h2>Settings</h2>}
      </div>
      <div className="foot border-t p-6 flex justify-center items-center">
        <Button
          variant="unstyled"
          className="[&_svg]:size-6 text-primary-500"
          // onClick={() => window.history.back()}
        >
          <DialpadIcon />
        </Button>
      </div>
    </div>
  );
};

export default Innortc;
