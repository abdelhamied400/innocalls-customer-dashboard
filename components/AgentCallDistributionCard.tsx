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
import { Skeleton } from "./ui/skeleton";

type AgentCallDistributionCardProps = {
  agent: {
    answerRate: number;
    ext: string;
    name: string;
    totalAnsweredIncomingExternalCalls: number;
    totalAnsweredIncomingInternalCalls: number;
    totalAnsweredOutgoingExternalCalls: number;
    totalAnsweredOutgoingInternalCalls: number;
    totalCalls: number;
    totalConnected: number;
    totalIncomingExternalCalls: number;
    totalIncomingInternalCalls: number;
    totalOutgoingExternalCalls: number;
    totalOutgoingInternalCalls: number;
    unAnsweredIncomingExternal: number;
    unAnsweredIncomingInternal: number;
    unAnsweredOutgoingExternal: number;
    unAnsweredOutgoingInternal: number;
  };
};
const AgentCallDistributionCard = ({
  agent,
}: AgentCallDistributionCardProps) => {
  const { layoutVariant, screenWidth } = useLayoutManager();

  const data = [
    {
      name: "Outgoing external",
      values: {
        total: agent.totalOutgoingExternalCalls,
        unanswered: agent.unAnsweredOutgoingExternal,
        answered: agent.totalAnsweredOutgoingExternalCalls,
      },
      color: "#1A9671",
      value: agent.totalAnsweredOutgoingExternalCalls,
    },
    {
      name: "Incoming external",
      values: {
        total: agent.totalIncomingExternalCalls,
        unanswered: agent.unAnsweredIncomingExternal,
        answered: agent.totalAnsweredIncomingExternalCalls,
      },
      color: "#5BC9F7",
      value: agent.totalAnsweredIncomingExternalCalls,
    },
    {
      name: "Outgoing internal",
      values: {
        total: agent.totalOutgoingInternalCalls,
        unanswered: agent.unAnsweredOutgoingInternal,
        answered: agent.totalAnsweredOutgoingInternalCalls,
      },
      color: "#2021AD",
      value: agent.totalAnsweredOutgoingInternalCalls,
    },
    {
      name: "Incoming internal",
      values: {
        total: agent.totalIncomingInternalCalls,
        unanswered: agent.unAnsweredIncomingInternal,
        answered: agent.totalAnsweredIncomingInternalCalls,
      },
      color: "#F6A731",
      value: agent.totalAnsweredIncomingInternalCalls,
    },
    {
      name: "Unanswered",
      color: "#EFEFEF",
      value: agent.totalCalls - agent.totalConnected,
    },
  ];

  const circleWidth = 30;

  const innerRadius = useMemo(() => {
    if (screenWidth <= 480) return 25;
    if (screenWidth <= 640) return 65;
    if (screenWidth <= 1024) return 85;
    return 90;
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
        <div
          className={cn(
            "profile flex flex-wrap items-center gap-2 flex-1 border-e-0 sm:border-e",
            layoutVariant !== "both-closed" &&
              "border-e-0 sm:border-e-0 xl:border-e"
          )}
        >
          <Avatar name={agent.name} />

          <div className="info flex flex-col">
            <span className="name font-medium text-gray-900">{agent.name}</span>
            <span className="ext text-sm text-gray-500">{agent.ext}</span>
          </div>
        </div>
        <div className="global-stats flex flex-wrap items-center gap-2 px-2">
          <div className="stat flex flex-col gap-1 px-2 border-e">
            <p className="font-bold">{agent.totalCalls}</p>
            <p className="text-gray-600">Total Calls</p>
          </div>
          <div className="stat flex flex-col gap-1 px-2">
            <p className="font-bold text-success-300">{agent.totalConnected}</p>
            <p className="text-gray-600">Connected Calls</p>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "body flex flex-col xl:flex-row items-center justify-between 4xl:justify-evenly gap-2 border rounded-lg p-4 m-2",
          layoutVariant !== "both-closed" && "flex-col xl:flex-col 4xl:flex-row"
        )}
      >
        <div className="chart w-52 lg:w-80 h-52 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={320} height={320}>
              <Pie
                dataKey="value"
                data={data}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                fill="#82ca9d"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
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
                            dy="-0.5em"
                            className="fill-gray-600 hidden lg:block text-lg font-medium"
                          >
                            Answer Rate
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            dy={screenWidth <= 640 ? "0em" : "1.5em"}
                            className="fill-gray-900 text-sm lg:text-2xl font-bold"
                          >
                            {agent.answerRate}%
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="details ">
          <div className="flex flex-col gap-2">
            {data.map(
              (entry) =>
                entry.values && (
                  <div
                    key={entry.name}
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <div className="flex flex-wrap gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-700">{entry.name}</span>
                        <span className="text-gray-700">
                          {entry.values.unanswered} unconnected calls
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-bold">{entry.values.answered}</p>
                      <p>Out of {entry.values.total}</p>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AgentCallDistributionCardSkeleton = () => {
  const { layoutVariant } = useLayoutManager();

  return (
    <div className="card border rounded-lg">
      <div
        className={cn(
          "head flex flex-col sm:flex-row items-center gap-2 p-3",
          layoutVariant !== "both-closed" && "flex-col sm:flex-col xl:flex-row"
        )}
      >
        <div
          className={cn(
            "profile flex flex-wrap items-center gap-2 flex-1 border-e-0 sm:border-e",
            layoutVariant !== "both-closed" &&
              "border-e-0 sm:border-e-0 xl:border-e"
          )}
        >
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="info flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="global-stats flex flex-wrap items-center gap-2 px-2">
          <div className="stat flex flex-col gap-1 px-2 border-e">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="stat flex flex-col gap-1 px-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "body flex flex-col xl:flex-row items-center justify-between 4xl:justify-evenly gap-2 border rounded-lg p-4 m-2",
          layoutVariant !== "both-closed" && "flex-col xl:flex-col 4xl:flex-row"
        )}
      >
        <div className="chart w-52 lg:w-80 h-52 lg:h-80 flex items-center justify-center">
          <Skeleton className="w-40 h-40 lg:w-60 lg:h-60 rounded-full" />
        </div>
        <div className="details">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCallDistributionCard;
