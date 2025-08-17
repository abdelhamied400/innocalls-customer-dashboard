import ChartCard from "@/components/ChartCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import inboundAnalyticsService from "@/services/inbound-analytics.service";
import { Engineering } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Brush,
} from "recharts";
import { InboundAnalyticsFilters } from "./page";
import NoData from "@/components/Analytics/NoData";
import { durationToSeconds, formatDuration } from "@/lib/date";
import { useTranslations } from "next-intl";

type InboundAnalyticsAgentPerformanceProps = {
  filters: InboundAnalyticsFilters;
};
const InboundAnalyticsAgentPerformance = ({
  filters,
}: InboundAnalyticsAgentPerformanceProps) => {
  const t = useTranslations("analytics.inbound.agentPerformance");

  const columns = [
    { header: t("table.columns.name"), accessorKey: "name" },
    { header: t("table.columns.ext"), accessorKey: "ext" },
    {
      header: t("table.columns.callsHandled"),
      accessorKey: "callsHandled",
    },
    {
      header: t("table.columns.avgWaitTime"),
      accessorKey: "avgWaitTime",
    },
    {
      header: t("table.columns.avgTalkTime"),
      accessorKey: "avgTalkTime",
    },
    {
      header: t("table.columns.totalTalkTime"),
      accessorKey: "totalTalkTime",
    },
    {
      header: t("table.columns.totalWaitTime"),
      accessorKey: "totalWaitTime",
    },
    {
      header: t("table.columns.queuePosition"),
      accessorKey: "minCustomerQueuePosition",
      cell: (info: any) =>
        `${info.row.original.minCustomerQueuePosition}-${info.row.original.maxCustomerQueuePosition}`,
    },
  ];

  const {
    data: agentPerformanceData,
    isLoading,
    error,
    isError,
  } = useLocalizedQuery({
    queryKey: ["inbound-analytics-agent-performance", filters],
    queryFn: () => inboundAnalyticsService.fetchAgentPerformance(filters),
  });

  return (
    <div className="inbound-analytics-agent-performance">
      <ChartCard
        icon={<Engineering />}
        title={t("title")}
        color="primary"
        legends={[
          { label: t("legends.callsHandled"), color: "#3B82F6" },
          { label: t("legends.avgWaitTime"), color: "#F59E42" },
          { label: t("legends.avgTalkTime"), color: "#10B981" },
        ]}
        variant="compound"
        isLoading={isLoading}
        error={error}
        isError={isError}
      >
        {agentPerformanceData?.length === 0 && <NoData />}
        {(agentPerformanceData?.length ?? 0) > 0 && (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="ext"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value, idx) =>
                    `${value} (${agentPerformanceData?.[idx].name})`
                  }
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value, name, item) => {
                    if (item.dataKey === "avgWaitTime")
                      return [
                        formatDuration(Number(value)),
                        t("legends.avgWaitTime"),
                      ];
                    if (item.dataKey === "avgTalkTime")
                      return [
                        formatDuration(Number(value)),
                        t("legends.avgTalkTime"),
                      ];
                    return [value, name];
                  }}
                />

                <Bar
                  dataKey="avgWaitTime"
                  fill="#F59E42"
                  radius={[4, 4, 0, 0]}
                  name={t("legends.avgWaitTime")}
                />
                <Bar
                  dataKey="avgTalkTime"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  name={t("legends.avgTalkTime")}
                />
                <Brush dataKey="name" height={30} stroke="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <div className="overflow-x-auto border bg-white rounded-lg mt-6">
        <PaginatedTable
          data={agentPerformanceData || []}
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

export default InboundAnalyticsAgentPerformance;
