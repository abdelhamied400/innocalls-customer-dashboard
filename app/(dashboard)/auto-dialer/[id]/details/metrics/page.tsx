"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import useLayoutManager from "@/hooks/use-layout-manager";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { CampaignMetrics } from "@/types/autoDialerCampaign";
import { useParams } from "next/navigation";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTableProvider, {
  DataTable,
  DataTableBody,
  DataTableHeader,
  DataTableSkeleton,
} from "@/components/ui/data-table";
import { useSip } from "@/providers/webrtc/SipProvider";
import { InsightsOutlined } from "@mui/icons-material";
import { toast } from "sonner";
import {
  waitingCallsColumns,
  inProgressCallsColumns,
  agentDetailsColumns,
} from "./columns";
import StatsMiniCard from "@/components/StatsMiniCard";
import useAppStore from "@/store/app.slice";
import useWebrtcStore from "@/store/webrtc.slice";
import Image from "next/image";

const AGENT_COLORS = {
  online: "#0E4D80",
  available: "#23C998",
  onCall: "#FF4757",
  dialing: "#FFD061",
  onBreak: "#DB26CE",
};

const EMPTY_CHART_COLOR = "#D1D5DB";

const AutoDialerCampaignMetrics = () => {
  const t = useTranslations("autoDialer.campaignDetails");
  const { id } = useParams<{ id: string }>();
  const { extensionState, spy } = useSip();
  const { setWebrtcOpen } = useAppStore();
  const { extension } = useWebrtcStore();
  const {
    hasExpandedSidebar,
    hasExpandedWebrtc,
    screenWidth,
    isSmall,
    isMedium,
    isLarge,
  } = useLayoutManager();

  const { data: campaign, isLoading: isCampaignLoading } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign", id],
    queryFn: () => autoDialerService.getCampaign(id as string),
  });

  const isActiveCampaign = campaign?.status === "active";

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign-metrics", id],
    queryFn: () => autoDialerService.fetchCampaignMetrics(id),
    enabled: isActiveCampaign,
    refetchInterval: isActiveCampaign ? 15000 : false,
  });

  const metrics = data as CampaignMetrics | undefined;

  const agentChartData = metrics
    ? [
        {
          name: t("metrics.onlineAgents"),
          count: metrics.onlineAgents,
          color: AGENT_COLORS.online,
        },
        {
          name: t("metrics.availableAgents"),
          count: metrics.availableAgents,
          color: AGENT_COLORS.available,
        },
        {
          name: t("metrics.onCallAgents"),
          count: metrics.onCallAgents,
          color: AGENT_COLORS.onCall,
        },
        {
          name: t("metrics.dialingAgents"),
          count: metrics.dialingAgents,
          color: AGENT_COLORS.dialing,
        },
        {
          name: t("metrics.onBreakAgents"),
          count: metrics.onBreakAgents,
          color: AGENT_COLORS.onBreak,
        },
      ]
    : [];

  const totalAgents = metrics?.totalAgents ?? 0;

  const hasAgentChartData = agentChartData.some((entry) => entry.count > 0);
  const pieChartData = hasAgentChartData
    ? agentChartData
    : [{ name: "empty", count: 1, color: EMPTY_CHART_COLOR }];

  const isLaptopScreen = screenWidth >= 1024 && screenWidth < 1536;
  const isSmallerScreen = isSmall || isMedium || isLarge;
  const shouldShowLegendBelow =
    isSmallerScreen ||
    (isLaptopScreen && hasExpandedSidebar && hasExpandedWebrtc);

  const onSpy = (ext: string) => {
    setWebrtcOpen(true);
    if (extensionState !== "connected") {
      toast.error("Error", {
        description: t("metrics.spyConnectionError"),
      });
      return;
    }
    spy(ext);
  };

  if (isCampaignLoading) {
    return (
      <div className="rounded-lg bg-white p-6 text-gray-500 shadow">
        <p className="text-sm">{t("loading")}</p>
      </div>
    );
  }

  if (!isActiveCampaign) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <InsightsOutlined />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t("metrics.title")}
          </h3>
          <p className="text-sm text-gray-500">
            {t("metrics.onlyAvailableForActiveCampaigns")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div
          className={`flex gap-3 bg-white shadow rounded-lg p-4 ${
            shouldShowLegendBelow ? "flex-col" : "items-center"
          }`}
        >
          <div
            className={
              shouldShowLegendBelow ? "w-full flex justify-center" : ""
            }
          >
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={80}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x="50%"
                    dy="-0.6em"
                    className="fill-muted-foreground text-sm"
                  >
                    {t("metrics.total")}
                  </tspan>
                  <tspan
                    x="50%"
                    dy="1.4em"
                    className="fill-foreground text-lg font-semibold"
                  >
                    {totalAgents} {t("metrics.agents")}
                  </tspan>
                </text>
                {hasAgentChartData && <Tooltip />}
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            className={`flex flex-col gap-x-4 gap-y-2 px-2 ${
              shouldShowLegendBelow ? "w-full" : "flex-1"
            }`}
          >
            {agentChartData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center gap-2 text-sm "
              >
                <span
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex flex-1">
                  <span className="flex-1 text-muted-foreground text-lg">
                    {entry.name}
                  </span>
                  <span className="text-bold text-lg">{entry.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4">
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/queue.svg"
                alt="Calls Waiting"
                width={24}
                height={24}
              />
            }
            label={t("metrics.callsWaiting")}
            value={metrics?.callsWaiting ?? 0}
            color="warning"
          />
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/call.svg"
                alt="Calls In Progress"
                width={24}
                height={24}
              />
            }
            label={t("metrics.callsInProgress")}
            value={metrics?.callsInProgress ?? 0}
            color="success"
          />
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/phone_callback.svg"
                alt="Oldest Call Wait Time"
                width={24}
                height={24}
              />
            }
            label={t("metrics.oldestCallWaitTime")}
            value={`${metrics?.oldestCallWaitTime ?? 0} ${t("metrics.seconds")}`}
            color="primary"
          />
          <StatsMiniCard
            icon={
              <Image
                src="/assets/icons/stats/call-1.svg"
                alt="Average Current Wait Time"
                width={24}
                height={24}
              />
            }
            label={t("metrics.averageCurrentWaitTime")}
            value={`${metrics?.averageCurrentWaitTime ?? 0} ${t("metrics.seconds")}`}
            color="default"
          />
        </div>
      </div>

      {/* Section 3: Tabbed Tables */}
      <Tabs defaultValue="waitingCalls">
        <TabsList>
          <TabsTrigger value="waitingCalls">
            {t("metrics.tabs.waitingCalls")}
          </TabsTrigger>
          <TabsTrigger value="inProgressCalls">
            {t("metrics.tabs.inProgressCalls")}
          </TabsTrigger>
          <TabsTrigger value="agentDetails">
            {t("metrics.tabs.agentDetails")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waitingCalls">
          <DataTableProvider
            data={metrics?.waitingCalls ?? []}
            columns={waitingCallsColumns(t)}
            isLoading={isLoading}
            noResultsMessage={t("metrics.noData")}
          >
            <DataTable>
              <DataTableHeader />
              {isLoading ? <DataTableSkeleton /> : <DataTableBody />}
            </DataTable>
          </DataTableProvider>
        </TabsContent>

        <TabsContent value="inProgressCalls">
          <DataTableProvider
            data={metrics?.inProgressCalls ?? []}
            columns={inProgressCallsColumns(t)}
            isLoading={isLoading}
            noResultsMessage={t("metrics.noData")}
            meta={{ onSpy, currentExtension: extension?.ext }}
          >
            <DataTable>
              <DataTableHeader />
              {isLoading ? <DataTableSkeleton /> : <DataTableBody />}
            </DataTable>
          </DataTableProvider>
        </TabsContent>

        <TabsContent value="agentDetails">
          <DataTableProvider
            data={metrics?.agentDetails ?? []}
            columns={agentDetailsColumns(t)}
            isLoading={isLoading}
            noResultsMessage={t("metrics.noData")}
          >
            <DataTable>
              <DataTableHeader />
              {isLoading ? <DataTableSkeleton /> : <DataTableBody />}
            </DataTable>
          </DataTableProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutoDialerCampaignMetrics;
