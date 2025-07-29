"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import inboundAnalyticsService from "@/services/inbound-analytics.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartCard, { ChartCardSkeleton } from "@/components/ChartCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { ShowChart, TableView } from "@mui/icons-material";
import { InboundAnalyticsFilters } from "./page";
import NoData from "../../../../../../components/Analytics/NoData";

type InboundAnalyticsDateDistributionProps = {
  filters: InboundAnalyticsFilters;
};

const allColumns = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Total",
    accessorKey: "totalCalls",
  },
  {
    header: "Internal",
    accessorKey: "internalCalls",
  },
  {
    header: "External",
    accessorKey: "externalCalls",
  },
  {
    header: "Answered",
    accessorKey: "totalAnsweredCalls",
  },
  {
    header: "Unanswered",
    accessorKey: "totalUnAnsweredCalls",
  },
  {
    header: "Answer Rate",
    accessorKey: "answerRate",
    cell: (row: any) => `${row.getValue("answerRate")}%`,
  },
  {
    header: "Total Duration",
    accessorKey: "totalDuration",
  },
  {
    header: "Avg Duration",
    accessorKey: "avgDuration",
  },
  {
    header: "Shortest",
    accessorKey: "shortestCall",
  },
  {
    header: "Longest",
    accessorKey: "longestCall",
  },
];

const teamColumns = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Total",
    accessorKey: "totalCalls",
  },
  {
    header: "Timeout Calls",
    accessorKey: "timeoutCalls",
  },
  {
    header: "Answered Calls",
    accessorKey: "answeredCalls",
  },
  {
    header: "Abandoned Calls",
    accessorKey: "abandonedCalls",
  },
];

const InboundAnalyticsDateDistribution = ({
  filters,
}: InboundAnalyticsDateDistributionProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["dateDistribution", filters],
    queryFn: () =>
      inboundAnalyticsService.fetchDateDistributionAnalytics(filters),
  });

  return (
    <div className="date-distribution-analytics">
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="w-full flex justify-end">
          <TabsTrigger value="chart" className="flex items-center gap-1">
            <ShowChart />
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-1">
            <TableView />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chart">
          {isLoading && <ChartCardSkeleton />}
          {!isLoading && data && data.length > 0 && (
            <ChartCard
              title="Date Distribution"
              icon={<ShowChart />}
              color="primary"
              variant="compound"
              legends={[
                { label: "Total Calls", color: "#3B82F6" },
                { label: "Answered Calls", color: "#10B981" },
                { label: "Unanswered Calls", color: "#EF4444" },
                { label: "Abandoned Calls", color: "#A855F7" },
                { label: "Answered Calls", color: "#F59E42" },
                { label: "Timeout Calls", color: "#F97316" },
              ]}
            >
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
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
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="totalCalls"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalAnsweredCalls"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    name="Answered"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalUnAnsweredCalls"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    name="Unanswered"
                  />
                  <Line
                    type="monotone"
                    dataKey="abandonedCalls"
                    stroke="#A855F7"
                    strokeWidth={2}
                    dot={false}
                    name="Abandoned"
                  />
                  <Line
                    type="monotone"
                    dataKey="answeredCalls"
                    stroke="#F59E42"
                    strokeWidth={2}
                    dot={false}
                    name="Answered Calls"
                  />
                  <Line
                    type="monotone"
                    dataKey="timeoutCalls"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={false}
                    name="Timeout Calls"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
          {!isLoading && (!data || data.length === 0) && <NoData />}
        </TabsContent>
        <TabsContent value="table">
          <PaginatedTable
            data={data || []}
            columns={filters.filterBy === "team" ? teamColumns : allColumns}
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
    </div>
  );
};

export default InboundAnalyticsDateDistribution;
