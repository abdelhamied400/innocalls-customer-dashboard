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

const columns = [
  { header: "Agent Ext", accessorKey: "ext" },
  { header: "Name", accessorKey: "name" },
  { header: "Total Calls", accessorKey: "totalCalls" },
  { header: "Avg Call Duration", accessorKey: "avgCallDuration" },
  { header: "Total Talk Time", accessorKey: "totalTalkTime" },
  { header: "Answered Count", accessorKey: "answeredCount" },
  { header: "Answer Rate (%)", accessorKey: "answerRate" },
  { header: "Longest Call", accessorKey: "longestCall" },
  { header: "Shortest Call", accessorKey: "shortestCall" },
];

type CallStatsAnalyticsProps = {
  filters: UserActivityFilters;
};

const CallStatsAnalytics = ({ filters }: CallStatsAnalyticsProps) => {
  const { data, isLoading } = useQuery({
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
            <div className="text-center text-muted">No data available</div>
          )}
          {!isLoading && data && (
            <ChartCard
              title="Call Statistics Overview"
              icon={<ShowChart />}
              color="success"
              legends={[
                { label: "Total Calls", color: "#6366F1" },
                { label: "Answered Calls", color: "#10B981" },
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
                          value="Number of Calls"
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip
                        formatter={(value, name) => {
                          switch (name) {
                            case "totalCalls":
                              return [value, "Total Calls"];
                            case "answeredCount":
                              return [value, "Answered"];
                            default:
                              return [value, name];
                          }
                        }}
                        labelFormatter={(label) => `Agent: ${label}`}
                      />
                      <Bar
                        dataKey="totalCalls"
                        fill="#6366F1"
                        name="Total Calls"
                      />
                      <Line
                        type="monotone"
                        dataKey="answeredCount"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Answered"
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
