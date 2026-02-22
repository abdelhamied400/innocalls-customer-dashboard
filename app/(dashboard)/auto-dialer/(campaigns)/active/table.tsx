"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { AutoDialerCampaignCols, columns } from "./columns";
import AutoDialerService from "@/services/auto-dialer.service";
import PaginatedTable from "@/components/Table/PaginatedTable";
import AutoDialerActiveHead from "./head";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import { useEffect, useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useTranslations } from "@/providers/TranslationProvider";

const ActiveCampaignsTable = () => {
  const t = useTranslations("autoDialer");
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortParams = sorting.length > 0
    ? { sortBy: sorting[0].id, sortOrder: sorting[0].desc ? "desc" : "asc" }
    : {};

  const { data, isLoading, isError, error } = useLocalizedQuery<{
    totalPages: number;
    totalItems: number;
    campaigns: AutoDialerCampaignCols[];
  }>({
    queryKey: ["auto-dialer-active-campaigns", filters, pagination, sorting],
    queryFn: async () =>
      await AutoDialerService.fetchActiveCampaigns({
        ...filters,
        ...sortParams,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    refetchInterval: 30000,
    gcTime: 0,
  });

  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error("Error", {
          description: error.response?.data?.message || "An error occurred",
        });
        return;
      }
      toast.error("Error", {
        description: "An error occurred",
      });
    }
  }, [isError, error]);

  const handleFiltersChange = (nextFilters: typeof filters) => {
    setFilters(nextFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
      <PaginatedTable
        data={data?.campaigns || []}
        columns={columns(t)}
        pagination={{
          totalItems: data?.totalItems || 0,
          totalPages: data?.totalPages || 0,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      >
        <AutoDialerActiveHead
          filters={filters}
          setFilters={handleFiltersChange}
        />
        <PaginatedTableContent>
          <PaginatedTableHead />
          {isLoading && <PaginatedTableSkeleton />}
          {!isLoading && <PaginatedTableBody />}
        </PaginatedTableContent>
        {!isLoading && <PaginatedTablePagination />}
      </PaginatedTable>
    </div>
  );
};

export default ActiveCampaignsTable;
