"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { columns, CallBridgeCols } from "./columns";
import callBridgeService from "@/services/call-bridge.service";
import PaginatedTable from "@/components/Table/PaginatedTable";
import CallBridgeHead from "./head";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import { useEffect, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useTranslations } from "@/providers/TranslationProvider";
import { SortingState } from "@tanstack/react-table";

const CallBridgeTable = () => {
  const t = useTranslations("callBridge");
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortParams =
    sorting.length > 0 && ["name", "createdAt"].includes(sorting[0].id)
      ? {
          sortBy: sorting[0].id,
          sortOrder: sorting[0].desc ? "desc" : "asc",
        }
      : {};

  const { data, isLoading, isError, error } = useLocalizedQuery<{
    flows: CallBridgeCols[];
    totalItems: number;
    totalPages: number;
  }>({
    queryKey: ["call-bridge-list", filters, pagination, sorting],
    queryFn: async () =>
      await callBridgeService.fetchBridges({
        ...filters,
        ...sortParams,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
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
      toast.error("Error", { description: "An error occurred" });
    }
  }, [isError, error]);

  const handleFiltersChange = (nextFilters: typeof filters) => {
    setFilters(nextFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="rounded-lg flex-1 flex flex-col overflow-hidden">
      <PaginatedTable
        data={data?.flows || []}
        columns={columns(t)}
        pagination={{
          totalItems: data?.totalItems || 0,
          totalPages: data?.totalPages || 0,
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      >
        <CallBridgeHead filters={filters} setFilters={handleFiltersChange} />
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

export default CallBridgeTable;
