import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import Timer from "../ui/timer";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSip } from "@/providers/webrtc/SipProvider";
import useAppStore from "@/store/app.slice";
import Image from "next/image";
import { useTranslations } from "next-intl";

const queueCallCardVariants = cva(
  "p-3 rounded-lg border hover:border-500 transition-all duration-200 group",
  {
    variants: {
      color: {
        success:
          "bg-gradient-to-r from-success-100/20 to-success-100/70 border-success-200 hover:border-success-500",
        warning:
          "bg-gradient-to-r from-warning-100/20 to-warning-100/70 border-warning-200 hover:border-warning-500",
      },
    },
    defaultVariants: {
      color: "success",
    },
  }
);

const statusColorVariants = cva("text-white", {
  variants: {
    color: {
      success: "bg-success-500 border-success-200",
      warning: "bg-warning-500 border-warning-200",
    },
  },
  defaultVariants: {
    color: "success",
  },
});

type QueueCallCardProps = {
  phoneNumber: string;
  agent: { name: string; ext: string };
  status: "active" | "waiting";
  callDuration: number;
  color?: VariantProps<typeof queueCallCardVariants>["color"];
};

const QueueCallCard: React.FC<QueueCallCardProps> = ({
  phoneNumber,
  agent,
  status,
  callDuration,
  color = "success",
}) => {
  const t = useTranslations(
    "liveMonitor.queueManagement.queueCard.queueCardCall"
  );

  const statusClasses = statusColorVariants({ color });
  const { toast } = useToast();
  const { extensionState, spy } = useSip();
  const { setWebrtcOpen } = useAppStore();

  const handleSpy = () => {
    setWebrtcOpen(true);
    if (extensionState !== "connected") {
      toast({
        title: t("error"),
        description: t("sipConnectionError"),
        variant: "destructive",
      });
      return;
    }

    spy(agent.ext);
  };

  return (
    <div className={queueCallCardVariants({ color })}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn("w-2 h-2 rounded-full animate-pulse", statusClasses)}
          ></div>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {phoneNumber}
          </p>
        </div>
        {status === "active" && (
          <Button size="icon" variant="ghost" onClick={handleSpy}>
            <Image
              src="/assets/icons/incognito.svg"
              alt="Incognito"
              width={24}
              height={24}
            />
          </Button>
        )}
      </div>
      {status === "active" && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">{t("agent")}:</span>
            <span className="font-medium text-gray-900">{agent.name}</span>
          </div>
        </div>
      )}
      <div className={cn("mt-2 pt-2 border-t")}>
        <div className="flex items-center justify-between">
          {status === "active" ? (
            <span className="text-success-500 text-xs font-semibold">
              {t("callDuration")}
            </span>
          ) : (
            <span className="text-warning-500 text-xs font-semibold">
              {t("waitingDuration")}
            </span>
          )}
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              statusClasses
            )}
          >
            <Timer startingTime={callDuration} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default QueueCallCard;
