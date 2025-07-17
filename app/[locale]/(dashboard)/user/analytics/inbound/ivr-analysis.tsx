import ChartCard from "@/components/ChartCard";
import { Call } from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const InboundAnalyticsIVRAnalysis = () => {
  const data = [
    {
      ivrName: "Main Menu",
      options: [
        {
          optionNumber: 1,
          clickCount: 45,
          optionName: "Sales",
        },
        {
          optionNumber: 2,
          clickCount: 38,
          optionName: "Support",
        },
        {
          optionNumber: 3,
          clickCount: 22,
          optionName: "Billing",
        },
        {
          optionNumber: 4,
          clickCount: 15,
          optionName: "General",
        },
      ],
    },
    {
      ivrName: "Support Menu",
      options: [
        {
          optionNumber: 1,
          clickCount: 28,
          optionName: "Technical",
        },
        {
          optionNumber: 2,
          clickCount: 32,
          optionName: "Account",
        },
        {
          optionNumber: 3,
          clickCount: 18,
          optionName: "Product",
        },
        {
          optionNumber: 4,
          clickCount: 12,
          optionName: "Other",
        },
      ],
    },
    {
      ivrName: "Sales Menu",
      options: [
        {
          optionNumber: 1,
          clickCount: 35,
          optionName: "New Sales",
        },
        {
          optionNumber: 2,
          clickCount: 25,
          optionName: "Upgrades",
        },
        {
          optionNumber: 3,
          clickCount: 20,
          optionName: "Pricing",
        },
        {
          optionNumber: 4,
          clickCount: 15,
          optionName: "Demo",
        },
      ],
    },
  ];

  const chartData = data.map((ivr) => {
    const optionData: any = { ivrName: ivr.ivrName };
    ivr.options.forEach((option) => {
      optionData[`option${option.optionNumber}`] = option.clickCount;
    });
    return optionData;
  });

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E42",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
  ];

  return (
    <div className="flex flex-col gap-4">
      <ChartCard
        title="IVR Analysis"
        icon={<Call />}
        color="primary"
        legends={data[0]?.options.map((option) => ({
          label: `Option ${option.optionNumber}${
            option.optionName ? ` - ${option.optionName}` : ""
          }`,
          color: colors[option.optionNumber - 1],
        }))}
        className="shadow-none hover:shadow-none border bg-gradient-to-b from-primary-100/0 to-primary-100/50 hover:from-primary-100/20 hover:to-primary-100/70"
      >
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="ivrName"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "IVR Name",
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
              <Legend />
              {data[0]?.options.map((option, index) => (
                <Bar
                  key={option.optionNumber}
                  dataKey={`option${option.optionNumber}`}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                  name={`Option ${option.optionNumber}${
                    option.optionName ? ` - ${option.optionName}` : ""
                  }`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default InboundAnalyticsIVRAnalysis;
