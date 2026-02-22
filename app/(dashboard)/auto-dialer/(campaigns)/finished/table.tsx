"use client";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { columns } from "./columns";
import AutoDialerService from "@/services/auto-dialer.service";
import PaginatedTable from "@/components/Table/PaginatedTable";
import AutoDialerFinishedHead from "./head";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import { useEffect, useRef, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useTranslations } from "@/providers/TranslationProvider";

const FinishedCampaignsTable = () => {
  const t = useTranslations("autoDialer");
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["auto-dialer-finished-campaigns", filters, pagination],
    queryFn: async () =>
      await AutoDialerService.fetchFinishedCampaigns({
        ...filters,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  useEffect(() => {
    if (isError) {
      if (isAxiosError(error)) {
        toast.error(t("finishedCampaigns.toasts.error"), {
          description: error.response?.data?.message || t("finishedCampaigns.toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("finishedCampaigns.toasts.error"), {
        description: t("finishedCampaigns.toasts.errorDescription"),
      });
    }
  }, [isError, error]);

  // Track if this is the initial render
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Skip reset on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters]);

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
      >
        <AutoDialerFinishedHead filters={filters} setFilters={setFilters} />
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

export default FinishedCampaignsTable;
