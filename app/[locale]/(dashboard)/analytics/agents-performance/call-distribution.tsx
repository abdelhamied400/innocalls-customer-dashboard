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
  Label as RechartsLabel,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Label } from "@/components/ui/label";
import NoData from "./NoData";
import { UserActivityFilters } from "./page";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import CallDistributionToolbar from "./call-distribution-toolbar";

type CallDistributionAnalyticsProps = {
  filters: UserActivityFilters;
};

export type CallDistributionFilters = {
  search: string;
};

const CallDistributionAnalytics = ({
  filters,
}: CallDistributionAnalyticsProps) => {
  const t = useTranslations("analytics.userActivity.callDistribution");
  const [includeInternalCalls, setIncludeInternalCalls] = useState(false);
  const [callDistributionFilters, setCallDistributionFilters] =
    useState<CallDistributionFilters>({
      search: "",
    });

  const columns = [
    {
      header: t("table.columns.name"),
      accessorKey: "name",
    },
    {
      header: t("table.columns.ext"),
      accessorKey: "ext",
    },
    {
      header: t("table.columns.totalCalls"),
      accessorKey: "totalCalls",
    },
    ...(includeInternalCalls
      ? [
          {
            header: t("table.columns.incomingInternal"),
            accessorKey: "totalIncomingInternalCalls",
          },
        ]
      : []),
    {
      header: t("table.columns.incomingExternal"),
      accessorKey: "totalIncomingExternalCalls",
    },
    ...(includeInternalCalls
      ? [
          {
            header: t("table.columns.outgoingInternal"),
            accessorKey: "totalOutgoingInternalCalls",
          },
        ]
      : []),
    {
      header: t("table.columns.outgoingExternal"),
      accessorKey: "totalOutgoingExternalCalls",
    },
    ...(includeInternalCalls
      ? [
          {
            header: t("table.columns.answeredInternalIncoming"),
            accessorKey: "totalAnsweredIncomingInternalCalls",
          },
        ]
      : []),
    {
      header: t("table.columns.answeredExternalIncoming"),
      accessorKey: "totalAnsweredIncomingExternalCalls",
    },
    ...(includeInternalCalls
      ? [
          {
            header: t("table.columns.connectedInternalOutgoing"),
            accessorKey: "totalAnsweredOutgoingInternalCalls",
          },
        ]
      : []),
    {
      header: t("table.columns.connectedExternalOutgoing"),
      accessorKey: "totalAnsweredOutgoingExternalCalls",
    },
  ];

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["callDistribution", filters],
    queryFn: () => analyticsService.fetchCallDistributionAnalytics(filters),
  });

  return (
    <div className="call-distribution-analytics">
      <Tabs defaultValue="chart" className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="includeInternalCalls"
              checked={includeInternalCalls}
              onCheckedChange={setIncludeInternalCalls}
            />
            <Label htmlFor="includeInternalCalls">
              {t("actions.includeInternalCalls")}
            </Label>
          </div>

          <TabsList className="">
            <TabsTrigger value="chart" className="flex items-center gap-1">
              <ShowChart />
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-1">
              <TableView />
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="chart">
          {isLoading && <ChartCardSkeleton />}
          {!isLoading && data && (
            <ChartCard
              title={t("title")}
              icon={<ShowChart />}
              color="primary"
              legends={[
                ...(includeInternalCalls
                  ? [
                      {
                        label: t("chart.legends.incomingInternal"),
                        color: "#8B5CF6",
                      },
                    ]
                  : []),
                {
                  label: t("chart.legends.incomingExternal"),
                  color: "#3B82F6",
                },
                ...(includeInternalCalls
                  ? [
                      {
                        label: t("chart.legends.outgoingInternal"),
                        color: "#F59E42",
                      },
                    ]
                  : []),
                {
                  label: t("chart.legends.outgoingExternal"),
                  color: "#10B981",
                },
              ]}
              variant="compound"
            >
              <div className="w-full h-80">
                {data && data.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      layout="horizontal"
                      className="h-full w-full"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" type="category" width={120}></XAxis>
                      <YAxis type="number">
                        <RechartsLabel
                          value={t("chart.yAxisLabel")}
                          angle={-90}
                          position="insideLeft"
                          style={{ textAnchor: "middle" }}
                        />
                      </YAxis>
                      <Tooltip
                        formatter={(value, name) => {
                          switch (name) {
                            case "totalIncomingInternalCalls":
                              return [
                                value,
                                t("chart.legends.incomingInternal"),
                              ];
                            case "totalIncomingExternalCalls":
                              return [
                                value,
                                t("chart.legends.incomingExternal"),
                              ];
                            case "totalOutgoingInternalCalls":
                              return [
                                value,
                                t("chart.legends.outgoingInternal"),
                              ];
                            case "totalOutgoingExternalCalls":
                              return [
                                value,
                                t("chart.legends.outgoingExternal"),
                              ];
                            default:
                              return [value, name];
                          }
                        }}
                        labelFormatter={(label) =>
                          `${t("chart.tooltipAgent")}: ${label}`
                        }
                      />
                      {includeInternalCalls && (
                        <Bar
                          dataKey="totalIncomingInternalCalls"
                          stackId="a"
                          fill="#8B5CF6"
                          name={t("chart.legends.incomingInternal")}
                        />
                      )}
                      <Bar
                        dataKey="totalIncomingExternalCalls"
                        stackId="a"
                        fill="#3B82F6"
                        name={t("chart.legends.incomingExternal")}
                      />
                      {includeInternalCalls && (
                        <Bar
                          dataKey="totalOutgoingInternalCalls"
                          stackId="b"
                          fill="#F59E42"
                          name={t("chart.legends.outgoingInternal")}
                        />
                      )}
                      <Bar
                        dataKey="totalOutgoingExternalCalls"
                        stackId="b"
                        fill="#10B981"
                        name={t("chart.legends.outgoingExternal")}
                      />
                      <Brush dataKey="name" height={30} stroke="#8884d8" />
                    </BarChart>
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
            <CallDistributionToolbar
              filters={callDistributionFilters}
              setFilters={setCallDistributionFilters}
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

export default CallDistributionAnalytics;
