import Call from "@/components/Webrtc/Call";
import Dialpad from "@/components/Webrtc/Dialpad";
import Extensions from "@/components/Webrtc/Extensions";
import IncomingCall from "@/components/Webrtc/IncomingCall";
import ExtensionStateBar from "@/components/Webrtc/Shared/ExtensionStateBar";
import useDeepLinkListener from "@/hooks/use-deep-link-listener";
import { useRouting } from "@/providers/RoutingProvider";
import { useSip } from "@/providers/webrtc/SipProvider";
import useAppStore from "@/store/app.slice";
import { useSession } from "@/hooks/useSession";
import useAuth from "@/hooks/useAuth";
import { useTranslations } from "@/providers/TranslationProvider";
import { cn } from "@/lib/utils";
import { webrtcStoppingActivities } from "@/constants/agent-activity";
import { AgentActivity } from "@/types/webrtc";

const Innortc = () => {
  const { isRoute } = useRouting();
  const { isWebrtcOpen } = useAppStore();
  const { call, extensionState, extension } = useSip();
  const { data: session } = useSession();
  const { data: auth } = useAuth();
  const t = useTranslations("webrtc");

  const isAgent = session?.userType === "agent";
  const breakType =
    auth?.user?.latestActivity?.type || AgentActivity.CONNECTED_NOT_READY;

  useDeepLinkListener(
    "call",
    (params, clearSearchParams) => {
      if (extensionState === "connected") {
        clearSearchParams();
        call(params.number.replace(" ", "+").replace(/(?!^\+)[^\d]/g, ""));
      }
    },
    [extensionState],
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

  if (isAgent && extension) {
    const stateLabel =
      extensionState === "disconnected" &&
      !!breakType &&
      webrtcStoppingActivities.includes(breakType)
        ? t("activity." + breakType)
        : t("status." + extensionState);

    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-2 [writing-mode:vertical-rl]">
        <div
          className={cn(
            "w-full h-full p-3 text-center text-sm font-medium rounded flex items-center justify-center",
            extensionState === "disconnected" && "bg-destructive-200",
            extensionState === "connected" && "bg-success-200",
            extensionState === "connecting" && "bg-warning-200",
          )}
        >
          <p>{extension.ext}</p>
          <p>{stateLabel}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Innortc;
