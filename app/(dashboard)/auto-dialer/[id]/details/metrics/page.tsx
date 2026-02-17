"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { CampaignMetrics } from "@/types/autoDialerCampaign";
import { useParams } from "next/navigation";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import StatsCard from "@/components/StatsCard";
import ChartCard, { ChartCardNoData } from "@/components/ChartCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTableProvider, {
  DataTable,
  DataTableBody,
  DataTableHeader,
  DataTableSkeleton,
} from "@/components/ui/data-table";
import {
  HourglassBottom,
  AvTimer,
  PhoneInTalk,
  Groups,
  PieChart as PieChartIcon,
} from "@mui/icons-material";
import {
  waitingCallsColumns,
  inProgressCallsColumns,
  agentDetailsColumns,
} from "./columns";
import StatsMetricCard from "@/components/StatsMetricCard";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import StatsSubCard from "@/components/StatsSubCard";
import StatsMiniCard from "@/components/StatsMiniCard";

const AGENT_COLORS = {
  online: "#22c55e",
  available: "#3b82f6",
  onCall: "#f59e0b",
  dialing: "#8b5cf6",
  onBreak: "#ef4444",
};

const AutoDialerCampaignMetrics = () => {
  const t = useTranslations("autoDialer.campaignDetails");
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign-metrics", id],
    queryFn: () => autoDialerService.fetchCampaignMetrics(id),
    refetchInterval: 15000,
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

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={agentChartData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
            >
              {agentChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Section 1: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4">
          <StatsMiniCard
            icon={<HourglassBottom />}
            label={t("metrics.oldestCallWaitTime")}
            value={metrics?.oldestCallWaitTime ?? 0}
            color="warning"
          />
          <StatsMiniCard
            icon={<AvTimer />}
            label={t("metrics.averageCurrentWaitTime")}
            value={metrics?.averageCurrentWaitTime ?? 0}
            color="success"
          />
          <StatsMiniCard
            icon={<PhoneInTalk />}
            label={t("metrics.callsWaiting")}
            value={metrics?.callsWaiting ?? 0}
            color="primary"
          />
          <StatsMiniCard
            icon={<Groups />}
            label={t("metrics.callsInProgress")}
            value={metrics?.callsInProgress ?? 0}
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
