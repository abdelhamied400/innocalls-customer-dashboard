import ChartCard, { ChartCardSkeleton } from "@/components/ChartCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import analyticsService from "@/services/analytics.service";
import { ShowChart, TableView } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { UserActivityFilters } from "./page";
import NoData from "./NoData";
import { useTranslations } from "@/providers/TranslationProvider";
import { useState } from "react";
import CallStatsToolbar, { CallStatsFilters } from "./call-stats-toolbar";

type CallStatsAnalyticsProps = {
  filters: UserActivityFilters;
};

const CallStatsAnalytics = ({ filters }: CallStatsAnalyticsProps) => {
  const t = useTranslations("analytics.userActivity.callStats");
  const tCommon = useTranslations("analytics.userActivity.common");

  const [callStatsFilters, setCallStatsFilters] = useState<CallStatsFilters>({
    search: "",
  });

  const columns = [
    { header: t("table.columns.name"), accessorKey: "name" },
    { header: t("table.columns.ext"), accessorKey: "ext" },
    { header: t("table.columns.totalCalls"), accessorKey: "totalCalls" },
    {
      header: t("table.columns.totalTalkTime"),
      accessorKey: "totalTalkTime",
    },
    { header: t("table.columns.answeredCount"), accessorKey: "answeredCount" },
    { header: t("table.columns.answerRate"), accessorKey: "answerRate" },
    { header: t("table.columns.longestCall"), accessorKey: "longestCall" },
    { header: t("table.columns.shortestCall"), accessorKey: "shortestCall" },
  ];

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["callStats", filters],
    queryFn: () => analyticsService.fetchCallStatsAnalytics(filters),
  });

  return (
    <div className="call-distribution-analytics">
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
          {data?.length === 0 && !isLoading && (
            <div className="text-center text-muted">
              {tCommon("noDataAvailable")}
            </div>
          )}
          {!isLoading && data && (
            <ChartCard
              title={t("title")}
              icon={<ShowChart />}
              color="success"
              legends={[
                { label: t("chart.legends.totalCalls"), color: "#6366F1" },
                { label: t("chart.legends.answeredCalls"), color: "#10B981" },
              ]}
              variant="compound"
            >
              <div className="w-full h-80">
                {data && data.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      width={700}
                      height={400}
                      data={data}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" type="category" width={120}></XAxis>
                      <YAxis type="number">
                        <Label
                          value={t("chart.yAxisLabel")}
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip
                        formatter={(value, name) => {
                          switch (name) {
                            case "totalCalls":
                              return [
                                value,
                                t("chart.tooltipLabels.totalCalls"),
                              ];
                            case "answeredCount":
                              return [value, t("chart.tooltipLabels.answered")];
                            default:
                              return [value, name];
                          }
                        }}
                        labelFormatter={(label) =>
                          `${t("chart.tooltipAgent")}: ${label}`
                        }
                      />
                      <Bar
                        dataKey="totalCalls"
                        fill="#6366F1"
                        name={t("chart.tooltipLabels.totalCalls")}
                      />
                      <Line
                        type="monotone"
                        dataKey="answeredCount"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name={t("chart.tooltipLabels.answered")}
                      />
                      <Brush
                        dataKey="answeredCount"
                        height={30}
                        stroke="#8884d8"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <NoData />
                )}
              </div>
            </ChartCard>
          )}
        </TabsContent>
        <TabsContent value="table">
          <PaginatedTable
            data={data || []}
            columns={columns}
            manualPagination={false}
          >
            <CallStatsToolbar
              filters={callStatsFilters}
              setFilters={setCallStatsFilters}
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

export default CallStatsAnalytics;
