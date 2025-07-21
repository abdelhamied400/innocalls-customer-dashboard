import ChartCard from "@/components/ChartCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { Engineering } from "@mui/icons-material";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const InboundAnalyticsAgentPerformance = () => {
  const data = [
    {
      agentExt: 4456,
      callsHandled: 25,
      avgWaitTime: "00:00:12",
      avgTalkTime: "00:02:15",
      totalWaitTime: "00:05:00",
      totalTalkTime: "00:56:15",
      minCustomerQueuePosition: 1,
      maxCustomerPosition: 3,
    },
    {
      agentExt: 1039,
      callsHandled: 32,
      avgWaitTime: "00:00:08",
      avgTalkTime: "00:01:45",
      totalWaitTime: "00:04:16",
      totalTalkTime: "00:56:00",
      minCustomerQueuePosition: 1,
      maxCustomerPosition: 2,
    },
    {
      agentExt: 1062,
      callsHandled: 18,
      avgWaitTime: "00:00:15",
      avgTalkTime: "00:02:30",
      totalWaitTime: "00:04:30",
      totalTalkTime: "00:45:00",
      minCustomerQueuePosition: 1,
      maxCustomerPosition: 4,
    },
    {
      agentExt: 1060,
      callsHandled: 28,
      avgWaitTime: "00:00:10",
      avgTalkTime: "00:01:55",
      totalWaitTime: "00:04:40",
      totalTalkTime: "00:54:20",
      minCustomerQueuePosition: 1,
      maxCustomerPosition: 2,
    },
    {
      agentExt: 4455,
      callsHandled: 22,
      avgWaitTime: "00:00:14",
      avgTalkTime: "00:02:05",
      totalWaitTime: "00:05:08",
      totalTalkTime: "00:45:50",
      minCustomerQueuePosition: 1,
      maxCustomerPosition: 3,
    },
  ];

  // Convert time strings to seconds for better visualization
  const processedData = data.map((item) => ({
    ...item,
    avgWaitTimeSec:
      parseFloat(item.avgWaitTime.split(":")[2]) +
      parseFloat(item.avgWaitTime.split(":")[1]) * 60 +
      parseFloat(item.avgWaitTime.split(":")[0]) * 3600,
    avgTalkTimeSec:
      parseFloat(item.avgTalkTime.split(":")[2]) +
      parseFloat(item.avgTalkTime.split(":")[1]) * 60 +
      parseFloat(item.avgTalkTime.split(":")[0]) * 3600,
  }));

  const columns = [
    { header: "Agent Ext", accessorKey: "agentExt" },
    { header: "Calls Handled", accessorKey: "callsHandled" },
    {
      header: "Avg Wait Time",
      accessorKey: "avgWaitTime",
      cell: (info: any) => info.getValue(),
    },
    {
      header: "Avg Talk Time",
      accessorKey: "avgTalkTime",
      cell: (info: any) => info.getValue(),
    },
    {
      header: "Queue Position",
      accessorKey: "minCustomerQueuePosition",
      cell: (info: any) =>
        `${info.row.original.minCustomerQueuePosition}-${info.row.original.maxCustomerPosition}`,
    },
  ];

  const [isLoading, setIsLoading] = useState(false);

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
      >
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="agentExt"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Agent Extension",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "avgWaitTimeSec")
                    return [
                      `${Math.floor(Number(value) / 60)}:${(Number(value) % 60)
                        .toString()
                        .padStart(2, "0")}`,
                      "Avg Wait Time",
                    ];
                  if (name === "avgTalkTimeSec")
                    return [
                      `${Math.floor(Number(value) / 60)}:${(Number(value) % 60)
                        .toString()
                        .padStart(2, "0")}`,
                      "Avg Talk Time",
                    ];
                  return [value, name];
                }}
              />

              <Bar
                dataKey="callsHandled"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="Calls Handled"
              />
              <Bar
                dataKey="avgWaitTimeSec"
                fill="#F59E42"
                radius={[4, 4, 0, 0]}
                name="Avg Wait Time"
              />
              <Bar
                dataKey="avgTalkTimeSec"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                name="Avg Talk Time"
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

export default InboundAnalyticsAgentPerformance;
