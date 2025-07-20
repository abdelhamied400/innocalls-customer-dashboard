import { cn } from "@/lib/utils";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { cva, VariantProps } from "class-variance-authority";
import Spinner from "./ui/spinner";
import { MoreVert, Refresh } from "@mui/icons-material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { refetchIntervals } from "@/constants/stats";
import { useTranslations } from "next-intl";
import React, { PropsWithChildren } from "react";
import { AxiosError } from "axios";
import { XIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export const chartCardVariants = cva(
  "group/chart-card p-4 shadow rounded-lg transition-all flex flex-col gap-2 hover:shadow-lg text-gray-800",
  {
    variants: {
      variant: {
        default: "bg-white border-t-4 border-transparent",
      },
      color: {
        default: "",
        primary: "",
        warning: "",
        destructive: "",
        success: "",
        info: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        color: "default",
        className: "border-gray-100 hover:border-gray-500",
      },
      {
        variant: "default",
        color: "primary",
        className: "border-primary-100 hover:border-primary-500",
      },
      {
        variant: "default",
        color: "warning",
        className: "border-amber-100 hover:border-amber-500",
      },
      {
        variant: "default",
        color: "destructive",
        className: "border-destructive-100 hover:border-destructive-500",
      },
      {
        variant: "default",
        color: "success",
        className: "border-success-100 hover:border-success-500",
      },
      {
        variant: "default",
        color: "info",
        className: "border-indigo-100 hover:border-indigo-500",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  }
);
const chartCardIconVariants = cva("transition-colors rounded-full p-1", {
  variants: {
    color: {
      default:
        "bg-gray-100 text-gray-500 group-hover/chart-card:bg-gray-500 group-hover/chart-card:text-white",
      primary:
        "bg-primary-100 text-primary-500 group-hover/chart-card:bg-primary-500 group-hover/chart-card:text-white",
      warning:
        "bg-amber-100 text-amber-500 group-hover/chart-card:bg-amber-500 group-hover/chart-card:text-white",
      destructive:
        "bg-destructive-100 text-destructive-500 group-hover/chart-card:bg-destructive-500 group-hover/chart-card:text-white",
      success:
        "bg-success-100 text-success-500 group-hover/chart-card:bg-success-500 group-hover/chart-card:text-white",
      info: "bg-indigo-100 text-indigo-500 group-hover/chart-card:bg-indigo-500 group-hover/chart-card:text-white",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

type ChartCardVariants = VariantProps<typeof chartCardVariants>;

type Legend = { label: React.ReactNode; color: string | undefined };
type ChartCardProps = PropsWithChildren<
  ChartCardVariants & {
    icon: React.ReactNode;
    title: string;
    className?: string;
    isRefetching?: boolean;
    canRefetch?: boolean;
    refetchInterval?: number | false;
    legends?: Legend[];
    setRefetchInterval?: (interval: number | false) => void;
    refetch?: (
      options?: RefetchOptions
    ) => Promise<QueryObserverResult<any, Error>>;
  }
>;

const ChartCard = ({
  icon,
  title,
  className = "",
  isRefetching = false,
  children,
  canRefetch = false,
  refetchInterval,
  setRefetchInterval,
  refetch,
  variant = "default",
  color = "default",
  legends,
}: ChartCardProps) => {
  const t = useTranslations("components.statsCard");

  return (
    <div
      className={cn(
        chartCardVariants({ variant, color }),
        className,
        isRefetching && "animate-pulse"
      )}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex justify-between items-center gap-1">
          <div className="flex justify-between flex-wrap items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={cn(chartCardIconVariants({ color }))}>
                {isRefetching ? <Spinner className="size-6" /> : icon}
              </div>
              <div className="title-head">
                <h3 className="text-lg text-gray-500">{title}</h3>
                <div className="legends flex items-center gap-2 flex-wrap">
                  {legends &&
                    legends.map((legend, idx) => (
                      <span
                        key={`legend-${idx}`}
                        className="text-sm flex items-center gap-1"
                        style={{ color: legend.color }}
                      >
                        <span
                          className={`rounded-full w-2 h-2 block`}
                          style={{ backgroundColor: legend.color }}
                        ></span>
                        {legend.label}
                      </span>
                    ))}
                </div>
              </div>
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
        <div className="flex flex-col gap-2 h-[calc(100%-50px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

type ChartCardErrorProps = {
  error: unknown;
};
export const ChartCardError = ({ error }: ChartCardErrorProps) => {
  const t = useTranslations("components.statsCard");

  if (error instanceof AxiosError) {
    const errorMessage = error?.response?.data?.message || error.message;
    return (
      <ChartCard
        icon={<XIcon className="text-red-500 group-hover:text-white" />}
        title={t("errorOccurred")}
        color="destructive"
      >
        <p className="text-red-500">{errorMessage}</p>
      </ChartCard>
    );
  }
  return (
    <ChartCard
      icon={<XIcon className="text-red-500 group-hover:text-white" />}
      title={t("errorOccurred")}
      color="destructive"
    >
      <p className="text-red-500">{t("unknownError")}</p>
    </ChartCard>
  );
};

export const ChartCardSkeleton = () => {
  return (
    <div className="p-4 shadow rounded-lg bg-white animate-pulse">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="mt-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
};

export default ChartCard;
