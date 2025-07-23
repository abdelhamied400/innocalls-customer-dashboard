import ChartCard from "@/components/ChartCard";
import { InboundAnalyticsFilters } from "./page";
import { Alarm, ExitToApp } from "@mui/icons-material";
import {
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type InboundAnalyticsQueueAnalysisProps = {
  filters: InboundAnalyticsFilters;
};
const InboundAnalyticsQueueAnalysis = ({
  filters,
}: InboundAnalyticsQueueAnalysisProps) => {
  const data = {
    totalAbandonedCalls: 42,
    uniqueCallersAbandoned: 35,
    queuesWithAbandons: 2,
    avgWaitTimeBeforeAbandon: 60,
    minWaitTimeBeforeAbandon: 10,
    maxWaitTimeBeforeAbandon: 180,
    avgInitialQueuePosition: 2.1,
    minInitialQueuePosition: 1,
    maxInitialQueuePosition: 7,
    quickAbandons_0_10s: 10,
    shortWait_11_30s: 15,
    mediumWait_31_60s: 8,
    longWait_1_2min: 6,
    veryLongWait_2min_plus: 3,
    peakAbandonHour: 14,
  };

  const waitTimeDistribution = [
    { name: "0-10s", value: data.quickAbandons_0_10s, color: "#EF4444" },
    { name: "11-30s", value: data.shortWait_11_30s, color: "#F59E42" },
    { name: "31-60s", value: data.mediumWait_31_60s, color: "#FBBF24" },
    { name: "1-2min", value: data.longWait_1_2min, color: "#10B981" },
    { name: "2min+", value: data.veryLongWait_2min_plus, color: "#3B82F6" },
  ];

  const queueStats = [
    {
      name: "Avg Wait Time",
      value: `${Math.floor(data.avgWaitTimeBeforeAbandon / 60)}:${(
        data.avgWaitTimeBeforeAbandon % 60
      )
        .toString()
        .padStart(2, "0")}`,
    },
    {
      name: "Min Wait Time",
      value: `${Math.floor(data.minWaitTimeBeforeAbandon / 60)}:${(
        data.minWaitTimeBeforeAbandon % 60
      )
        .toString()
        .padStart(2, "0")}`,
    },
    {
      name: "Max Wait Time",
      value: `${Math.floor(data.maxWaitTimeBeforeAbandon / 60)}:${(
        data.maxWaitTimeBeforeAbandon % 60
      )
        .toString()
        .padStart(2, "0")}`,
    },
    {
      name: "Avg Queue Position",
      value: data.avgInitialQueuePosition.toFixed(1),
    },
    { name: "Peak Abandon Hour", value: `${data.peakAbandonHour}:00` },
  ];

  const data2 = {
    totalTimeoutCalls: 18,
    uniqueCallersTimeout: 15,
    queuesWithTimeouts: 1,
    avgWaitTimeBeforeTimeout: 120,
    minWaitTimeBeforeTimeout: 60,
    maxWaitTimeBeforeTimeout: 300,
    avgInitialQueuePosition: 3.5,
    minInitialQueuePosition: 1,
    maxInitialQueuePosition: 10,
    quickTimeouts_0_10s: 2,
    shortWait_11_30s: 4,
    mediumWait_31_60s: 5,
    longWait_1_2min: 5,
    veryLongWait_2min_plus: 2,
    peakTimeoutHour: 15,
  };
  const waitTimeDistribution2 = [
    { name: "0-10s", value: data2.quickTimeouts_0_10s, color: "#EF4444" },
    { name: "11-30s", value: data2.shortWait_11_30s, color: "#F59E42" },
    { name: "31-60s", value: data2.mediumWait_31_60s, color: "#FBBF24" },
    { name: "1-2min", value: data2.longWait_1_2min, color: "#10B981" },
    { name: "2min+", value: data2.veryLongWait_2min_plus, color: "#3B82F6" },
  ];

  const queueStats2 = [
    {
      name: "Avg Wait Time",
      value: `${Math.floor(data2.avgWaitTimeBeforeTimeout / 60)}:${(
        data2.avgWaitTimeBeforeTimeout % 60
      )
        .toString()
        .padStart(2, "0")}`,
    },
    {
      name: "Min Wait Time",
      value: `${Math.floor(data2.minWaitTimeBeforeTimeout / 60)}:${(
        data2.minWaitTimeBeforeTimeout % 60
      )
        .toString()
        .padStart(2, "0")}`,
    },
    {
      name: "Max Wait Time",
      value: `${Math.floor(data2.maxWaitTimeBeforeTimeout / 60)}:${(
        data2.maxWaitTimeBeforeTimeout % 60
      )
        .toString()
        .padStart(2, "0")}`,
    },
    {
      name: "Avg Queue Position",
      value: data2.avgInitialQueuePosition.toFixed(1),
    },
    { name: "Peak Timeout Hour", value: `${data2.peakTimeoutHour}:00` },
  ];

  return (
    <div className="flex flex-col gap-4">
      <ChartCard
        title="Queue Unanswered Calls Analysis"
        icon={<Alarm />}
        color="primary"
        legends={[
          { label: "0-10s", color: "#EF4444" },
          { label: "11-30s", color: "#F59E42" },
          { label: "31-60s", color: "#FBBF24" },
          { label: "1-2min", color: "#10B981" },
          { label: "2min+", color: "#3B82F6" },
        ]}
        variant="compound"
      >
        <ResponsiveContainer width="100%" height={288}>
          <PieChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <Pie
              data={waitTimeDistribution}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {waitTimeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard
        title="Queue Exit Timeout Analysis"
        icon={<ExitToApp />}
        color="primary"
        legends={[
          { label: "0-10s", color: "#EF4444" },
          { label: "11-30s", color: "#F59E42" },
          { label: "31-60s", color: "#FBBF24" },
          { label: "1-2min", color: "#10B981" },
          { label: "2min+", color: "#3B82F6" },
        ]}
        variant="compound"
      >
        <ResponsiveContainer width="100%" height={288}>
          <PieChart>
            <Pie
              data={waitTimeDistribution2}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {waitTimeDistribution2.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default InboundAnalyticsQueueAnalysis;
