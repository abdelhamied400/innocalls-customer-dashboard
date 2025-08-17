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
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import outboundAnalyticsService from "@/services/outbound-analytics.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartCard, { ChartCardSkeleton } from "@/components/ChartCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { ShowChart, TableView } from "@mui/icons-material";
import { OutboundAnalyticsFilters } from "./page";
import NoData from "../../../../../components/Analytics/NoData";
import { useTranslations } from "next-intl";

type DateDistributionAnalyticsProps = {
  filters: OutboundAnalyticsFilters;
};

const DateDistributionAnalytics = ({
  filters,
}: DateDistributionAnalyticsProps) => {
  const t = useTranslations("analytics.outbound.dateDistribution");

  const columns = [
    {
      header: t("table.columns.date"),

      accessorKey: "date",
    },
    {
      header: t("table.columns.total"),
      accessorKey: "totalCalls",
    },
    {
      header: t("table.columns.internal"),
      accessorKey: "internalCalls",
    },
    {
      header: t("table.columns.external"),
      accessorKey: "externalCalls",
    },
    {
      header: t("table.columns.answered"),
      accessorKey: "totalAnsweredCalls",
    },
    {
      header: t("table.columns.unanswered"),
      accessorKey: "totalUnAnsweredCalls",
    },
    {
      header: t("table.columns.answerRate"),
      accessorKey: "answerRate",
      cell: (row: any) => `${row.getValue("answerRate")}%`,
    },
    {
      header: t("table.columns.totalDuration"),
      accessorKey: "totalDuration",
    },
    {
      header: t("table.columns.avgDuration"),
      accessorKey: "avgDuration",
    },
    {
      header: t("table.columns.shortest"),
      accessorKey: "shortestCall",
    },
    {
      header: t("table.columns.longest"),
      accessorKey: "longestCall",
    },
  ];

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["dateDistribution", filters],
    queryFn: () =>
      outboundAnalyticsService.fetchDateDistributionAnalytics(filters),
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
              title={t("title")}
              icon={<ShowChart />}
              color="primary"
              variant="compound"
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
                  <RechartsLegend />
                  <Line
                    type="monotone"
                    dataKey="totalCalls"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    name={t("chart.legends.total")}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalAnsweredCalls"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    name={t("chart.legends.answered")}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalUnAnsweredCalls"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    name={t("chart.legends.unanswered")}
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
    </div>
  );
};

export default DateDistributionAnalytics;
