"use client";
import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import analyticsService from "@/services/analytics.service";
import {
  CallMerge,
  EmojiEvents,
  Info,
  MilitaryTech,
  PlayForWork,
  Replay10,
  StackedLineChart,
} from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { UserActivityFilters } from "./page";
import { useTranslations } from "@/providers/TranslationProvider";
import StackedStatsRowCard from "@/components/StackedStatsRowCard";
import StatsRowCard from "@/components/StatsRowCard";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useLayoutManager from "@/hooks/use-layout-manager";

type QuickStatsProps = {
  filters: UserActivityFilters;
};

const QuickStats = ({ filters }: QuickStatsProps) => {
  const t = useTranslations("analytics.userActivity");
  const { screenWidth, layoutVariant } = useLayoutManager();

  const {
    data: quickStatsData,
    isLoading,
    isRefetching,
    isError,
    error,
  } = useLocalizedQuery({
    queryKey: ["quickStats", filters],
    queryFn: () => analyticsService.fetchQuickStats(filters),
  });

  const topSlaComplianceAgents = quickStatsData?.topSlaComplianceAgents || [];
  const topAnsweredIncomingAgents =
    quickStatsData?.topAnsweredIncomingAgents || [];
  const topConnectedOutboundAgents =
    quickStatsData?.topConnectedOutboundAgents || [];

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{t("quickStats.title")}</h2>
      <div
        className={cn(
          "quick-stats grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4",
          layoutVariant === "both-open" && "xl:grid-cols-2"
        )}
      >
        <StatsCard
          icon={<PlayForWork className="w-6 h-6" />}
          title={t("quickStats.topAnsweredIncoming")}
          renderValue={
            <>
              {(quickStatsData?.topAnsweredIncomingAgents?.length ?? 0) ===
                0 && (
                <span className="text-gray-500">
                  {t("common.noDataAvailable")}{" "}
                </span>
              )}
              <Popover>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold">
                      {quickStatsData?.topAnsweredIncomingAgents[0]?.name}
                    </span>
                    {(quickStatsData?.topAnsweredIncomingAgents?.length ?? 0) >
                      1 && (
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-0 text-gray-400"
                        >
                          <Info />
                        </Button>
                      </PopoverTrigger>
                    )}
                  </div>
                  <span className="font-normal">
                    {
                      quickStatsData?.topAnsweredIncomingAgents[0]
                        ?.answeredIncomingCount
                    }
                  </span>
                </div>
                <PopoverContent side="right">
                  <div className="flex flex-col gap-2">
                    {quickStatsData?.topAnsweredIncomingAgents.map((agent) => (
                      <div
                        className="flex justify-between items-center gap-2 bg-gray-100 p-2 rounded-lg"
                        key={agent.ext}
                      >
                        <span className="font-bold">{agent.name}</span>
                        <span className="font-normal">
                          {agent.answeredIncomingCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </>
          }
          color="primary"
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
          variant="subtle"
        />

        <StatsCard
          icon={<CallMerge className="w-6 h-6" />}
          title={t("quickStats.topConnectedOutbound")}
          renderValue={
            <>
              {(quickStatsData?.topConnectedOutboundAgents?.length ?? 0) ===
                0 && (
                <span className="text-gray-500">
                  {t("common.noDataAvailable")}{" "}
                </span>
              )}
              <Popover>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold">
                      {quickStatsData?.topConnectedOutboundAgents[0]?.name}
                    </span>
                    {(quickStatsData?.topConnectedOutboundAgents?.length ?? 0) >
                      1 && (
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-0 text-gray-400"
                        >
                          <Info />
                        </Button>
                      </PopoverTrigger>
                    )}
                  </div>
                  <span className="font-normal">
                    {quickStatsData?.topConnectedOutboundAgents[0]
                      ?.connectedOutboundCount || 0}
                  </span>
                </div>
                <PopoverContent>
                  <div className="flex flex-col gap-2">
                    {quickStatsData?.topConnectedOutboundAgents.map((agent) => (
                      <div
                        className="flex justify-between items-center gap-2 bg-gray-100 p-2 rounded-lg"
                        key={agent.ext}
                      >
                        <span className="font-bold">{agent.name}</span>
                        <span className="font-normal">
                          {agent.connectedOutboundCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </>
          }
          color="primary"
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
          variant="subtle"
        />

        <StatsCard
          icon={<Replay10 className="w-6 h-6" />}
          title={t("quickStats.bestSlaAgent")}
          renderValue={
            <>
              {(topSlaComplianceAgents?.length ?? 0) === 0 && (
                <span className="text-gray-500">
                  {t("common.noDataAvailable")}{" "}
                </span>
              )}
              <Popover>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold">
                      {topSlaComplianceAgents.length > 1
                        ? t("quickStats.users", {
                            num: topSlaComplianceAgents.length,
                          })
                        : topSlaComplianceAgents[0]?.name}
                    </span>
                    {topSlaComplianceAgents.length > 1 && (
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-0 text-gray-400"
                        >
                          <Info />
                        </Button>
                      </PopoverTrigger>
                    )}
                  </div>
                  <span className="font-normal">
                    {`${
                      quickStatsData?.topSlaComplianceAgents[0]
                        ?.slaPercentage || 0
                    }\u200E%`}
                  </span>
                </div>
                <PopoverContent side={screenWidth < 640 ? undefined : "right"}>
                  <div className="flex flex-col gap-2">
                    {quickStatsData?.topSlaComplianceAgents.map((agent) => (
                      <div
                        className="flex justify-between items-center gap-2 bg-gray-100 p-2 rounded-lg"
                        key={agent.ext}
                      >
                        <span className="font-bold">{agent.name}</span>
                        <span className="font-normal">{`${agent.slaPercentage}\u200E%`}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </>
          }
          color="primary"
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
          variant="subtle"
        />
      </div>
    </div>
  );
};

export default QuickStats;
