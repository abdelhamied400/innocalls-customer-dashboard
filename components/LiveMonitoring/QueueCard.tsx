import React, { useState } from "react";
import {
  AccountBalance,
  Call,
  Code,
  CrisisAlert,
  Engineering,
  HourglassBottom,
  QuestionMark,
  Settings,
  Storefront,
  Support,
  SupportAgent,
} from "@mui/icons-material";
import { cva, VariantProps } from "class-variance-authority";
import QueueSummaryStatsCard from "./QueueSummaryStatsCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import QueueCallCard from "./QueueCallCard";
import StatsRowCard from "../StatsRowCard";
import StackedStatsRowCard from "../StackedStatsRowCard";
import { FetchQueueDataResponse } from "@/services/live-monitoring.service";
import { useTranslations } from "next-intl";
import { formatNumbers } from "@/lib/utils";

// Variants using cva
const queueCardVariants = cva(
  "queue-card border bg-white p-2 rounded-lg transition-colors group/queue-card",
  {
    variants: {
      variant: {
        default: "bg-gray-100",
      },
      color: {
        default: "hover:border-gray-300 ",
        primary: "hover:border-primary-400",
        destructive: "hover:border-destructive-400",
        warning: "hover:border-warning-400",
        info: "hover:border-indigo-400",
        success: "hover:border-success-400",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  }
);

const queueCardIconVariants = cva("icon transition-colors rounded-full p-1", {
  variants: {
    color: {
      default:
        "bg-gray-100 text-gray-500 group-hover/queue-card:bg-gray-500 group-hover/queue-card:text-white",
      primary:
        "bg-primary-100 text-primary-500 group-hover/queue-card:bg-primary-500 group-hover/queue-card:text-white",
      destructive:
        "bg-destructive-100 text-destructive-500 group-hover/queue-card:bg-destructive-500 group-hover/queue-card:text-white",
      warning:
        "bg-warning-100 text-warning-500 group-hover/queue-card:bg-warning-500 group-hover/queue-card:text-white",
      info: "bg-indigo-100 text-indigo-500 group-hover/queue-card:bg-indigo-500 group-hover/queue-card:text-white",
      success:
        "bg-success-100 text-success-500 group-hover/queue-card:bg-success-500 group-hover/queue-card:text-white",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

const queueCardValueVariants = cva("font-bold", {
  variants: {
    color: {
      default: "text-gray-700",
      primary: "text-primary-500",
      destructive: "text-destructive-500",
      warning: "text-warning-500",
      info: "text-indigo-500",
      success: "text-success-500",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

type QueueCardProps = VariantProps<typeof queueCardVariants> & {
  title?: string;
  subtitle?: string;
  stats: FetchQueueDataResponse[number]["stats"];
  sla?: string;
  activeCalls?: Array<{
    phoneNumber: string;
    name: string;
    ext?: string;
    callDuration: number;
  }>;
  waitingCalls?: Array<{
    phoneNumber: string;
    name?: string;
    ext?: string;
    callDuration: number;
  }>;
};

const getIcon = (name?: string) => {
  const icons: Record<string, React.ReactNode> = {
    cs: <SupportAgent />,
    dev: <Code />,
    sales: <CrisisAlert />,
    support: <SupportAgent />,
    engineering: <Engineering />,
    marketing: <Storefront />,
    finance: <AccountBalance />,
    hr: <Support />,
    operations: <Settings />,
    // fallback/default icon
    default: <Call />,
  };

  const lowercaseName = name?.toLowerCase() || "default";
  // Start with lowercase name to ensure case-insensitive lookup
  const matchedKey = Object.keys(icons).find(
    (key) => key !== "default" && lowercaseName.startsWith(key)
  );
  return icons[matchedKey ?? "default"];
};

const QueueCard = ({
  variant = "default",
  color,
  title,
  subtitle,
  stats,
  sla,
  activeCalls = [],
  waitingCalls = [],
}: QueueCardProps) => {
  const t = useTranslations("liveMonitor.queueManagement.queueCard");

  const getRandomColor = () => {
    const colors: any = [
      "primary",
      "destructive",
      "warning",
      "info",
      "success",
      "default",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const colorVariant = color || getRandomColor();

  return (
    <div className={queueCardVariants({ variant, color: colorVariant })}>
      <div className="head flex justify-between flex-wrap items-center gap-1">
        <div className="flex items-center gap-2">
          <div className={queueCardIconVariants({ color: colorVariant })}>
            {getIcon(title)}
          </div>
          <div className="details">
            <h3 className="font-semibold">{title ?? "Support"}</h3>
            <p className="text-sm">
              {activeCalls.length} {t("activeCalls")}
            </p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <div className="sla flex-1 text-end">
          <h3
            className={queueCardValueVariants({
              color: colorVariant,
            })}
          >
            {formatNumbers(parseFloat(sla || "0"))}
            {String.fromCharCode(8206)}%
          </h3>
          <p>{t("sla")}</p>
        </div>
      </div>

      <div className="queue-stats grid grid-cols-1 lg:grid-cols-2 gap-1">
        <QueueSummaryStatsCard
          label={t("inProgress")}
          count={activeCalls.length}
          unit={t("calls")}
          color="success"
        />
        <QueueSummaryStatsCard
          label={t("waiting")}
          count={waitingCalls.length}
          unit={t("calls")}
          color="warning"
        />
      </div>

      <div className="stats flex flex-col gap-4 mt-2">
        {/* Calls Stats */}
        <StackedStatsRowCard>
          <StatsRowCard
            label={t("totalCalls")}
            value={stats.totalCalls}
            color="info"
          />
          <StatsRowCard
            label={t("answeredCalls")}
            value={stats.answeredCalls}
            color="success"
          />
          <StatsRowCard
            label={t("abandonedCalls")}
            value={stats.abandonedCalls}
            color="destructive"
          />
          <StatsRowCard
            label={t("timeoutCalls")}
            value={stats.timeoutCalls}
            color="warning"
          />
        </StackedStatsRowCard>
        <hr />
        {/* Wait Time Stats */}
        <StackedStatsRowCard>
          <StatsRowCard
            label={t("averageWaitTime")}
            value={stats.averageWaitTime}
            color="primary"
          />
          <StatsRowCard
            label={t("maxWaitTime")}
            value={stats.maxWaitTime}
            color="warning"
          />
          <StatsRowCard
            label={t("minWaitTime")}
            value={stats.minWaitTime}
            color="success"
          />
        </StackedStatsRowCard>
        <hr />
        {/* Talk Time Stats */}
        <StackedStatsRowCard>
          <StatsRowCard
            label={t("averageTalkTime")}
            value={stats.averageTalkTime}
            color="success"
          />
          <StatsRowCard
            label={t("maxTalkTime")}
            value={stats.maxTalkTime}
            color="warning"
          />
          <StatsRowCard
            label={t("minTalkTime")}
            value={stats.minTalkTime}
            color="primary"
          />
        </StackedStatsRowCard>
      </div>

      <div className="active-calls">
        <Accordion
          type="multiple"
          defaultValue={["active-calls", "waiting-calls"]}
        >
          <AccordionItem value="active-calls">
            <AccordionTrigger className="flex items-center">
              <div className="flex gap-2 items-center">
                <span className="block w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
                <span>
                  {t("activeCallsTitle")} ({activeCalls.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2 flex flex-col gap-2 max-h-60 overflow-y-auto">
              {activeCalls.length > 0 ? (
                activeCalls.map((call, idx) => (
                  <QueueCallCard
                    key={idx}
                    phoneNumber={call.phoneNumber}
                    agent={{
                      name: call.name || t("unknownAgent"),
                      ext: call.ext || "",
                    }}
                    status="active"
                    callDuration={call.callDuration}
                    color="success"
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400 p-4 h-40 flex flex-col justify-center items-center border rounded-lg">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <Call />
                  </div>
                  <span>{t("noActiveCalls")}</span>
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="waiting-calls">
            <AccordionTrigger className="flex items-center">
              <div className="flex gap-2 items-center">
                <span className="block w-4 h-4 bg-warning-500 rounded-full animate-pulse"></span>
                <span>
                  {t("waitingCallsTitle")} ({waitingCalls.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2 flex flex-col gap-2 max-h-60 overflow-y-auto">
              {waitingCalls.length > 0 ? (
                waitingCalls.map((call, idx) => (
                  <QueueCallCard
                    key={idx}
                    phoneNumber={call.phoneNumber}
                    agent={{
                      name: call.name || t("unknownAgent"),
                      ext: call.ext || "",
                    }}
                    status="waiting"
                    callDuration={call.callDuration}
                    color="warning"
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400 p-4 h-40 flex flex-col justify-center items-center border rounded-lg">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <HourglassBottom />
                  </div>
                  <span>{t("noWaitingCalls")}</span>
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default QueueCard;
