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
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { UserActivityAnalyticsFilters } from "./page";
import NoData from "./NoData";

const columns = [
  { header: "Extension", accessorKey: "ext" },
  { header: "Name", accessorKey: "name" },
  { header: "Total Incoming Calls", accessorKey: "totalIncomingCalls" },
  { header: "Answered Incoming Calls", accessorKey: "answeredIncomingCalls" },
  { header: "Avg Response Time", accessorKey: "avgResponseTime" },
  {
    header: "Calls Answered Within SLA",
    accessorKey: "callsAnsweredWithinSLA",
  },
  { header: "SLA Compliance (%)", accessorKey: "slaCompliance" },
];

type SlaComplianceAnalyticsProps = {
  filters: UserActivityAnalyticsFilters;
};

const SlaComplianceAnalytics = ({ filters }: SlaComplianceAnalyticsProps) => {
  const { data, isLoading } = useQuery({
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
              title="SLA Compliance Overview"
              icon={<ShowChart />}
              color="warning"
              legends={[
                { label: "Excellent (90%+)", color: "#22c55e" },
                { label: "Good (70%-89%)", color: "#eab308" },
                { label: "Average (50%-69%)", color: "#f59e42" },
                { label: "Poor (30%-49%)", color: "#ef4444" },
                { label: "Very Poor (<30%)", color: "#991b1b" },
              ]}
              variant="compound"
            >
              {data && data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="slaCompliance">
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.ext}`}
                          fill={getSlaColor(Number(entry.slaCompliance))}
                        />
                      ))}
                    </Bar>
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
