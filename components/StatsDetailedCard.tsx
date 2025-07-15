import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";
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

type StatsDetailedCardProps = PropsWithChildren<
  StatsCardVariants & {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    value: string | number;
    valueSubtitle?: string;
    renderValue?: React.ReactNode;
    className?: string;
    isRefetching?: boolean;
    canRefetch?: boolean;
    refetchInterval?: number | false;
    setRefetchInterval?: (interval: number | false) => void;
    refetch?: (
      options?: RefetchOptions
    ) => Promise<QueryObserverResult<any, Error>>;
  }
>;

const StatsDetailedCard = ({
  icon,
  title,
  subtitle,
  value,
  valueSubtitle,
  className = "",
  isRefetching = false,
  children,
  canRefetch = false,
  refetchInterval,
  setRefetchInterval,
  refetch,
  variant = "default",
  color = "default",
  renderValue,
}: StatsDetailedCardProps) => {
  const t = useTranslations("components.statsCard");

  return (
    <div
      className={cn(
        statsCardVariants({ variant, color }),
        className,
        isRefetching && "animate-pulse"
      )}
    >
      <div className="flex justify-between items-center gap-1 mb-2">
        <div className="flex justify-between items-center gap-2 flex-1">
          <div className="flex items-center gap-2">
            <div className={cn(statsCardIconVariants({ color }))}>
              {isRefetching ? <Spinner className="size-6" /> : icon}
            </div>
            <div className="head-title">
              <h3 className="text-lg">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          <div className="head-value text-end">
            {renderValue || (
              <>
                <p className={cn(statsCardValueVariants({ color }))}>{value}</p>
                {valueSubtitle && (
                  <p className={cn(statsCardInfoVariants({ color }))}>
                    {valueSubtitle}
                  </p>
                )}
              </>
            )}
          </div>
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
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

type StatsDetailedCardErrorProps = {
  error: unknown;
  children?: React.ReactNode;
};

export const StatsDetailedCardError = ({
  error,
  children,
}: StatsDetailedCardErrorProps) => {
  const t = useTranslations("components.statsCard");

  if (error instanceof AxiosError) {
    const errorMessage = error?.response?.data?.message || error.message;
    return (
      <StatsDetailedCard
        icon={<XIcon className="text-red-500" />}
        title={t("errorOccurred")}
        value=""
        color="destructive"
      >
        {children || errorMessage}
      </StatsDetailedCard>
    );
  }
  return (
    <StatsDetailedCard
      icon={<XIcon className="text-red-500" />}
      title={t("errorOccurred")}
      value=""
      color="destructive"
    >
      {children || t("unknownError")}
    </StatsDetailedCard>
  );
};

export const StatsDetailedCardSkeleton = () => {
  return (
    <div className="p-4 bg-white shadow-sm rounded-lg flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
};

export default StatsDetailedCard;
