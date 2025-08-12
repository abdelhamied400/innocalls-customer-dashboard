import { cn } from "@/lib/utils";
import React from "react";
import { XIcon } from "lucide-react";
import { AxiosError } from "axios";
import { Skeleton } from "./ui/skeleton";
import Spinner from "./ui/spinner";
import { Button } from "./ui/button";
import { MoreVert, Refresh } from "@mui/icons-material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { refetchIntervals } from "@/constants/stats";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  statsCardIconVariants,
  statsCardInfoVariants,
  statsCardValueVariants,
  StatsCardVariants,
  statsCardVariants,
} from "./statsCardVariants";

type StatsCardProps = StatsCardVariants & {
  icon: React.ReactNode;
  title: string;
  value?: string | number;
  className?: string;
  isRefetching?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  info?: React.ReactNode;
  canRefetch?: boolean;
  renderValue?: React.ReactNode;
  refetchInterval?: number | false;
  setRefetchInterval?: (interval: number | false) => void;
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<any, Error>>;
};

const StatsCard = ({
  icon,
  title,
  value,
  className = "",
  isRefetching = false,
  isLoading = false,
  isError = false,
  error,
  info,
  canRefetch = false,
  refetchInterval,
  setRefetchInterval,
  refetch,
  variant = "default",
  color = "default",
  renderValue,
}: StatsCardProps) => {
  const t = useTranslations("components.statsCard");

  if (isLoading) {
    return <StatsCardSkeleton />;
  }

  if (isError) {
    return <StatsCardError error={error} />;
  }

  return (
    <div
      className={cn(
        statsCardVariants({ variant, color }),
        className,
        isRefetching && "animate-pulse"
      )}
    >
      <div className="flex justify-between items-center gap-1">
        <div className="flex items-center gap-2">
          <div className={cn(statsCardIconVariants({ color }))}>
            {isRefetching ? <Spinner className="size-6" /> : icon}
          </div>
          <h3 className="text-lg text-gray-500">{title}</h3>
        </div>
        {canRefetch && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="unstyled" size="icon">
                <MoreVert />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{t("refreshIntervals")}</DropdownMenuLabel>
              {refetchIntervals.map((interval) => (
                <DropdownMenuItem
                  key={interval.label}
                  onClick={() => {
                    setRefetchInterval?.(interval.value ?? 0);
                  }}
                >
                  {interval.translationKey
                    ? t(interval.translationKey)
                    : interval.label}

                  {refetchInterval === interval.value && (
                    <span className="ml-auto text-blue-500">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
              {!!refetch && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => refetch()}>
                    <Refresh />
                    {t("refreshNow")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className={cn(statsCardValueVariants({ color }))}>
          {renderValue || value}
        </p>
        <div className={cn(statsCardInfoVariants({ color }))}>{info}</div>
      </div>
    </div>
  );
};

type StatsCardErrorProps = {
  error: unknown;
};
export const StatsCardError = ({ error }: StatsCardErrorProps) => {
  const t = useTranslations("components.statsCard");

  if (error instanceof AxiosError) {
    const errorMessage = error?.response?.data?.message || error.message;
    return (
      <StatsCard
        icon={<XIcon className="text-red-500 group-hover:text-white" />}
        title={t("errorOccurred")}
        value=""
        info={errorMessage}
        color="destructive"
      />
    );
  }
  return (
    <StatsCard
      icon={<XIcon className="text-red-500 group-hover:text-white" />}
      title={t("errorOccurred")}
      value=""
      info={t("unknownError")}
      color="destructive"
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
