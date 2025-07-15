import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const queueCallCardVariants = cva(
  "p-3 rounded-lg border hover:border-500 transition-all duration-200 group",
  {
    variants: {
      variant: {
        success:
          "bg-gradient-to-r from-success-100/20 to-success-100/70 border-success-200 hover:border-success-500",
        warning:
          "bg-gradient-to-r from-warning-100/20 to-warning-100/70 border-warning-200 hover:border-warning-500",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

const statusColorVariants = cva("text-white", {
  variants: {
    variant: {
      success: "bg-success-500 border-success-200",
      warning: "bg-warning-500 border-warning-200",
    },
  },
  defaultVariants: {
    variant: "success",
  },
});

type QueueCallCardProps = {
  phoneNumber: string;
  agentName: string;
  status: "active" | "waiting";
  callDuration: string;
  live?: boolean;
  variant?: VariantProps<typeof queueCallCardVariants>["variant"];
};

const QueueCallCard: React.FC<QueueCallCardProps> = ({
  phoneNumber,
  agentName,
  status,
  callDuration,
  live = true,
  variant = "success",
}) => {
  const statusClasses = statusColorVariants({ variant });

  return (
    <div className={queueCallCardVariants({ variant })}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn("w-2 h-2 rounded-full animate-pulse", statusClasses)}
          ></div>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {phoneNumber}
          </p>
        </div>
        {live && (
          <div className="flex items-center gap-1">
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                statusClasses
              )}
            ></div>
            <span
              className={cn(
                "text-xs font-medium",
                statusClasses.replace("bg-", "text-")
              )}
            >
              {status}
            </span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Agent:</span>
          <span className="font-medium text-gray-900">{agentName}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-600">Status:</span>
          <span
            className={cn("font-medium", statusClasses.replace("bg-", "text-"))}
          >
            {status}
          </span>
        </div>
      </div>
      <div className={cn("mt-2 pt-2 border-t")}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Call Duration</span>
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              statusClasses
            )}
          >
            {callDuration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QueueCallCard;
