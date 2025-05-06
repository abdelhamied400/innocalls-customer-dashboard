import { cn } from "@/lib/utils";
import React from "react";
import { XIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Skeleton } from "./ui/skeleton";

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

type StatsCardErrorProps = {
  error: unknown;
};
export const StatsCardError = ({ error }: StatsCardErrorProps) => {
  if (error instanceof AxiosError) {
    return (
      <StatsCard
        icon={<XIcon className="text-red-500" />}
        title="Error Occurred"
        value={error.message}
        className="bg-red-100 shadow-none"
      />
    );
  }
  return (
    <StatsCard
      icon={<XIcon className="text-red-500" />}
      title="Error Occurred"
      value="An unknown error occurred"
      className="bg-red-100 shadow-none"
    />
  );
};

export const StatsCardSkeleton = () => {
  return (
    <div className="p-4 bg-white shadow-sm rounded-lg flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};

export default StatsCard;
