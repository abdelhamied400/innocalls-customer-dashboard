import ChartCard from "@/components/ChartCard";
import { LineAxis } from "@mui/icons-material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const InboundAnalyticsOverview = () => {
  const data = [
    {
      hourOfDay: 6,
      totalCalls: 8,
      completedCalls: 6,
      abandonedCalls: 1,
      timeoutCalls: 1,
      avgWaitTime: "00:00:08",
      avgTalkTime: "00:01:15",
    },
    {
      hourOfDay: 7,
      totalCalls: 15,
      completedCalls: 12,
      abandonedCalls: 2,
      timeoutCalls: 1,
      avgWaitTime: "00:00:12",
      avgTalkTime: "00:01:22",
    },
    {
      hourOfDay: 8,
      totalCalls: 28,
      completedCalls: 24,
      abandonedCalls: 3,
      timeoutCalls: 1,
      avgWaitTime: "00:00:10",
      avgTalkTime: "00:01:18",
    },
    {
      hourOfDay: 9,
      totalCalls: 42,
      completedCalls: 37,
      abandonedCalls: 4,
      timeoutCalls: 1,
      avgWaitTime: "00:00:09",
      avgTalkTime: "00:01:25",
    },
    {
      hourOfDay: 10,
      totalCalls: 58,
      completedCalls: 51,
      abandonedCalls: 5,
      timeoutCalls: 2,
      avgWaitTime: "00:00:11",
      avgTalkTime: "00:01:30",
    },
    {
      hourOfDay: 11,
      totalCalls: 65,
      completedCalls: 58,
      abandonedCalls: 5,
      timeoutCalls: 2,
      avgWaitTime: "00:00:08",
      avgTalkTime: "00:01:28",
    },
    {
      hourOfDay: 12,
      totalCalls: 52,
      completedCalls: 46,
      abandonedCalls: 4,
      timeoutCalls: 2,
      avgWaitTime: "00:00:13",
      avgTalkTime: "00:01:20",
    },
    {
      hourOfDay: 13,
      totalCalls: 48,
      completedCalls: 43,
      abandonedCalls: 3,
      timeoutCalls: 2,
      avgWaitTime: "00:00:10",
      avgTalkTime: "00:01:15",
    },
    {
      hourOfDay: 14,
      totalCalls: 55,
      completedCalls: 49,
      abandonedCalls: 4,
      timeoutCalls: 2,
      avgWaitTime: "00:00:09",
      avgTalkTime: "00:01:22",
    },
    {
      hourOfDay: 15,
      totalCalls: 62,
      completedCalls: 56,
      abandonedCalls: 4,
      timeoutCalls: 2,
      avgWaitTime: "00:00:11",
      avgTalkTime: "00:01:26",
    },
    {
      hourOfDay: 16,
      totalCalls: 58,
      completedCalls: 52,
      abandonedCalls: 4,
      timeoutCalls: 2,
      avgWaitTime: "00:00:12",
      avgTalkTime: "00:01:24",
    },
    {
      hourOfDay: 17,
      totalCalls: 45,
      completedCalls: 40,
      abandonedCalls: 3,
      timeoutCalls: 2,
      avgWaitTime: "00:00:10",
      avgTalkTime: "00:01:18",
    },
    {
      hourOfDay: 18,
      totalCalls: 32,
      completedCalls: 28,
      abandonedCalls: 2,
      timeoutCalls: 2,
      avgWaitTime: "00:00:14",
      avgTalkTime: "00:01:12",
    },
    {
      hourOfDay: 19,
      totalCalls: 18,
      completedCalls: 15,
      abandonedCalls: 2,
      timeoutCalls: 1,
      avgWaitTime: "00:00:16",
      avgTalkTime: "00:01:08",
    },
    {
      hourOfDay: 20,
      totalCalls: 12,
      completedCalls: 10,
      abandonedCalls: 1,
      timeoutCalls: 1,
      avgWaitTime: "00:00:18",
      avgTalkTime: "00:01:05",
    },
  ];
  return (
    <ChartCard
      icon={<LineAxis />}
      title="Inbound Call Overview"
      color="primary"
      legends={[
        { label: "Total Calls", color: "#3B82F6" },
        { label: "Completed Calls", color: "#10B981" },
        { label: "Abandoned Calls", color: "#F59E42" },
        { label: "Timeout Calls", color: "#EF4444" },
      ]}
      className="shadow-none hover:shadow-none border bg-gradient-to-b from-primary-100/0 to-primary-100/50 hover:from-primary-100/20 hover:to-primary-100/70"
    >
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="hourOfDay"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{
                value: "Hour",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="totalCalls"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="completedCalls"
              stroke="#10B981"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="abandonedCalls"
              stroke="#F59E42"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="timeoutCalls"
              stroke="#EF4444"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default InboundAnalyticsOverview;
