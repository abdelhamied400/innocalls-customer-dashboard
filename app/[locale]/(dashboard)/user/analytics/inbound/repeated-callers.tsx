import ChartCard from "@/components/ChartCard";
import { Call } from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import inboundAnalyticsService from "@/services/inbound-analytics.service";
import { InboundAnalyticsFilters } from "./page";
import NoData from "@/components/Analytics/NoData";
import { useTranslations } from "next-intl";

type InboundAnalyticsRepeatedCallersProps = {
  filters: InboundAnalyticsFilters;
};
const InboundAnalyticsRepeatedCallers = ({
  filters,
}: InboundAnalyticsRepeatedCallersProps) => {
  const t = useTranslations("analytics.inbound.repeatedCallers");

  const columns = [
    { header: t("table.columns.caller"), accessorKey: "caller" },
    { header: t("table.columns.totalCalls"), accessorKey: "totalCalls" },
    {
      header: t("table.columns.abandonedCalls"),
      accessorKey: "abandonedCalls",
    },
    { header: t("table.columns.timeoutCalls"), accessorKey: "timeoutCalls" },
    {
      header: t("table.columns.completedCalls"),
      accessorKey: "completedCalls",
    },
    { header: t("table.columns.abandonRate"), accessorKey: "abandonRate" },
    { header: t("table.columns.timeoutRate"), accessorKey: "timeoutRate" },
    {
      header: t("table.columns.completionRate"),
      accessorKey: "completionRate",
    },
    { header: t("table.columns.avgWaitTime"), accessorKey: "avgWaitTime" },
    { header: t("table.columns.avgTalkTime"), accessorKey: "avgTalkTime" },
    { header: t("table.columns.firstCallTime"), accessorKey: "firstCallTime" },
    { header: t("table.columns.lastCallTime"), accessorKey: "lastCallTime" },
  ];

  const {
    data: repeatedCallersData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["inbound-analytics-repeated-callers", filters],
    queryFn: () => inboundAnalyticsService.fetchRepeatedCallers(filters),
  });

  return (
    <div className="flex flex-col gap-4">
      <ChartCard
        title={t("title")}
        icon={<Call />}
        color="success"
        legends={[
          { label: t("legends.completedCalls"), color: "#10B981" },
          { label: t("legends.abandonedCalls"), color: "#F59E42" },
          { label: t("legends.timeoutCalls"), color: "#EF4444" },
        ]}
        variant="compound"
        isLoading={isLoading}
        isError={isError}
        error={error}
      >
        {!repeatedCallersData ||
          (repeatedCallersData.length === 0 && <NoData />)}
        {repeatedCallersData && repeatedCallersData.length > 0 && (
          <div className="w-full h-80 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repeatedCallersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="caller"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip />
                <Brush dataKey="caller" height={30} stroke="#8884d8" />
                <Bar
                  dataKey="completedCalls"
                  stackId="a"
                  fill="#10B981"
                  name={t("chartLabels.completed")}
                />
                <Bar
                  dataKey="abandonedCalls"
                  stackId="a"
                  fill="#F59E42"
                  name={t("chartLabels.abandoned")}
                />
                <Bar
                  dataKey="timeoutCalls"
                  stackId="a"
                  fill="#EF4444"
                  name={t("chartLabels.timeout")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <div className="overflow-x-auto border bg-white rounded-lg mt-6">
        <PaginatedTable
          data={repeatedCallersData || []}
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
      </div>
    </div>
  );
};

export default InboundAnalyticsRepeatedCallers;
