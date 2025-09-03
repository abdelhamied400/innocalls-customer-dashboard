import Call from "@/components/Webrtc/Call";
import Dialpad from "@/components/Webrtc/Dialpad";
import Extensions from "@/components/Webrtc/Extensions";
import IncomingCall from "@/components/Webrtc/IncomingCall";
import ExtensionStateBar from "@/components/Webrtc/Shared/ExtensionStateBar";
import { useRouting } from "@/providers/RoutingProvider";
import useAppStore from "@/store/app.slice";
import React from "react";

const Innortc = () => {
  const { isRoute } = useRouting();
  const { isWebrtcOpen, setWebrtcOpen } = useAppStore();

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
