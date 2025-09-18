"use client";

import React, { useState } from "react";
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
import NoData from "../../../../components/Analytics/NoData";
import { useTranslations } from "@/providers/TranslationProvider";
import DateDistributionToolbar from "./date-distribution-toolbar";

type InboundAnalyticsDateDistributionProps = {
  filters: InboundAnalyticsFilters;
};

export type DateDistributionFilters = {
  search: string;
};

const InboundAnalyticsDateDistribution = ({
  filters,
}: InboundAnalyticsDateDistributionProps) => {
  const t = useTranslations("analytics.inbound.dateDistribution");

  const [dateDistributionFilters, setDateDistributionFilters] =
    useState<DateDistributionFilters>({
      search: "",
    });

  const allColumns = [
    {
      header: t("table.allColumns.date"),
      accessorKey: "date",
    },
    {
      header: t("table.allColumns.total"),
      accessorKey: "totalCalls",
    },
    ...(filters.includeInternalCalls
      ? [
          {
            header: t("table.allColumns.internal"),
            accessorKey: "internalCalls",
          },
        ]
      : []),
    {
      header: t("table.allColumns.external"),
      accessorKey: "externalCalls",
    },
    {
      header: t("table.allColumns.answered"),
      accessorKey: "totalAnsweredCalls",
    },
    {
      header: t("table.allColumns.unanswered"),
      accessorKey: "totalUnAnsweredCalls",
    },
    {
      header: t("table.allColumns.answerRate"),
      accessorKey: "answerRate",
      cell: (row: any) => `${row.getValue("answerRate")}\u200E%`,
    },
    {
      header: t("table.allColumns.totalDuration"),
      accessorKey: "totalDuration",
    },
    {
      header: t("table.allColumns.avgDuration"),
      accessorKey: "avgDuration",
    },
    {
      header: t("table.allColumns.shortest"),
      accessorKey: "shortestCall",
    },
    {
      header: t("table.allColumns.longest"),
      accessorKey: "longestCall",
    },
  ];

  const teamColumns = [
    {
      header: t("table.teamColumns.date"),
      accessorKey: "date",
    },
    {
      header: t("table.teamColumns.total"),
      accessorKey: "totalCalls",
    },
    {
      header: t("table.teamColumns.timeoutCalls"),
      accessorKey: "timeoutCalls",
    },
    {
      header: t("table.teamColumns.answeredCalls"),
      accessorKey: "answeredCalls",
    },
    {
      header: t("table.teamColumns.abandonedCalls"),
      accessorKey: "abandonedCalls",
    },
  ];

  const legends = {
    team: [
      { label: t("legends.totalCalls"), color: "#3B82F6" },
      { label: t("legends.abandonedCalls"), color: "#A855F7" },
      { label: t("legends.answeredCalls"), color: "#F59E42" },
      { label: t("legends.timeoutCalls"), color: "#F97316" },
    ],
    all: [
      { label: t("legends.totalCalls"), color: "#3B82F6" },
      { label: t("legends.answeredCalls"), color: "#10B981" },
      { label: t("legends.unansweredCalls"), color: "#EF4444" },
    ],
  };

  const { data, isLoading } = useLocalizedQuery({
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
              title={t("title")}
              icon={<ShowChart />}
              color="primary"
              variant="compound"
              legends={legends[filters.filterBy]}
            >
              <ResponsiveContainer
                style={{ direction: "ltr" }}
                width="100%"
                height={320}
              >
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
                    name={t("table.allColumns.total")}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalAnsweredCalls"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                    name={t("table.allColumns.answered")}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalUnAnsweredCalls"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                    name={t("table.allColumns.unanswered")}
                  />
                  <Line
                    type="monotone"
                    dataKey="abandonedCalls"
                    stroke="#A855F7"
                    strokeWidth={2}
                    dot={false}
                    name={t("table.teamColumns.abandonedCalls")}
                  />
                  <Line
                    type="monotone"
                    dataKey="answeredCalls"
                    stroke="#F59E42"
                    strokeWidth={2}
                    dot={false}
                    name={t("table.teamColumns.answeredCalls")}
                  />
                  <Line
                    type="monotone"
                    dataKey="timeoutCalls"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={false}
                    name={t("table.teamColumns.timeoutCalls")}
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
            <DateDistributionToolbar
              filters={dateDistributionFilters}
              setFilters={setDateDistributionFilters}
            />
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
