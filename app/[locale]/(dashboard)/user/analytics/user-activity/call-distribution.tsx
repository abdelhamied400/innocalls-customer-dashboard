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
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { UserActivityAnalyticsFilters } from "./page";
import NoData from "./NoData";

const columns = [
  {
    header: "Agent",
    accessorKey: "name",
  },
  {
    header: "Total Calls",
    accessorKey: "totalCalls",
  },
  {
    header: "Incoming Internal",
    accessorKey: "totalIncomingInternalCalls",
  },
  {
    header: "Incoming External",
    accessorKey: "totalIncomingExternalCalls",
  },
  {
    header: "Outgoing Internal",
    accessorKey: "totalOutgoingInternalCalls",
  },
  {
    header: "Outgoing External",
    accessorKey: "totalOutgoingExternalCalls",
  },
];

type CallDistributionAnalyticsProps = {
  filters: UserActivityAnalyticsFilters;
};

const CallDistributionAnalytics = ({
  filters,
}: CallDistributionAnalyticsProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["callDistribution", filters],
    queryFn: () => analyticsService.fetchCallDistributionAnalytics(filters),
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
          {!isLoading && data && (
            <ChartCard
              title="Call Distribution"
              icon={<ShowChart />}
              color="primary"
              legends={[
                { label: "Incoming Internal", color: "#8B5CF6" },
                { label: "Incoming External", color: "#3B82F6" },
                { label: "Outgoing Internal", color: "#F59E42" },
                { label: "Outgoing External", color: "#10B981" },
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
                        <Label
                          value="Number of Calls"
                          angle={-90}
                          position="insideLeft"
                          style={{ textAnchor: "middle" }}
                        />
                      </YAxis>
                      <Tooltip
                        formatter={(value, name) => {
                          switch (name) {
                            case "totalIncomingInternalCalls":
                              return [value, "Incoming Internal"];
                            case "totalIncomingExternalCalls":
                              return [value, "Incoming External"];
                            case "totalOutgoingInternalCalls":
                              return [value, "Outgoing Internal"];
                            case "totalOutgoingExternalCalls":
                              return [value, "Outgoing External"];
                            default:
                              return [value, name];
                          }
                        }}
                        labelFormatter={(label) => `Agent: ${label}`}
                      />
                      <Bar
                        dataKey="totalIncomingInternalCalls"
                        stackId="a"
                        fill="#8B5CF6"
                        name="Incoming Internal"
                      />
                      <Bar
                        dataKey="totalIncomingExternalCalls"
                        stackId="a"
                        fill="#3B82F6"
                        name="Incoming External"
                      />
                      <Bar
                        dataKey="totalOutgoingInternalCalls"
                        stackId="b"
                        fill="#F59E42"
                        name="Outgoing Internal"
                      />
                      <Bar
                        dataKey="totalOutgoingExternalCalls"
                        stackId="b"
                        fill="#10B981"
                        name="Outgoing External"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <NoData />
                )}{" "}
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

export default CallDistributionAnalytics;
