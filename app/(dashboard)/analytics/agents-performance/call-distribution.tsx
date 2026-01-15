import analyticsService from "@/services/analytics.service";
import { Search } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { Label } from "@/components/ui/label";
import { UserActivityFilters } from "./page";
import { useTranslations } from "@/providers/TranslationProvider";
import { useState, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import AgentCallDistributionCard, {
  AgentCallDistributionCardSkeleton,
} from "@/components/AgentCallDistributionCard";
import useLayoutManager from "@/hooks/use-layout-manager";
import usePagination from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationButton,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import NoData from "./NoData";

type CallDistributionAnalyticsProps = {
  filters: UserActivityFilters;
};

export type CallDistributionFilters = {
  search: string;
  sortBy: string;
};

const CallDistributionAnalytics = ({
  filters,
}: CallDistributionAnalyticsProps) => {
  const { layoutVariant } = useLayoutManager();
  const t = useTranslations("analytics.userActivity.callDistribution");
  const tCommon = useTranslations("common");
  const [includeInternalCalls, setIncludeInternalCalls] = useState(false);
  const [callDistributionFilters, setCallDistributionFilters] =
    useState<CallDistributionFilters>({
      search: "",
      sortBy: "totalCallsHighest",
    });

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["callDistribution", filters, { includeInternalCalls }],
    queryFn: () =>
      analyticsService.fetchCallDistributionAnalytics({
        ...filters,
        includeInternalCalls,
      }),
  });

  // Filter and sort data locally
  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    // First filter by search term
    let filtered = data.filter((agent) => {
      if (!callDistributionFilters.search) return true;
      const searchTerm = callDistributionFilters.search.toLowerCase();
      const agentSearchText = `${agent.name} ${agent.ext}`.toLowerCase();
      return agentSearchText.includes(searchTerm);
    });

    // Then sort by selected criteria
    filtered.sort((a, b) => {
      switch (callDistributionFilters.sortBy) {
        case "totalCallsHighest":
          return b.totalCalls - a.totalCalls;
        case "totalCallsLowest":
          return a.totalCalls - b.totalCalls;
        case "answerRateHighest":
          return b.answerRate - a.answerRate;
        case "answerRateLowest":
          return a.answerRate - b.answerRate;
        case "connectedCallsHighest":
          return b.totalConnected - a.totalConnected;
        case "connectedCallsLowest":
          return a.totalConnected - b.totalConnected;
        case "connectedOutgoingExternalHighest":
          return (
            b.totalAnsweredOutgoingExternalCalls -
            a.totalAnsweredOutgoingExternalCalls
          );
        case "connectedOutgoingExternalLowest":
          return (
            a.totalAnsweredOutgoingExternalCalls -
            b.totalAnsweredOutgoingExternalCalls
          );
        case "connectedIncomingExternalHighest":
          return (
            b.totalAnsweredIncomingExternalCalls -
            a.totalAnsweredIncomingExternalCalls
          );
        case "connectedIncomingExternalLowest":
          return (
            a.totalAnsweredIncomingExternalCalls -
            b.totalAnsweredIncomingExternalCalls
          );
        case "connectedOutgoingInternalHighest":
          return (
            b.totalAnsweredOutgoingInternalCalls -
            a.totalAnsweredOutgoingInternalCalls
          );
        case "connectedOutgoingInternalLowest":
          return (
            a.totalAnsweredOutgoingInternalCalls -
            b.totalAnsweredOutgoingInternalCalls
          );
        case "connectedIncomingInternalHighest":
          return (
            b.totalAnsweredIncomingInternalCalls -
            a.totalAnsweredIncomingInternalCalls
          );
        case "connectedIncomingInternalLowest":
          return (
            a.totalAnsweredIncomingInternalCalls -
            b.totalAnsweredIncomingInternalCalls
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, callDistributionFilters]);

  // Use pagination hook
  const { pageIndex, pageSize, setPagination, pages } = usePagination({
    totalItems: filteredAndSortedData.length,
    perPage: 10,
    defaultPageIndex: 0,
  });

  // Calculate current page data
  const startIndex = pageIndex * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredAndSortedData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setPagination({ pageIndex: 0, pageSize });
  }, [callDistributionFilters, setPagination, pageSize]);

  return (
    <div className="call-distribution-analytics">
      <div className="flex justify-between items-center gap-2 flex-wrap border-b p-3">
        <div className="flex items-center gap-2">
          <Switch
            id="includeInternalCalls"
            checked={includeInternalCalls}
            onCheckedChange={setIncludeInternalCalls}
          />
          <Label htmlFor="includeInternalCalls">
            {t("actions.includeInternalCalls")}
          </Label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Single Sort Select */}
          <Select
            value={callDistributionFilters.sortBy}
            onValueChange={(value) =>
              setCallDistributionFilters((prev) => ({
                ...prev,
                sortBy: value,
              }))
            }
          >
            <SelectTrigger className="w-auto flex items-center gap-0.5">
              <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
              <span className="capitalize">
                {callDistributionFilters.sortBy === "totalCallsHighest" &&
                  t("actions.sorts.totalCallsHighest")}
                {callDistributionFilters.sortBy === "totalCallsLowest" &&
                  t("actions.sorts.totalCallsLowest")}
                {callDistributionFilters.sortBy === "answerRateHighest" &&
                  t("actions.sorts.answerRateHighest")}
                {callDistributionFilters.sortBy === "answerRateLowest" &&
                  t("actions.sorts.answerRateLowest")}
                {callDistributionFilters.sortBy === "connectedCallsHighest" &&
                  t("actions.sorts.connectedCallsHighest")}
                {callDistributionFilters.sortBy === "connectedCallsLowest" &&
                  t("actions.sorts.connectedCallsLowest")}
                {callDistributionFilters.sortBy ===
                  "connectedOutgoingExternalHighest" &&
                  t("actions.sorts.connectedOutgoingExternalHighest")}
                {callDistributionFilters.sortBy ===
                  "connectedOutgoingExternalLowest" &&
                  t("actions.sorts.connectedOutgoingExternalLowest")}
                {callDistributionFilters.sortBy ===
                  "connectedIncomingExternalHighest" &&
                  t("actions.sorts.connectedIncomingExternalHighest")}
                {callDistributionFilters.sortBy ===
                  "connectedIncomingExternalLowest" &&
                  t("actions.sorts.connectedIncomingExternalLowest")}
                {callDistributionFilters.sortBy ===
                  "connectedOutgoingInternalHighest" &&
                  t("actions.sorts.connectedOutgoingInternalHighest")}
                {callDistributionFilters.sortBy ===
                  "connectedOutgoingInternalLowest" &&
                  t("actions.sorts.connectedOutgoingInternalLowest")}
                {callDistributionFilters.sortBy ===
                  "connectedIncomingInternalHighest" &&
                  t("actions.sorts.connectedIncomingInternalHighest")}
                {callDistributionFilters.sortBy ===
                  "connectedIncomingInternalLowest" &&
                  t("actions.sorts.connectedIncomingInternalLowest")}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="totalCallsHighest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.totalCallsHighest")}
              </SelectItem>
              <SelectItem value="totalCallsLowest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.totalCallsLowest")}
              </SelectItem>
              <SelectItem value="answerRateHighest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.answerRateHighest")}
              </SelectItem>
              <SelectItem value="answerRateLowest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.answerRateLowest")}
              </SelectItem>
              <SelectItem value="connectedCallsHighest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.connectedCallsHighest")}
              </SelectItem>
              <SelectItem value="connectedCallsLowest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.connectedCallsLowest")}
              </SelectItem>
              <SelectItem value="connectedOutgoingExternalHighest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.connectedOutgoingExternalHighest")}
              </SelectItem>
              <SelectItem value="connectedOutgoingExternalLowest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.connectedOutgoingExternalLowest")}
              </SelectItem>
              <SelectItem value="connectedIncomingExternalHighest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.connectedIncomingExternalHighest")}
              </SelectItem>
              <SelectItem value="connectedIncomingExternalLowest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.connectedIncomingExternalLowest")}
              </SelectItem>
              {includeInternalCalls && (
                <>
                  <SelectItem value="connectedOutgoingInternalHighest">
                    <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                    {t("actions.sorts.connectedOutgoingInternalHighest")}
                  </SelectItem>
                  <SelectItem value="connectedOutgoingInternalLowest">
                    <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                    {t("actions.sorts.connectedOutgoingInternalLowest")}
                  </SelectItem>
                  <SelectItem value="connectedIncomingInternalHighest">
                    <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                    {t("actions.sorts.connectedIncomingInternalHighest")}
                  </SelectItem>
                  <SelectItem value="connectedIncomingInternalLowest">
                    <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                    {t("actions.sorts.connectedIncomingInternalLowest")}
                  </SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          {/* search */}
          <Field preIcon={<Search />}>
            <Input
              placeholder={t("actions.search")}
              variant="field"
              value={callDistributionFilters.search}
              onChange={(e) =>
                setCallDistributionFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
            />
          </Field>
        </div>
      </div>

      {isLoading ? (
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-4 p-3",
            layoutVariant !== "both-closed" && "lg:grid-cols-1 xl:grid-cols-2"
          )}
        >
          {Array.from({ length: pageSize }).map((_, index) => (
            <AgentCallDistributionCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredAndSortedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <NoData />
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-4 p-3",
            layoutVariant !== "both-closed" && "lg:grid-cols-1 xl:grid-cols-2"
          )}
        >
          {currentPageData?.map((agent) => (
            <AgentCallDistributionCard
              key={agent.ext}
              agent={agent}
              includeInternalCalls={includeInternalCalls}
            />
          ))}
        </div>
      )}

      {/* Enhanced Pagination */}
      {filteredAndSortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {tCommon("pagination.rowsPerPage")}
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPagination({ pageIndex: 0, pageSize: Number(value) });
              }}
            >
              <SelectTrigger className="w-[70px] h-8">
                <span>{pageSize}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Range information */}
          <div className="text-sm text-gray-600">
            {filteredAndSortedData.length > 0 && (
              <span>
                {startIndex + 1} –{" "}
                {Math.min(endIndex, filteredAndSortedData.length)}{" "}
                {tCommon("pagination.of")} {filteredAndSortedData.length}
              </span>
            )}
          </div>

          {/* Pagination controls */}
          {pages.length > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setPagination({
                        pageIndex: Math.max(0, pageIndex - 1),
                        pageSize,
                      })
                    }
                    disabled={pageIndex === 0}
                  />
                </PaginationItem>

                {/* Page numbers using hook's pages array */}
                {pages.map((page, index) => {
                  if (page === -1) {
                    // Ellipsis
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationButton
                        isActive={pageIndex === page - 1}
                        onClick={() =>
                          setPagination({ pageIndex: page - 1, pageSize })
                        }
                      >
                        {page}
                      </PaginationButton>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      const totalPages = Math.ceil(
                        filteredAndSortedData.length / pageSize
                      );
                      setPagination({
                        pageIndex: Math.min(totalPages - 1, pageIndex + 1),
                        pageSize,
                      });
                    }}
                    disabled={
                      pageIndex ===
                      Math.ceil(filteredAndSortedData.length / pageSize) - 1
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};

export default CallDistributionAnalytics;
