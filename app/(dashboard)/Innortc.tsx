import Call from "@/components/Webrtc/Call";
import Dialpad from "@/components/Webrtc/Dialpad";
import Extensions from "@/components/Webrtc/Extensions";
import IncomingCall from "@/components/Webrtc/IncomingCall";
import ExtensionStateBar from "@/components/Webrtc/Shared/ExtensionStateBar";
import useDeepLinkListener from "@/hooks/use-deep-link-listener";
import { useRouting } from "@/providers/RoutingProvider";
import { useSip } from "@/providers/webrtc/SipProvider";
import useAppStore from "@/store/app.slice";

const Innortc = () => {
  const { isRoute } = useRouting();
  const { isWebrtcOpen } = useAppStore();
  const { call, extensionState } = useSip();

  useDeepLinkListener(
    "call",
    (params, clearSearchParams) => {
      if (extensionState === "connected") {
        clearSearchParams();
        console.log("Deep link to call with params:", params);
        call(params.number.replace(/(?!^\+)[^\d]/g, ""));
      }
    },
    [extensionState]
  );

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
