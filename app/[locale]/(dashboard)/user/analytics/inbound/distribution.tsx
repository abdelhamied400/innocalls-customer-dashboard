import ChartCard from "@/components/ChartCard";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { TimerOutlined } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const InboundAnalyticsDistribution = () => {
  const waitTimeData = [
    {
      timeBucket: "0-5 sec",
      avgWaitTime: 2.5,
      totalCalls: 45,
    },
    {
      timeBucket: "6-10 sec",
      avgWaitTime: 8.2,
      totalCalls: 78,
    },
    {
      timeBucket: "11-15 sec",
      avgWaitTime: 13.1,
      totalCalls: 52,
    },
    {
      timeBucket: "16-20 sec",
      avgWaitTime: 18.3,
      totalCalls: 28,
    },
    {
      timeBucket: "21-30 sec",
      avgWaitTime: 25.7,
      totalCalls: 15,
    },
    {
      timeBucket: "30+ sec",
      avgWaitTime: 45.2,
      totalCalls: 8,
    },
  ];
  const talkTimeData = [
    { timeBucket: "0-30 sec", totalCalls: 32 },
    { timeBucket: "31-60 sec", totalCalls: 67 },
    { timeBucket: "1-2 min", totalCalls: 89 },
    { timeBucket: "2-3 min", totalCalls: 45 },
    { timeBucket: "3-5 min", totalCalls: 23 },
    { timeBucket: "5+ min", totalCalls: 12 },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartCard
        icon={<TimerOutlined />}
        title="Wait Time Distribution"
        color="primary"
        legends={[{ label: "Total Calls", color: "#3B82F6" }]}
        className="shadow-none hover:shadow-none border bg-gradient-to-b from-primary-100/0 to-primary-100/50 hover:from-primary-100/20 hover:to-primary-100/70"
      >
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waitTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="timeBucket"
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
              <Tooltip />
              <Bar dataKey="totalCalls" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        icon={<TimerOutlined />}
        title="Talk Time Distribution"
        color="success"
        legends={[{ label: "Total Calls", color: "#10B981" }]}
        className="shadow-none hover:shadow-none border bg-gradient-to-b from-success-100/0 to-success-100/50 hover:from-success-100/20 hover:to-success-100/70"
      >
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={talkTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="timeBucket"
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
              <Tooltip />
              <Bar dataKey="totalCalls" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default InboundAnalyticsDistribution;
