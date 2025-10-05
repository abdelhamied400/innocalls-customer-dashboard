import useLayoutManager from "@/hooks/use-layout-manager";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Avatar from "./Avatar";

type AgentSlaComplianceCardProps = {
  agent: {
    answeredCalls: number;
    avgResponseTime: string;
    callsAnsweredWithinSLA: number;
    ext: string;
    name: string;
    slaCompliance: number;
    totalCalls: number;
  };
};
const AgentSlaComplianceCard = ({ agent }: AgentSlaComplianceCardProps) => {
  const { layoutVariant, screenWidth } = useLayoutManager();

  const getCellColor = (slaCompliance: number) => {
    if (slaCompliance >= 90) return "#02D995"; // Green
    if (slaCompliance >= 75) return "#F6A731"; // Yellow
    return "#F4592F"; // Red
  };

  const getSlaStatus = (slaCompliance: number) => {
    if (slaCompliance >= 90) return "GOOD";
    if (slaCompliance >= 75) return "AVERAGE";
    return "POOR";
  };

  const circleWidth = 30;

  const innerRadius = useMemo(() => {
    if (screenWidth <= 480) return 25;
    if (screenWidth <= 640) return 65;
    if (screenWidth <= 1024) return 85;
    return 65;
  }, [screenWidth]);

  const outerRadius = useMemo(() => {
    return innerRadius + circleWidth;
  }, [screenWidth, innerRadius]);

  return (
    <div className="card border rounded-lg">
      <div
        className={cn(
          "head flex flex-col sm:flex-row items-center gap-2 p-3",
          layoutVariant !== "both-closed" && "flex-col sm:flex-col xl:flex-row"
        )}
      >
        <div className={cn("profile flex items-center gap-2 flex-1")}>
          <Avatar name={agent.name} />
          <div className="info flex flex-col">
            <span className="name font-medium text-gray-900">{agent.name}</span>
            <span className="ext text-sm text-gray-500">{agent.ext}</span>
          </div>
        </div>
      </div>
      <div className="global-stats flex flex-col gap-2 p-2 border rounded-lg m-2">
        <div className="stat flex items-center flex-wrap gap-1 text-gray-600 text-sm">
          <div className="bg-gray-200 w-4 h-4 rounded" />
          <p className="">Incoming calls</p>
          <p className="font-bold">{agent.totalCalls}</p>
          <p className="">calls</p>
        </div>
        <div className="progress">
          <div className="h-[3px] bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-[3px]"
              style={{
                width: `${agent.slaCompliance}%`,
                transition: "width 1s ease-in-out",
                backgroundColor: "#02D995",
              }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 text-sm">
          <div className="stat flex items-center flex-wrap gap-1 text-gray-600">
            <div className="bg-[#02D995] w-4 h-4 rounded" />
            <p className="">Connected calls</p>
            <p className="font-bold">{agent.answeredCalls}</p>
            <p className="">calls</p>
          </div>
          <div className="stat flex items-center flex-wrap gap-1 text-gray-600">
            <p className="font-bold">{agent.avgResponseTime}</p>
            <p>Avg Answer time</p>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col items-center gap-4 p-2 border rounded-lg m-2",
          layoutVariant !== "both-closed" && "flex-col xl:flex-col 4xl:flex-row"
        )}
      >
        {/* pie chart for agent.slaCompliance */}
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Within SLA",
                    value: Number(agent.slaCompliance),
                  },
                  {
                    name: "Outside SLA",
                    value: 100 - Number(agent.slaCompliance),
                  },
                ]}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell
                  key="within-sla"
                  fill={getCellColor(agent.slaCompliance)}
                />
                <Cell key="outside-sla" fill="#EFEFEF" />
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            dy="-1.5em"
                            className="fill-gray-600 hidden lg:block text-sm font-medium"
                          >
                            SLA Compliance
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            dy="1.5em"
                            className="fill-gray-900 text-sm lg:text-xl font-bold"
                          >
                            {agent.slaCompliance}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            dy="1.5em"
                            className="text-sm lg:text-xl font-bold"
                            style={{ fill: getCellColor(agent.slaCompliance) }}
                          >
                            {getSlaStatus(agent.slaCompliance)}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="details">
          <p className="font-bold text-lg">{agent.answeredCalls}</p>
          <p className="text-gray-600 text-sm">Calls answered within SLA</p>
        </div>
      </div>
    </div>
  );
};

export default AgentSlaComplianceCard;
