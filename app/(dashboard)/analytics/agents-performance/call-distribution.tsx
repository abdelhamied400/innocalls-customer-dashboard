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
import AgentCallDistributionCard from "@/components/AgentCallDistributionCard";
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
  const [includeInternalCalls, setIncludeInternalCalls] = useState(false);
  const [callDistributionFilters, setCallDistributionFilters] =
    useState<CallDistributionFilters>({
      search: "",
      sortBy: "totalCalls",
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
      return agent.name.toLowerCase().includes(searchTerm);
    });

    // Then sort by selected criteria
    filtered.sort((a, b) => {
      switch (callDistributionFilters.sortBy) {
        case "totalCalls":
          return b.totalCalls - a.totalCalls;
        case "answeredCalls":
          return b.totalConnected - a.totalConnected;
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
      <div className="flex justify-between items-center flex-wrap border-b p-3">
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
        <div className="flex items-center gap-2">
          {/* Select SortBy */}
          <Select
            value={callDistributionFilters.sortBy}
            onValueChange={(value) =>
              setCallDistributionFilters((prev) => ({
                ...prev,
                sortBy: value,
              }))
            }
          >
            <SelectTrigger className="w-auto">
              <span className="capitalize">
                {t(`filters.sortBy.${callDistributionFilters.sortBy}`)}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="totalCalls">
                {t(`filters.sortBy.${"totalCalls"}`)}
              </SelectItem>
              <SelectItem value="answeredCalls">
                {t(`filters.sortBy.${"answeredCalls"}`)}
              </SelectItem>
            </SelectContent>
          </Select>
          {/* search */}
          <Field preIcon={<Search />}>
            <Input
              placeholder="Search"
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

      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-4 p-3",
          layoutVariant !== "both-closed" && "lg:grid-cols-1 xl:grid-cols-2"
        )}
      >
        {currentPageData?.map((agent) => (
          <AgentCallDistributionCard key={agent.ext} agent={agent} />
        ))}
      </div>

      {/* Enhanced Pagination */}
      {filteredAndSortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page</span>
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
              </SelectContent>
            </Select>
          </div>

          {/* Range information */}
          <div className="text-sm text-gray-600">
            {filteredAndSortedData.length > 0 && (
              <span>
                {startIndex + 1} –{" "}
                {Math.min(endIndex, filteredAndSortedData.length)} of{" "}
                {filteredAndSortedData.length}
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
