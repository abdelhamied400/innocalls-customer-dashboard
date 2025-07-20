import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartCard from "@/components/ChartCard";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TableViewIcon from "@mui/icons-material/TableView";
import PeopleIcon from "@mui/icons-material/People";
import outboundAnalyticsService from "@/services/outbound-analytics.service";
import NoData from "./NoData";

type OutboundAnalyticsFilters = {
  fromDate: Date;
  toDate: Date;
  agents: Array<{ value: string; label: string; }>;
  slaCompliance: number;
};

type AgentStatsAnalyticsProps = {
  filters: OutboundAnalyticsFilters;
};

type AgentStatsData = {
  ext: string;
  name: string;
  totalCalls: number;
  answeredCalls: number;
  unansweredCalls: number;
  internalCalls: number;
  externalCalls: number;
  totalDuration: number;
  avgDuration: number;
};

function AgentStatsBarChart({ data }: { data: AgentStatsData[] }) {
  if (!data || data.length === 0) {
    return <NoData />;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <RechartsTooltip />
        <RechartsLegend />
        <Bar dataKey="totalCalls" fill="#3B82F6" name="Total Calls" />
        <Bar dataKey="answeredCalls" fill="#10B981" name="Answered" />
        <Bar dataKey="unansweredCalls" fill="#EF4444" name="Unanswered" />
      </BarChart>
    </ResponsiveContainer>
  );
}

const AgentStatsAnalytics = ({ filters }: AgentStatsAnalyticsProps) => {
  const { data: agentStats, isLoading, error } = useQuery({
    queryKey: ["outbound-agent-stats", filters],
    queryFn: () => outboundAnalyticsService.fetchAgentStatsAnalytics(filters),
  });

  const columns = [
    {
      accessorKey: "ext",
      header: "Ext",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "totalCalls",
      header: "Total Calls",
    },
    {
      accessorKey: "answeredCalls",
      header: "Answered",
    },
    {
      accessorKey: "unansweredCalls",
      header: "Unanswered",
    },
    {
      accessorKey: "internalCalls",
      header: "Internal",
    },
    {
      accessorKey: "externalCalls",
      header: "External",
    },
    {
      accessorKey: "totalDuration",
      header: "Total Duration",
    },
    {
      accessorKey: "avgDuration",
      header: "Avg Duration",
    },
  ];

  if (isLoading) {
    return (
      <ChartCard title="Agent Statistics" icon={<PeopleIcon />} className="h-[500px]">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </ChartCard>
    );
  }

  if (error) {
    return (
      <ChartCard title="Agent Statistics" icon={<PeopleIcon />} className="h-[500px]">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">Error loading agent statistics</div>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Agent Statistics" icon={<PeopleIcon />} className="h-[500px]">
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="chart" className="flex items-center gap-2">
            <ShowChartIcon fontSize="small" />
            Chart
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TableViewIcon fontSize="small" />
            Table
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="mt-4">
          <AgentStatsBarChart data={agentStats || []} />
        </TabsContent>
        
        <TabsContent value="table" className="mt-4">
          <PaginatedTable
            data={agentStats || []}
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
    </ChartCard>
  );
};

export default AgentStatsAnalytics;
