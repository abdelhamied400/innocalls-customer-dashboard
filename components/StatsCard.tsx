import { cn } from "@/lib/utils";
import React from "react";

type StatsCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  className?: string;
  info?: React.ReactNode;
};
const StatsCard = ({
  icon,
  title,
  value,
  className = "",
  info,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "p-4 bg-white shadow-sm rounded-lg",
        "hover:shadow-lg transition-shadow duration-300",
        "border border-gray-200",
        "text-gray-800",
        "flex flex-col gap-2",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg text-gray-500">{title}</h3>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold text-2xl text-gray-800">{value}</p>
        {info}
      </div>
    </div>
  );
};

export default StatsCard;
