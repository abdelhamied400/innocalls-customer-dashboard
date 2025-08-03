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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Brush,
} from "recharts";
import { UserActivityFilters } from "./page";
import NoData from "./NoData";
import { useTranslations } from "next-intl";

type SlaComplianceAnalyticsProps = {
  filters: UserActivityFilters;
};

const SlaComplianceAnalytics = ({ filters }: SlaComplianceAnalyticsProps) => {
  const t = useTranslations("analytics.userActivity.slaCompliance");

  const columns = [
    { header: t("table.columns.name"), accessorKey: "name" },
    { header: t("table.columns.ext"), accessorKey: "ext" },
    {
      header: t("table.columns.totalIncomingCalls"),
      accessorKey: "totalIncomingCalls",
    },
    {
      header: t("table.columns.answeredIncomingCalls"),
      accessorKey: "answeredIncomingCalls",
    },
   {
      header: t("table.columns.answeredIncomingInternalCalls"),
      accessorKey: "answeredIncomingInternalCalls",
    },
       {
      header: t("table.columns.answeredIncomingExternalCalls"),
      accessorKey: "answeredIncomingExternalCalls",
    },





    {
      header: t("table.columns.avgResponseTime"),
      accessorKey: "avgResponseTime",
    },
    {
      header: t("table.columns.callsAnsweredWithinSLA"),
      accessorKey: "callsAnsweredWithinSLA",
    },
    { header: t("table.columns.slaCompliance"), accessorKey: "slaCompliance" },
  ];

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["slaCompliance", filters],
    queryFn: () => analyticsService.fetchSlaComplianceAnalytics(filters),
  });

  // Helper to get color for SLA compliance
  function getSlaColor(sla: string | number | null) {
    const val =
      sla === null ? 0 : typeof sla === "string" ? parseFloat(sla) : sla;
    if (val >= 90) return "#22c55e"; // green
    if (val >= 70) return "#eab308"; // yellow
    if (val >= 50) return "#f59e42"; // orange
    if (val >= 30) return "#ef4444"; // red
    return "#991b1b"; // dark red
  }

  return (
    <div className="sla-compliance-analytics">
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
          {!isLoading && data && (
            <ChartCard
              title={t("title")}
              icon={<ShowChart />}
              color="warning"
              legends={[
                { label: t("chart.legends.excellent"), color: "#22c55e" },
                { label: t("chart.legends.good"), color: "#eab308" },
                { label: t("chart.legends.average"), color: "#f59e42" },
                { label: t("chart.legends.poor"), color: "#ef4444" },
                { label: t("chart.legends.veryPoor"), color: "#991b1b" },
              ]}
              variant="compound"
            >
              {data && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar
                      dataKey="slaCompliance"
                      name={t("chart.tooltipLabels.slaCompliance")}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.ext}`}
                          fill={getSlaColor(Number(entry.slaCompliance))}
                        />
                      ))}
                    </Bar>
                    <Brush dataKey="name" height={30} stroke="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <NoData />
              )}
            </ChartCard>
          )}
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

export default SlaComplianceAnalytics;
