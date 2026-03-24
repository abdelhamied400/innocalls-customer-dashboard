import { CallMade, CallReceived } from "@mui/icons-material";

import Timer from "../ui/timer";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useSip } from "@/providers/webrtc/SipProvider";
import useAppStore from "@/store/app.slice";
import Image from "next/image";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useWebrtcStore from "@/store/webrtc.slice";

interface LiveCallProps {
  from: string;
  to: string;
  timestamp: number;
}

const getExtensionNumber = (phoneNumber: string): string => {
  // Match exactly 3 or 4 digits inside parentheses
  const match = phoneNumber.match(/\((\d{3,4})\)/);
  return match ? match[1] : "";
};

const LiveCall = ({ from, to, timestamp }: LiveCallProps) => {
  const t = useTranslations("liveMonitor.liveCalls.callCard");

  const { extension } = useWebrtcStore();
  const { spy, extensionState } = useSip();
  const { setWebrtcOpen } = useAppStore();


  const handleSpy = (extension: string) => {
    setWebrtcOpen(true);
    if (extensionState !== "connected") {
      toast.error(t("error"), {
        description: t("sipConnectionError"),
      });
      return;
    }
    spy(extension.toString());
  };

  const getAutoDialerCall = (num: string) => {
    if (num.includes("unknow")) {
      return t("autoDialerCall");
    }

    return num;
  };

  return (
    <div className="live-call p-4 border border-primary-200 bg-gradient-to-r from-primary-100/50 to-primary-200/50 rounded-lg hover:from-primary-100/70 hover:to-primary-200/70 hover:border-primary-300 transition-colors flex flex-col gap-2">
      <div className="from bg-white border p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <CallMade className="text-success-500 !text-lg" />
          <span className="text-xs font-medium">{t("from")}</span>
        </div>
        <div className="text-sm font-semibold text-gray-800">
          {" "}
          {"\u200E" + getAutoDialerCall(from)}
        </div>
        {getExtensionNumber(from) &&
          extension?.ext !== getExtensionNumber(from) &&
          extension?.ext !== getExtensionNumber(to) && (
            <TooltipProvider>
              <div className="flex justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSpy(getExtensionNumber(from))}
                    >
                      <Image
                        src="/assets/icons/incognito.svg"
                        alt="spy"
                        width={24}
                        height={24}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("tooltips.spy")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
      </div>
      <div className="from bg-white border p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <CallReceived className="text-primary-500 !text-lg" />
          <span className="text-xs font-medium">{t("to")}</span>
        </div>
        <div className="text-sm font-semibold text-gray-800">
          {" "}
          {"\u200E" + getAutoDialerCall(to)}
        </div>
        {getExtensionNumber(to) &&
          extension?.ext !== getExtensionNumber(to) &&
          extension?.ext !== getExtensionNumber(from) && (
            <TooltipProvider>
              <div className="flex justify-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSpy(getExtensionNumber(to))}
                    >
                      <Image
                        src="/assets/icons/incognito.svg"
                        alt="spy"
                        width={24}
                        height={24}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("tooltips.spy")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
      </div>
      <hr />
      {(getExtensionNumber(from) || getExtensionNumber(to)) && (
        <div className="flex justify-between gap-1">
          <p className="text-xs text-gray-500">{t("duration")}</p>
          <div className="duration flex items-center gap-1">
            <span className="block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xs text-green-500">
              <Timer timestamp={timestamp} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCall;
