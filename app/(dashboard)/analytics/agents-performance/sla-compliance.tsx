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
import AgentSlaComplianceCard, {
  AgentSlaComplianceCardSkeleton,
} from "@/components/AgentSlaComplianceCard";
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

type SlaComplianceAnalyticsProps = {
  filters: UserActivityFilters;
};

export type SlaComplianceFilters = {
  search: string;
  sortBy: string;
};

const SlaComplianceAnalytics = ({ filters }: SlaComplianceAnalyticsProps) => {
  const { layoutVariant } = useLayoutManager();
  const t = useTranslations("analytics.userActivity.slaCompliance");
  const tCommon = useTranslations("common");
  const [slaComplianceFilters, setSlaComplianceFilters] =
    useState<SlaComplianceFilters>({
      search: "",
      sortBy: "slaHighestToLowest",
    });

  const { data, isLoading } = useLocalizedQuery({
    queryKey: ["slaCompliance", filters],
    queryFn: () => analyticsService.fetchSlaComplianceAnalytics(filters),
  });

  // Filter and sort data locally
  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    // First filter by search term
    const filtered = data.filter((agent) => {
      if (!slaComplianceFilters.search) return true;
      const searchTerm = slaComplianceFilters.search.toLowerCase();
      const agentSearchText = `${agent.name} ${agent.ext}`.toLowerCase();
      return agentSearchText.includes(searchTerm);
    });

    // Then sort by selected criteria
    filtered.sort((a, b) => {
      switch (slaComplianceFilters.sortBy) {
        case "slaHighestToLowest":
          return b.slaCompliance - a.slaCompliance; // Descending (highest first)
        case "slaLowestToHighest":
          return a.slaCompliance - b.slaCompliance; // Ascending (lowest first)
        case "connectedCallsHighestToLowest":
          return b.answeredCalls - a.answeredCalls; // Descending (highest first)
        case "connectedCallsLowestToHighest":
          return a.answeredCalls - b.answeredCalls; // Ascending (lowest first)
        case "incomingCallsHighestToLowest":
          return b.totalCalls - a.totalCalls; // Descending (highest first)
        case "incomingCallsLowestToHighest":
          return a.totalCalls - b.totalCalls; // Ascending (lowest first)
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, slaComplianceFilters]);

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
  }, [slaComplianceFilters, setPagination, pageSize]);

  return (
    <div className="sla-compliance-analytics">
      <div className="flex justify-between items-center flex-wrap border-b p-3">
        <div className=""></div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Select SortBy */}
          <Select
            value={slaComplianceFilters.sortBy}
            onValueChange={(value) =>
              setSlaComplianceFilters((prev) => ({
                ...prev,
                sortBy: value,
              }))
            }
          >
            <SelectTrigger className="w-auto flex items-center gap-0.5">
              <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
              <span className="capitalize">
                {slaComplianceFilters.sortBy === "slaHighestToLowest" &&
                  t("actions.sorts.slaHighestToLowest")}
                {slaComplianceFilters.sortBy === "slaLowestToHighest" &&
                  t("actions.sorts.slaLowestToHighest")}
                {slaComplianceFilters.sortBy ===
                  "connectedCallsHighestToLowest" &&
                  t("actions.sorts.connectedCallsHighestToLowest")}
                {slaComplianceFilters.sortBy ===
                  "connectedCallsLowestToHighest" &&
                  t("actions.sorts.connectedCallsLowestToHighest")}
                {slaComplianceFilters.sortBy ===
                  "incomingCallsHighestToLowest" &&
                  t("actions.sorts.incomingCallsHighestToLowest")}
                {slaComplianceFilters.sortBy ===
                  "incomingCallsLowestToHighest" &&
                  t("actions.sorts.incomingCallsLowestToHighest")}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slaHighestToLowest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.slaHighestToLowest")}
              </SelectItem>
              <SelectItem value="slaLowestToHighest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.slaLowestToHighest")}
              </SelectItem>
              <SelectItem value="connectedCallsHighestToLowest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.connectedCallsHighestToLowest")}
              </SelectItem>
              <SelectItem value="connectedCallsLowestToHighest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.connectedCallsLowestToHighest")}
              </SelectItem>
              <SelectItem value="incomingCallsHighestToLowest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.incomingCallsHighestToLowest")}
              </SelectItem>
              <SelectItem value="incomingCallsLowestToHighest">
                <span className="text-gray-500">{t("actions.sortBy")}</span>{" "}
                {t("actions.sorts.incomingCallsLowestToHighest")}
              </SelectItem>
            </SelectContent>
          </Select>
          {/* search */}
          <Field preIcon={<Search />}>
            <Input
              placeholder={t("actions.search")}
              variant="field"
              value={slaComplianceFilters.search}
              onChange={(e) =>
                setSlaComplianceFilters((prev) => ({
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
            <AgentSlaComplianceCardSkeleton key={index} />
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
            <AgentSlaComplianceCard key={agent.ext} agent={agent} />
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

export default SlaComplianceAnalytics;
