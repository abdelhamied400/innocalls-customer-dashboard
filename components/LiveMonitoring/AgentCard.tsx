import { cva, VariantProps } from "class-variance-authority";
import { Button } from "../ui/button";
import { useSip } from "@/providers/webrtc/SipProvider";
import { toast } from "sonner";
import useAppStore from "@/store/app.slice";
import Image from "next/image";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const agentCardVariants = cva(
  "rounded-lg border p-2 hover:shadow-md transition-all duration-200 group",
  {
    variants: {
      status: {
        onCall:
          "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:border-blue-500",
        idle: "bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:border-green-500",
        onBreak:
          "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-500",
      },
    },
    defaultVariants: {
      status: "idle",
    },
  }
);

const agentInitialsVariants = cva(
  "w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors",
  {
    variants: {
      status: {
        onCall: "bg-blue-500 text-white",
        idle: "bg-green-500 text-white",
        onBreak: "bg-yellow-500 text-white",
      },
    },
    defaultVariants: {
      status: "idle",
    },
  }
);

const agentNameVariants = cva("text-sm font-medium truncate", {
  variants: {
    status: {
      onCall: "text-blue-700",
      idle: "text-green-700",
      onBreak: "text-yellow-700",
    },
  },
  defaultVariants: {
    status: "idle",
  },
});

type AgentCardProps = {
  name: string;
  extension: string | number;
  status?: VariantProps<typeof agentCardVariants>["status"];
};

const AgentCard: React.FC<AgentCardProps> = ({
  name,
  extension,
  status = "idle",
}) => {
  const { extensionState, spy } = useSip();
  const { setWebrtcOpen } = useAppStore();

  const t = useTranslations("liveMonitor.liveCalls.callCard");

  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const handleSpy = () => {
    setWebrtcOpen(true);
    if (extensionState !== "connected") {
      toast.error("Error", {
        description: t("sipConnectionError"),
      });
      return;
    }
    spy(extension.toString());
  };

  return (
    <div className={agentCardVariants({ status })}>
      <div className="flex items-center gap-2 mb-1">
        <div className={agentInitialsVariants({ status })}>
          <span className="text-xs transition-colors">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={agentNameVariants({ status })}>{name}</h4>
          <p className="text-[10px] text-gray-600">Ext: {extension}</p>
        </div>
      </div>
      <div className="flex justify-end">
        {status === "onCall" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={handleSpy}>
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
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
