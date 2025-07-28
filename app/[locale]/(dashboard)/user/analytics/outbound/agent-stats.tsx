import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Brush,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartCard from "@/components/ChartCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TableViewIcon from "@mui/icons-material/TableView";
import PeopleIcon from "@mui/icons-material/People";
import outboundAnalyticsService from "@/services/outbound-analytics.service";
import NoData from "../../../../../../components/Analytics/NoData";
import { OutboundAnalyticsFilters } from "./page";
import { useTranslations } from "next-intl";

type AgentStatsAnalyticsProps = {
  filters: OutboundAnalyticsFilters;
};

const AgentStatsAnalytics = ({ filters }: AgentStatsAnalyticsProps) => {
  const t = useTranslations("analytics.outbound.agentStats");

  const {
    data: agentStats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["outbound-agent-stats", filters],
    queryFn: () => outboundAnalyticsService.fetchAgentStatsAnalytics(filters),
  });

  const columns = [
    {
      accessorKey: "name",
      header: t("table.columns.name"),
    },
    {
      accessorKey: "ext",
      header: t("table.columns.ext"),
    },
    {
      accessorKey: "totalCalls",
      header: t("table.columns.totalCalls"),
    },
    {
      accessorKey: "answeredCalls",
      header: t("table.columns.answered"),
    },
    {
      accessorKey: "unansweredCalls",
      header: t("table.columns.unanswered"),
    },
    {
      accessorKey: "internalCalls",
      header: t("table.columns.internal"),
    },
    {
      accessorKey: "externalCalls",
      header: t("table.columns.external"),
    },
    {
      accessorKey: "totalDuration",
      header: t("table.columns.totalDuration"),
    },
    {
      accessorKey: "avgDuration",
      header: t("table.columns.avgDuration"),
    },
  ];

  if (isLoading) {
    return (
      <ChartCard title={t("title")} icon={<PeopleIcon />} className="h-[500px]">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </ChartCard>
    );
  }

  if (error) {
    return (
      <ChartCard title={t("title")} icon={<PeopleIcon />} className="h-[500px]">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">{t("errors.loading")}</div>
        </div>
      </ChartCard>
    );
  }

  return (
    <Tabs defaultValue="chart" className="w-full">
      <TabsList className="flex justify-end">
        <TabsTrigger value="chart" className="flex items-center gap-2">
          <ShowChartIcon fontSize="small" />
        </TabsTrigger>
        <TabsTrigger value="table" className="flex items-center gap-2">
          <TableViewIcon fontSize="small" />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="chart" className="mt-4">
        <ChartCard
          title={t("title")}
          icon={<PeopleIcon />}
          variant="compound"
          color="info"
        >
          {agentStats && agentStats.length === 0 ? (
            <NoData />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={agentStats || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" />
                <YAxis fontSize={12} />
                <RechartsTooltip />
                <RechartsLegend />
                <Bar
                  dataKey="totalCalls"
                  fill="#3B82F6"
                  name={t("chart.legends.totalCalls")}
                />
                <Bar
                  dataKey="answeredCalls"
                  fill="#10B981"
                  name={t("chart.legends.answered")}
                />
                <Bar
                  dataKey="unansweredCalls"
                  fill="#EF4444"
                  name={t("chart.legends.unanswered")}
                />
                <Brush dataKey="name" height={30} stroke="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </TabsContent>

      <TabsContent value="table" className="mt-4">
        <PaginatedTable
          data={agentStats || []}
          columns={columns}
          manualPagination={false}
        >
          <PaginatedTableContent>
            <PaginatedTableHead />
            {isLoading && <PaginatedTableSkeleton />}
            {!isLoading && <PaginatedTableBody />}
          </PaginatedTableContent>
          {!isLoading && <PaginatedTablePagination />}
        </PaginatedTable>
      </TabsContent>
    </Tabs>
  );
};

export default AgentStatsAnalytics;
