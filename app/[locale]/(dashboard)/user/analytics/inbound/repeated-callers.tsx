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
} from "recharts";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { useState } from "react";

const InboundAnalyticsRepeatedCallers = () => {
  const data = [
    {
      caller: "4456",
      totalCalls: 3,
      abandonedCalls: 0,
      timeoutCalls: 1,
      completedCalls: 2,
      abandonRate: 0,
      timeoutRate: 33.33,
      completionRate: 66.67,
      avgWaitTime: "00:02:39",
      avgTalkTime: "00:00:28",
      firstCallTime: "2025-06-01 09:12:54",
      lastCallTime: "2025-06-03 10:21:35",
    },
    {
      caller: "4455",
      totalCalls: 3,
      abandonedCalls: 2,
      timeoutCalls: 1,
      completedCalls: 0,
      abandonRate: 66.67,
      timeoutRate: 33.33,
      completionRate: 0,
      avgWaitTime: "00:03:02",
      avgTalkTime: "00:00:00",
      firstCallTime: "2025-06-01 09:16:47",
      lastCallTime: "2025-06-03 10:19:19",
    },
  ];

  const columns = [
    { header: "Caller", accessorKey: "caller" },
    { header: "Total Calls", accessorKey: "totalCalls" },
    { header: "Abandoned Calls", accessorKey: "abandonedCalls" },
    { header: "Timeout Calls", accessorKey: "timeoutCalls" },
    { header: "Completed Calls", accessorKey: "completedCalls" },
    { header: "Abandon Rate (%)", accessorKey: "abandonRate" },
    { header: "Timeout Rate (%)", accessorKey: "timeoutRate" },
    { header: "Completion Rate (%)", accessorKey: "completionRate" },
    { header: "Avg Wait Time", accessorKey: "avgWaitTime" },
    { header: "Avg Talk Time", accessorKey: "avgTalkTime" },
    { header: "First Call Time", accessorKey: "firstCallTime" },
    { header: "Last Call Time", accessorKey: "lastCallTime" },
  ];

  const isLoading = false; // Replace with actual loading state if needed

  return (
    <div className="flex flex-col gap-4">
      <ChartCard
        title="IVR Analysis"
        icon={<Call />}
        color="success"
        legends={[
          { label: "Completed Calls", color: "#10B981" },
          { label: "Abandoned Calls", color: "#F59E42" },
          { label: "Timeout Calls", color: "#EF4444" },
        ]}
        variant="compound"
      >
        <div className="w-full h-80 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
              <Legend />
              <Bar
                dataKey="completedCalls"
                stackId="a"
                fill="#10B981"
                name="Completed"
              />
              <Bar
                dataKey="abandonedCalls"
                stackId="a"
                fill="#F59E42"
                name="Abandoned"
              />
              <Bar
                dataKey="timeoutCalls"
                stackId="a"
                fill="#EF4444"
                name="Timeout"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="overflow-x-auto border bg-white rounded-lg mt-6">
        <PaginatedTable
          data={data || []}
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
