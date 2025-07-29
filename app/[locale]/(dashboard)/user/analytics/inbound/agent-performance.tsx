import ChartCard from "@/components/ChartCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import inboundAnalyticsService from "@/services/inbound-analytics.service";
import { Engineering } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
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
import { formatDuration } from "@/lib/date";

type InboundAnalyticsAgentPerformanceProps = {
  filters: InboundAnalyticsFilters;
};
const InboundAnalyticsAgentPerformance = ({
  filters,
}: InboundAnalyticsAgentPerformanceProps) => {
  const columns = [
    { header: "Agent Ext", accessorKey: "ext" },
    { header: "Calls Handled", accessorKey: "callsHandled" },
    {
      header: "Avg Wait Time",
      accessorKey: "avgWaitTime",
      cell: (info: any) => formatDuration(Number(info.getValue("avgWaitTime"))),
    },
    {
      header: "Avg Talk Time",
      accessorKey: "avgTalkTime",
      cell: (info: any) => formatDuration(Number(info.getValue("avgTalkTime"))),
    },
    {
      header: "Total Talk Time",
      accessorKey: "totalTalkTime",
      cell: (info: any) =>
        formatDuration(Number(info.getValue("totalWaitTime"))),
    },
    {
      header: "Total Wait Time",
      accessorKey: "totalWaitTime",
      cell: (info: any) =>
        formatDuration(Number(info.getValue("totalWaitTime"))),
    },
    {
      header: "Queue Position",
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
  } = useQuery({
    queryKey: ["inbound-analytics-agent-performance", filters],
    queryFn: () => inboundAnalyticsService.fetchAgentPerformance(filters),
  });

  return (
    <div className="inbound-analytics-agent-performance">
      <ChartCard
        icon={<Engineering />}
        title="Agent Performance Overview"
        color="primary"
        legends={[
          { label: "Calls Handled", color: "#3B82F6" },
          { label: "Avg Wait Time", color: "#F59E42" },
          { label: "Avg Talk Time", color: "#10B981" },
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
                      return [formatDuration(Number(value)), "Avg Wait Time"];
                    if (item.dataKey === "avgTalkTime")
                      return [formatDuration(Number(value)), "Avg Talk Time"];
                    return [value, name];
                  }}
                />

                <Bar
                  dataKey="avgWaitTime"
                  fill="#F59E42"
                  radius={[4, 4, 0, 0]}
                  name="Avg Wait Time"
                />
                <Bar
                  dataKey="avgTalkTime"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  name="Avg Talk Time"
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
